const omit = require('lodash.omit');

const authorizedSort = [
    'datePosted',
    'title',
    'jobStartDate',
    'validThrough',
    'employmentType',
];

const authorizedFilters = [
    'title',
    'skills',
    'employmentType',
    'datePosted',
    'jobStartDate',
    'validThrough',
    'organization.name',
    'organization.address_locality',
    'organization.postal_code',
];

/**
 * Knex query for filtrated jobPosting list
 *
 * @param {object} client - The Database client
 * @param {Array} filters - array of jobPosting Filters {name: 'foo', value: 'bar', operator: 'eq' }
 * @param {object} sort - Sort parameters { sortBy, orderBy }
 * @returns {Promise} - Knew query for filtrated jobPosting list
 */
const getFilteredJobPostingsQuery = (client) => {
    return client
        .select(
            'job_posting.*',
            'organization.name as hiringOrganizationName',
            'organization.postal_code as hiringOrganizationPostalCode',
            'organization.address_locality as hiringOrganizationAddressLocality',
            'organization.address_country as hiringOrganizationAddressCountry',
            'organization.image as hiringOrganizationImage',
            'organization.url as hiringOrganizationUrl'
        )
        .from('job_posting')
        .join('organization', {
            'organization.id': 'job_posting.hiring_organization_id',
        });
};

/**
 * Transforms a db queried organization into an organization object for API.
 *
 * @param {object} dbOrganization - organization data from database
 * @returns {object} an organization object as describe in OpenAPI contract
 */
const formatJobPostingForAPI = (dbJobPosting) => {
    return dbJobPosting
        ? {
              ...omit(dbJobPosting, [
                  'hiringOrganizationId',
                  'hiringOrganizationName',
                  'hiringOrganizationPostalCode',
                  'hiringOrganizationAddressLocality',
                  'hiringOrganizationAddressCountry',
                  'hiringOrganizationImage',
                  'hiringOrganizationUrl',
              ]),
              hiringOrganization: {
                  identifier: dbJobPosting.hiringOrganizationId,
                  name: dbJobPosting.hiringOrganizationName,
                  image: dbJobPosting.hiringOrganizationImage,
                  url: dbJobPosting.hiringOrganizationUrl,
                  address: {
                      addressCountry:
                          dbJobPosting.hiringOrganizationAddressCountry,
                      addressLocality:
                          dbJobPosting.hiringOrganizationAddressLocality,
                      postalCode: dbJobPosting.hiringOrganizationPostalCode,
                  },
              },
              datePosted: dbJobPosting.datePosted
                  ? dbJobPosting.datePosted.toISOString().substring(0, 10)
                  : null,
              jobStartDate: dbJobPosting.jobStartDate
                  ? dbJobPosting.jobStartDate.toISOString().substring(0, 10)
                  : null,
              validThrough: dbJobPosting.validThrough
                  ? dbJobPosting.validThrough.toISOString().substring(0, 10)
                  : null,
          }
        : {};
};

/**
 * Return queryParameters with name as real row db name
 * As it's difficult to have a name for filter used on join table
 * query parameters name from API are not necessary the sames
 * than table row names
 *
 * @param {Object} queryParameters
 * @return {Object} Query parameters renamed as db row name
 */
const renameFiltersFromAPI = (queryParameters) => {
    const filterNamesToChange = {
        hiringOrganizationPostalCode: 'organization.postal_code',
        hiringOrganizationName: 'organization.name',
        hiringOrganizationAddressLocality: 'organization.address_locality',
    };

    return Object.keys(queryParameters).reduce((acc, filter) => {
        const filterName = Object.prototype.hasOwnProperty.call(
            filterNamesToChange,
            filter
        )
            ? filterNamesToChange[filter]
            : filter;
        return {
            ...acc,
            [filterName]: queryParameters[filter],
        };
    }, {});
};

/**
 * Return paginated and filtered list of jobPosting
 *
 * @param {object} client - The Database client
 * @param {object} queryParameters - An object og query parameters from Koa
 * @returns {Promise} - paginated object with paginated jobPosting list and pagination
 */
const getJobPostingPaginatedList = async ({ client, queryParameters }) => {
    return getFilteredJobPostingsQuery(client)
        .paginateRestList({
            queryParameters: renameFiltersFromAPI(queryParameters),
            authorizedFilters,
            authorizedSort,
        })
        .then(({ data, pagination }) => ({
            jobPostings: data.map(formatJobPostingForAPI),
            pagination,
        }));
};

