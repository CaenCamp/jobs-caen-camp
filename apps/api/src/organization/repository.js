const omit = require('lodash.omit');
const pick = require('lodash.pick');
const signale = require('signale');

const {
    filtersSanitizer,
    formatPaginationContentRange,
    paginationSanitizer,
    sortSanitizer,
} = require('../toolbox/sanitizers');

const OrganizationFilterableFields = [
    'name',
    'address_locality',
    'postal_code',
    'q',
];
const OrganizationSortableFields = [
    'name',
    'id',
    'address_locality',
    'postal_code',
];

const {
    FILTER_OPERATOR_EQ,
    FILTER_OPERATOR_GT,
    FILTER_OPERATOR_GTE,
    FILTER_OPERATOR_LT,
    FILTER_OPERATOR_LTE,
    FILTER_OPERATOR_IN,
    FILTER_OPERATOR_LP,
    FILTER_OPERATOR_PL,
    FILTER_OPERATOR_PLP,
} = require('../toolbox/sanitizers');

/**
 * Knex query for filtrated organization list
 *
 * @param {object} client - The Database client
 * @param {Array} filters - Organization Filter {name: 'foo', value: 'bar', operator: 'eq' }
 * @param {object} sort - Sort parameters { sortBy, orderBy }
 * @returns {Promise} - Knew query for filtrated organization list
 */
const getFilteredOrganizationsQuery = (client, filters, sort) => {
    // const { name, address_locality, postal_code, ...restFilters } = filters;
    const query = client
        .select(
            'organization.*',
            client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
                'identifier',
                contact_point.id,
                'email',
                contact_point.email,
                'telephone',
                contact_point.telephone,
                'name',
                contact_point.name,
                'contactType',
                contact_point.contact_type
            ) ORDER BY contact_point.contact_type))
            FROM contact_point WHERE contact_point.organization_id = organization.id) as contact_points`)
        )
        .from('organization');
    // .where(restFilters);

    filters.map((filter) => {
        switch (filter.operator) {
            case FILTER_OPERATOR_EQ:
                query.andWhere(filter.name, '=', filter.value);
                break;
            case FILTER_OPERATOR_LT:
                query.andWhere(filter.name, '<', filter.value);
                break;
            case FILTER_OPERATOR_LTE:
                query.andWhere(filter.name, '<=', filter.value);
                break;
            case FILTER_OPERATOR_GT:
                query.andWhere(filter.name, '>', filter.value);
                break;
            case FILTER_OPERATOR_GTE:
                query.andWhere(filter.name, '>=', filter.value);
                break;
            case FILTER_OPERATOR_IN:
                query.whereIn(filter.name, JSON.parse(filter.value));
                break;
            case FILTER_OPERATOR_PLP:
                query.andWhere(filter.name, 'LIKE', `%${filter.value}%`);
                break;
            case FILTER_OPERATOR_PL:
                query.andWhere(filter.name, 'LIKE', `%${filter.value}`);
                break;
            case FILTER_OPERATOR_LP:
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

    return query;
};

/**
 * Transforms a db queried organization into an organization object for API.
 *
 * @param {object} dbOrganization - organization data from database
 * @returns {object} an organization object as describe in OpenAPI contract
 */
const formatOrganizationForAPI = (dbOrganization) => ({
    ...omit(dbOrganization, [
        'addressCountry',
        'addressLocality',
        'postalCode',
        'streetAddress',
    ]),
    address: {
        ...pick(dbOrganization, [
            'addressCountry',
            'addressLocality',
            'postalCode',
            'streetAddress',
        ]),
    },
});

/**
 * Return paginated and filtered list of organization
 *
 * @param {object} client - The Database client
 * @param {object} filters - Organization Filter
 * @param {object} sort - Sort parameters { sortBy, orderBy }
 * @param {object} pagination - Pagination {perPage: 10, currentPage: 1}
 * @returns {Promise} - paginated object with paginated organization list and totalCount
 */
const getOrganizationPaginatedList = async ({
    client,
    // sort, filters and pagination were grouped by prepareQueryParameters()
    preparedParameters,
}) => {
    // let's debug
    global.console.log(
        'this are the prepared parameters:\n',
        preparedParameters
    );

    const query = getFilteredOrganizationsQuery(
        client,
        filtersSanitizer(
            preparedParameters.filters,
            OrganizationFilterableFields
        ),
        sortSanitizer(preparedParameters.sort, OrganizationSortableFields)
    );
    const [perPage, currentPage] = paginationSanitizer(
        preparedParameters.pagination
    );

    return query
        .paginate({ perPage, currentPage, isLengthAware: true })
        .then((result) => ({
            organizations: result.data.map(formatOrganizationForAPI),
            pagination: result.pagination,
        }));
};

/**
 * Returns a organization and contact point object ready to be saved.
 * The data sent to this function is supposed to be complete and therefore tested beforehand.
 *
 * @param {object} dataFromApi - The validated data sent from API to create a new organization
 * @returns {object} - an object with valid data for an organization and for a contactPoint
 */
const prepareOrganizationDataForSave = (dataFromApi) => ({
    organization: {
        ...omit(dataFromApi, ['address', 'contactPoints']),
        addressCountry: dataFromApi.address.addressCountry || null,
        addressLocality: dataFromApi.address.addressLocality,
        postalCode: dataFromApi.address.postalCode,
        streetAddress: dataFromApi.address.streetAddress,
    },
    contactPoint: dataFromApi.contactPoints[0],
    contactPoints: dataFromApi.contactPoints,
});

/**
 * Knex query for signle organization
 *
 * @param {object} client - The Database client
 * @param {string} organizationId - Organization Id
 * @returns {Promise} - Knew query for single organization
 */
const getOrganizationByIdQuery = (client, organizationId) => {
    return client
        .table('organization')
        .first(
            'organization.*',
            client.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
                'identifier',
                contact_point.id,
                'email',
                contact_point.email,
                'telephone',
                contact_point.telephone,
                'name',
                contact_point.name,
                'contactType',
                contact_point.contact_type
            ) ORDER BY contact_point.contact_type))
            FROM contact_point WHERE contact_point.organization_id = organization.id) as contact_points`)
        )
        .where({ id: organizationId });
};

