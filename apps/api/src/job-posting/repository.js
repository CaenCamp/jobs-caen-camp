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
    'datePosted_after',
    'datePosted_before',
    'jobStartDate_after',
    'jobStartDate_before',
    'validThrough',
    'hiringOrganizationName',
    'hiringOrganizationPostalCode',
    'hiringOrganizationAddressLocality',
    'hiringOrganizationAddressCountry',
    'q',
];

/**
 * Knex query for filtrated jobPosting list
 *
 * @param {object} client - The Database client
 * @param {Array} filters - array of jobPosting Filters {name: 'foo', value: 'bar', operator: 'eq' }
 * @param {object} sort - Sort parameters { sortBy, orderBy }
 * @returns {Promise} - Knew query for filtrated jobPosting list
 */
const getFilteredJobPostingsQuery = (client, filters, sort) => {
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

    //global.console.log('unfiltered query:', query);

    filters.map((filter) => {
        switch (filter.name) {
            case 'hiringOrganizationPostalCode':
                filter = 'organization.postal_code';
                break;
            case 'hiringOrganizationName':
                filter.name = 'organization.name';
                break;
            case 'hiringOrganizationAddressLocality':
                filter.name = 'organization.address_locality';
                break;
            case 'hiringOrganizationAddressCountry':
                filter.name = 'organization.address_country';
                break;
            default:
                break;
        }
    });

    filters.map((filter) => {
        switch (filter.operator) {
            case 'eq':
                query.andWhere(filter.name, '=', filter.value);
                break;
            case 'lt':
                query.andWhere(filter.name, '<', filter.value);
                break;
            case 'lte':
                query.andWhere(filter.name, '<=', filter.value);
                break;
            case 'gt':
                query.andWhere(filter.name, '>', filter.value);
                break;
            case 'gte':
                query.andWhere(filter.name, '>=', filter.value);
                break;
            case '%l%':
                query.andWhere(filter.name, 'LIKE', `%${filter.value}%`);
                break;
            case '%l':
                query.andWhere(filter.name, 'LIKE', `%${filter.value}`);
                break;
            case 'l%':
                query.andWhere(filter.name, 'LIKE', `${filter.value}%`);
                break;
            default:
                signale.log(
                    `The filter operator ${filter.operator} is not managed`
                );
        }
    });

    if (sort && sort.length) {
        query.orderBy(...sort);
    }
    global.console.log('filtered query:', query._statements);

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
 * @param {object} sort - Sort parameters {sortBy: title, orderBy: ASC}
 * @param {object} pagination - Pagination {perPage: 10, currentPage: 1}
 * @returns {Promise} - paginated object with paginated jobPosting list and totalCount
 */
const getJobPostingPaginatedList = async ({
    client,
    // sort, filters and pagination were grouped by prepareQueryParameters()
    preparedParameters,
}) => {
    // let's debug
    global.console.log('the prepared parameters:\n', preparedParameters);

    const query = getFilteredJobPostingsQuery(
        client,
        filtersSanitizer(
            preparedParameters.filters,
            jobPostingFilterableFields
        ),
        sortSanitizer(preparedParameters.sort, jobPostingSortableFields)
    );

    const [perPage, currentPage] = paginationSanitizer(
        preparedParameters.pagination
    );

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
