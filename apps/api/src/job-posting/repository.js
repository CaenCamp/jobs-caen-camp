const omit = require('lodash.omit');
const { getDbClient } = require('../toolbox/dbConnexion');

const tableName = 'job_posting';
const authorizedSort = [
    'datePosted',
    'title',
    'jobStartDate',
    'validThrough',
    'employmentType',
    'organization.postal_code',
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
 * @returns {Promise} - Knew query for filtrated jobPosting list
 */
const getFilteredJobPostingsQuery = (client) => {
    return client
        .select(
            `${tableName}.*`,
            'organization.name as hiringOrganizationName',
            'organization.postal_code as hiringOrganizationPostalCode',
            'organization.address_locality as hiringOrganizationAddressLocality',
            'organization.address_country as hiringOrganizationAddressCountry',
            'organization.image as hiringOrganizationImage',
            'organization.url as hiringOrganizationUrl'
        )
        .from(tableName)
        .join('organization', {
            'organization.id': `${tableName}.hiring_organization_id`,
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
        if (filter === 'sortBy') {
            const sortName = Object.prototype.hasOwnProperty.call(
                filterNamesToChange,
                queryParameters.sortBy
            )
                ? filterNamesToChange[queryParameters.sortBy]
                : queryParameters.sortBy;

            return {
                ...acc,
                sortBy: sortName,
            };
        }

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
 * @param {object} queryParameters - An object og query parameters from Koa
 * @returns {Promise} - paginated object with paginated jobPosting list and pagination
 */
const getPaginatedList = async (queryParameters) => {
    const client = getDbClient();
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
 * @param {string} jobPostingId - jobPosting Id
 * @returns {Promise} - Knew query for single jobPosting
 */
const getOneByIdQuery = (client, id) => {
    return client
        .first(
            `${tableName}.*`,
            'organization.name as hiringOrganizationName',
            'organization.postal_code as hiringOrganizationPostalCode',
            'organization.address_locality as hiringOrganizationAddressLocality',
            'organization.address_country as hiringOrganizationAddressCountry',
            'organization.image as hiringOrganizationImage',
            'organization.url as hiringOrganizationUrl'
        )
        .from(tableName)
        .join('organization', {
            'organization.id': `${tableName}.hiring_organization_id`,
        })
        .where({ [`${tableName}.id`]: id });
};

/**
 * Return a jobPosting
 *
 * @param {object} organizationId - The jobPosting identifier
 * @returns {Promise} - the jobPosting
 */
const getOne = async (id) => {
    const client = getDbClient();
    return getOneByIdQuery(client, id)
        .then(formatJobPostingForAPI)
        .catch((error) => ({ error }));
};

/**
 * Return the created jobPosting
 *
 * @param {object} apiData - The validated data sent from API to create a new jobPosting
 * @returns {Promise} - the created jobPosting
 */
const createOne = async (apiData) => {
    const client = getDbClient();
    const organization = await client
        .first('id')
        .from('organization')
        .where({ id: apiData.hiringOrganizationId });

    if (!organization) {
        return { error: new Error('this organization does not exist') };
    }

    return client(tableName)
        .returning('id')
        .insert(apiData)
        .then(([newJobPostingId]) => {
            return getOneByIdQuery(client, newJobPostingId).then(
                formatJobPostingForAPI
            );
        })
        .catch((error) => ({ error }));
};

/**
 * Delete a jobPosting
 *
 * @param {object} jobPostingId - The jobPosting identifier
 * @returns {Promise} - the id of the deleted jobPosting or an empty object if jobPosting is not in db
 */
const deleteOne = async (id) => {
    const client = getDbClient();
    return client(tableName)
        .where({ id })
        .del()
        .then((nbDeletion) => {
            return nbDeletion ? { id } : {};
        })
        .catch((error) => ({ error }));
};

/**
 * Update a jobPosting
 *
 * @param {object} jobPostingId - The jobPosting identifier
 * @param {object} apiData - The validated data sent from API to update the jobPosting
 * @returns {Promise} - the updated JobPosting
 */
const updateOne = async (id, apiData) => {
    const client = getDbClient();
    // check that jobPosting exist
    const currentJobPosting = await client
        .first('id', 'hiringOrganizationId')
        .from(tableName)
        .where({ id });
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
    const updatedJobPosting = await client(tableName)
        .where({ id })
        .update(apiData)
        .catch((error) => ({ error }));
    if (updatedJobPosting.error) {
        return updatedJobPosting;
    }

    // return the complete jobPosting from db
    return getOneByIdQuery(client, id)
        .then(formatJobPostingForAPI)
        .catch((error) => ({ error }));
};

module.exports = {
    createOne,
    deleteOne,
    formatJobPostingForAPI,
    getOne,
    getPaginatedList,
    renameFiltersFromAPI,
    updateOne,
};