/**
 * Knex query for single jobPosting
 *
 * @param {object} client - The Database client
 * @param {string} jobPostingId - jobPosting Id
 * @returns {Promise} - Knew query for single jobPosting
 */
const getJobPostingByIdQuery = (client, jobPostingId) => {
    return client
        .first(
            'job_posting.*',
            'organization.name as hiringOrganizationName',
            'organization.postal_code as hiringOrganizationPostalCode',
            'organization.address_locality as hiringOrganizationAddressLocality',
            'organization.address_country as hiringOrganizationAddressCountry',
            'organization.image as hiringOrganizationImage',
            'organization.url as hiringOrganizationUrl'
        )
        .from('job_posting')
        .join('organization', {
            'organization.id': 'job_posting.hiring_organization_id',
        })
        .where({ 'job_posting.id': jobPostingId });
};

/**
 * Return a jobPosting
 *
 * @param {object} client - The Database client
 * @param {object} organizationId - The jobPosting identifier
 * @returns {Promise} - the jobPosting
 */
const getJobPosting = async ({ client, jobPostingId }) => {
    return getJobPostingByIdQuery(client, jobPostingId)
        .then(formatJobPostingForAPI)
        .catch((error) => ({ error }));
};

/**
 * Return the created jobPosting
 *
 * @param {object} client - The Database client
 * @param {object} apiData - The validated data sent from API to create a new jobPosting
 * @returns {Promise} - the created jobPosting
 */
const createJobPosting = async ({ client, apiData }) => {
    const organization = await client
        .first('id')
        .from('organization')
        .where({ id: apiData.hiringOrganizationId });

    if (!organization) {
        return { error: new Error('this organization does not exist') };
    }

    return client('job_posting')
        .returning('id')
        .insert(apiData)
        .then(([newJobPostingId]) => {
            return getJobPostingByIdQuery(client, newJobPostingId).then(
                formatJobPostingForAPI
            );
        })
        .catch((error) => ({ error }));
};

/**
 * Delete a jobPosting
 *
 * @param {object} client - The Database client
 * @param {object} jobPostingId - The jobPosting identifier
 * @returns {Promise} - the id of the deleted jobPosting or an empty object if jobPosting is not in db
 */
const deleteJobPosting = async ({ client, jobPostingId }) => {
    return client('job_posting')
        .where({ id: jobPostingId })
        .del()
        .then((nbDeletion) => {
            return nbDeletion ? { id: jobPostingId } : {};
        })
        .catch((error) => ({ error }));
};

/**
 * Update a jobPosting
 *
 * @param {object} client - The Database client
 * @param {object} jobPostingId - The jobPosting identifier
 * @param {object} apiData - The validated data sent from API to update the jobPosting
 * @returns {Promise} - the updated JobPosting
 */
const updateJobPosting = async ({ client, jobPostingId, apiData }) => {
    // check that jobPosting exist
    const currentJobPosting = await client
        .first('id', 'hiringOrganizationId')
        .from('job_posting')
        .where({ id: jobPostingId });
    if (!currentJobPosting) {
        return {};
    }

    // check that if the hiringOrganizationId has change, the new organization exist
    if (
        currentJobPosting.hiringOrganizationId !== apiData.hiringOrganizationId
    ) {
        const organization = await client
            .first('id')
            .from('organization')
            .where({ id: apiData.hiringOrganizationId });

        if (!organization) {
            return {
                error: new Error('the new hiring organization does not exist'),
            };
        }
    }

    // update the jobPosting
    const updatedJobPosting = await client('job_posting')
        .where({ id: jobPostingId })
        .update(apiData)
        .catch((error) => ({ error }));
    if (updatedJobPosting.error) {
        return updatedJobPosting;
    }

    // return the complete jobPosting from db
    return getJobPostingByIdQuery(client, jobPostingId)
        .then(formatJobPostingForAPI)
        .catch((error) => ({ error }));
};

module.exports = {
    createJobPosting,
    deleteJobPosting,
    formatJobPostingForAPI,
    getJobPosting,
    getJobPostingPaginatedList,
    updateJobPosting,
};
