const omit = require('lodash.omit');
const signale = require('signale');

const {
    filtersSanitizer,
    paginationSanitizer,
    sortSanitizer,
} = require('../toolbox/sanitizers');

const jobPostingSortableFields = [
    'datePosted',
    'title',
    'jobStartDate',
    'validThrough',
    'employmentType',
    'hiringOrganizationName',
    'hiringOrganizationIdentifier',
    'hiringOrganizationPostalCode',
    'hiringOrganizationAddressLocality',
    'hiringOrganizationAddressCountry',
];

const jobPostingFilterableFields = [
    'title',
    'skills',
    'employmentType',
    'datePosted_before',
    'datePosted_after',
    'jobStartDate_before',
    'jobStartDate_after',
    'validThrough_before',
    'validThrough_after',
    'hiringOrganizationName',
    'hiringOrganizationPostalCode',
    'hiringOrganizationAddressLocality',
    'hiringOrganizationAddressCountry',
];

/**
 * Knex query for filtrated jobPosting list
 *
 * @param {object} client - The Database client
 * @param {object} filters - jobPosting Filter
 * @param {Array} sort - Sort parameters [columnName, direction]
 * @returns {Promise} - Knew query for filtrated jobPosting list
 */
const getFilteredJobPostingsQuery = (client, filters, sort) => {
    const {
        title,
        skills,
        employmentType,
        hiringOrganizationName,
        hiringOrganizationPostalCode,
        hiringOrganizationAddressLocality,
        hiringOrganizationAddressCountry,
        ...restFiltersThatMustBeDates
    } = filters;
    const query = client
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

    if (title) {
        query.andWhere('title', 'LIKE', `%${title}%`);
    }
    if (skills) {
        query.andWhere('skills', 'LIKE', `%${skills}%`);
    }
    if (employmentType) {
        query.andWhere('employmentType', employmentType);
    }
    if (hiringOrganizationPostalCode) {
        query.andWhere(
            'organization.postal_code',
            'LIKE',
            `${hiringOrganizationPostalCode}%`
        );
    }
    if (hiringOrganizationName) {
        query.andWhere(
            'organization.name',
            'LIKE',
            `%${hiringOrganizationName}%`
        );
    }
    if (hiringOrganizationAddressLocality) {
        query.andWhere(
            'organization.address_locality',
            'LIKE',
            `${hiringOrganizationAddressLocality}%`
        );
    }
    if (hiringOrganizationAddressCountry) {
        query.andWhere(
            'organization.address_country',
            'LIKE',
            `${hiringOrganizationAddressCountry}%`
        );
    }

    Object.keys(restFiltersThatMustBeDates).map((key) => {
        try {
            const queryDate = new Date(restFiltersThatMustBeDates[key]);
            const [what, when] = key.split('_');
            if (when && ['after', 'before'].includes(when)) {
                query.andWhere(
                    what,
                    when === 'after' ? '>' : '<',
                    queryDate.toISOString()
                );
            }
        } catch (error) {
            signale.debug('the date in filter is not well formated');
        }
    });

    if (sort && sort.length) {
        query.orderBy(...sort);
    }

    return query;
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
 * Return paginated and filtered list of jobPosting
 *
 * @param {object} client - The Database client
 * @param {object} filters - JobPosting Filters
 * @param {Array} sort - Sort parameters [columnName, direction]
 * @param {object} pagination - Pagination {perPage: 10, currentPage: 1}
 * @returns {Promise} - paginated object with paginated jobPosting list and totalCount
 */
const getJobPostingPaginatedList = async ({
    client,
    filters,
    sort,
    pagination,
}) => {
    const query = getFilteredJobPostingsQuery(
        client,
        filtersSanitizer(filters, jobPostingFilterableFields),
        sortSanitizer(sort, jobPostingSortableFields)
    );
    const [perPage, currentPage] = paginationSanitizer(pagination);

    return query
        .paginate({ perPage, currentPage, isLengthAware: true })
        .then((result) => ({
            jobPostings: result.data.map(formatJobPostingForAPI),
            pagination: result.pagination,
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
