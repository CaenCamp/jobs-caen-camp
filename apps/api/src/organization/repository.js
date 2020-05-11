const omit = require('lodash.omit');
const pick = require('lodash.pick');

const { getDbClient } = require('../toolbox/dbConnexion');

const authorizedFilters = ['name', 'addressLocality', 'postalCode'];
const authorizedSort = ['name', 'id', 'addressLocality', 'postalCode'];

/**
 * Knex query for filtrated organization list
 *
 * @param {object} client - The Database client
 * @returns {Promise} - Knew query for filtrated organization list
 */
const getFilteredOrganizationsQuery = (client) => {
    return client
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
 * @param {object} queryParameters - An object og query parameters from Koa
 * @returns {Promise} - paginated object with paginated organization list and pagination
 */
const getPaginatedList = async (queryParameters) => {
    const client = getDbClient();
    return getFilteredOrganizationsQuery(client)
        .paginateRestList({
            queryParameters,
            authorizedFilters,
            authorizedSort,
        })
        .then(({ data, pagination }) => ({
            organizations: data.map(formatOrganizationForAPI),
            pagination,
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
const getOneByIdQuery = (client, organizationId) => {
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
 * @param {object} apiData - The validated data sent from API to create a new organization
 * @returns {Promise} - the created organization
 */
const createOne = async (apiData) => {
    const client = getDbClient();
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
            return getOneByIdQuery(client, newOrganizationId).then(
                formatOrganizationForAPI
            );
        })
        .catch((error) => ({ error }));
};

/**
 * Return an organization
 *
 * @param {object} organizationId - The organization identifier
 * @returns {Promise} - the organization
 */
const getOne = async (organizationId) => {
    const client = getDbClient();
    return getOneByIdQuery(client, organizationId)
        .then(formatOrganizationForAPI)
        .catch((error) => ({ error }));
};

/**
 * Delete an organization
 *
 * @param {object} organizationId - The organization identifier
 * @returns {Promise} - the id if the deleted organization or an empty object if organization is not in db
 */
const deleteOne = async (organizationId) => {
    const client = getDbClient();
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
 * @param {object} apiData - The validated data sent from API to update an organization
 * @returns {Promise} - the updated organization
 */
const updateOne = async (organizationId, apiData) => {
    const client = getDbClient();
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

    return getOneByIdQuery(client, organizationId)
        .then(formatOrganizationForAPI)
        .catch((error) => ({ error }));
};

module.exports = {
    createOne,
    deleteOne,
    formatOrganizationForAPI,
    getIdsToDelete,
    getOne,
    getPaginatedList,
    prepareOrganizationDataForSave,
    updateOne,
};
