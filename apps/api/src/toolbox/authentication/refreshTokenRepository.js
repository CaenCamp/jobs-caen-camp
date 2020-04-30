const tableName = 'refresh_token';

/**
 * Return a new refresh token for a specific user
 *
 * @param {object} client - The Database client
 * @param {object} data - The token data for token creation
 * @returns {Promise} - the refresh token
 */
const createOneForUser = async ({ client, data }) => {
    return client(tableName)
        .insert(data)
        .returning('*')
        .catch((error) => ({ error }));
};

/**
 * Return a refresh token if exist
 *
 * @param {object} client - The Database client
 * @param {string} id - The token id
 * @returns {Promise} - the refresh token
 */
const getOne = async ({ client, id }) => {
    return client(tableName)
        .first('*')
        .where({ id })
        .catch((error) => ({ error }));
};

/**
 * Return a user refresh token if exist
 *
 * @param {object} client - The Database client
 * @param {string} userId - The user id that owned the token
 * @returns {Promise} - the refresh token
 */
const getOneByUserId = async ({ client, userId }) => {
    return client(tableName)
        .first('*')
        .where({ userId })
        .catch((error) => ({ error }));
};

/**
 * Delete refresh token if exist
 *
 * @param {object} client - The Database client
 * @param {string} id - The id's token to delete
 * @returns {Promise} - the deleted token id
 */
const deleteOne = async ({ client, id }) => {
    return client(tableName)
        .where({ id })
        .del()
        .then((nbDeletion) => {
            return nbDeletion ? { id } : {};
        })
        .catch((error) => ({ error }));
};

module.exports = {
    createOneForUser,
    deleteOne,
    getOne,
    getOneByUserId,
};