/**
 * Return the created organization
 *
 * @param {object} client - The Database client
 * @param {object} apiData - The validated data sent from API to create a new organization
 * @returns {Promise} - the created organization
 */
const createOrganization = async ({ client, apiData }) => {
    const { organization, contactPoints } = prepareOrganizationDataForSave(
        apiData
    );

    return client
        .transaction((trx) => {
            client('organization')
                .transacting(trx)
                .returning('id')
                .insert(organization)
                .then(([organizationId]) => {
                    const contactsToCreate = contactPoints.reduce(
                        (acc, contact) => {
                            acc.push(
                                client('contact_point')
                                    .transacting(trx)
                                    .insert({
                                        ...contact,
                                        organizationId,
                                    })
                            );

                            return acc;
                        },
                        []
                    );

                    return Promise.all(contactsToCreate).then(
                        () => organizationId
                    );
                })
                .then(trx.commit)
                .catch(trx.rollback);
        })
        .then((newOrganizationId) => {
            return getOrganizationByIdQuery(client, newOrganizationId).then(
                formatOrganizationForAPI
            );
        })
        .catch((error) => ({ error }));
};

/**
 * Return an organization
 *
 * @param {object} client - The Database client
 * @param {object} organizationId - The organization identifier
 * @returns {Promise} - the organization
 */
const getOrganization = async ({ client, organizationId }) => {
    return getOrganizationByIdQuery(client, organizationId)
        .then(formatOrganizationForAPI)
        .catch((error) => ({ error }));
};

/**
 * Delete an organization
 *
 * @param {object} client - The Database client
 * @param {object} organizationId - The organization identifier
 * @returns {Promise} - the id if the deleted organization or an empty object if organization is not in db
 */
const deleteOrganization = async ({ client, organizationId }) => {
    return client('organization')
        .where({ id: organizationId })
        .del()
        .then((nbDeletion) => {
            return nbDeletion ? { id: organizationId } : {};
        })
        .catch((error) => ({ error }));
};

/**
 * Method returning in array of chlidren's ids linked (1-n) to an object during parent editing
 *
 * @param {object} objectsInDb - an array of object's id linked (1-n) to the object edited where identifier is id
 * @param {object} objectsFromApi - an objects array linked (1-n) to the object edited where identifier is identifier
 * @returns {array} an array of id that should be deleted from database
 */
const getIdsToDelete = (idsInDb, objectsFromApi) => {
    const idsApi = objectsFromApi
        .map((object) => object.identifier)
        .filter((id) => id);
    return idsInDb.filter((id) => !idsApi.includes(id));
};

/**
 * Update an organization
 *
 * @param {object} client - The Database client
 * @param {object} apiData - The validated data sent from API to update an organization
 * @returns {Promise} - the updated organization
 */
const updateOrganization = async ({ client, organizationId, apiData }) => {
    const { organization, contactPoints } = prepareOrganizationDataForSave(
        apiData
    );

    try {
        await client.transaction((trx) => {
            client('organization')
                .transacting(trx)
                .where({ id: organizationId })
                .update(organization)
                .then(async () => {
                    const existingContactIds = await client('contact_point')
                        .select('id')
                        .where({ organization_id: organizationId })
                        .then((contacts) =>
                            contacts.map((contact) => contact.id)
                        );

                    const contactUpdates = contactPoints.reduce(
                        (acc, contact) => {
                            // Contacts to update
                            if (
                                contact.identifier &&
                                existingContactIds.includes(contact.identifier)
                            ) {
                                acc.push(
                                    client('contact_point')
                                        .transacting(trx)
                                        .where({ id: contact.identifier })
                                        .update(omit(contact, ['identifier']))
                                );
                            }
                            // Contacts to create
                            if (!contact.identifier) {
                                acc.push(
                                    client('contact_point')
                                        .transacting(trx)
                                        .insert({
                                            ...contact,
                                            organizationId,
                                        })
                                );
                            }

                            return acc;
                        },
                        []
                    );

                    // Contacts to delete
                    const idsToDelete = getIdsToDelete(
                        existingContactIds,
                        contactPoints
                    );
                    idsToDelete.map((id) =>
                        contactUpdates.push(
                            client('contact_point')
                                .transacting(trx)
                                .where({ id })
                                .del()
                        )
                    );
                    return Promise.all(contactUpdates);
                })
                .then(trx.commit)
                .catch(trx.rollback);
        });
    } catch (error) {
        return { error };
    }

    return getOrganizationByIdQuery(client, organizationId)
        .then(formatOrganizationForAPI)
        .catch((error) => ({ error }));
};

module.exports = {
    createOrganization,
    deleteOrganization,
    filtersSanitizer,
    formatOrganizationForAPI,
    formatPaginationContentRange,
    getIdsToDelete,
    getOrganization,
    getOrganizationPaginatedList,
    paginationSanitizer,
    prepareOrganizationDataForSave,
    sortSanitizer,
    updateOrganization,
};
