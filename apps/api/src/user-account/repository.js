const tableName = `user_account`;

/**
 * Return a user account if exist
 *
 * @param {object} client - The Database client
 * @param {string} username - The searched username
 * @returns {Promise} - the user
 */
const getOneByUsername = async ({ client, username }) => {
    return client(tableName)
        .first('*')
        .where({ username })
        .catch((error) => ({ error }));
};

/**
 * Return a user account if exist
 *
 * @param {object} client - The Database client
 * @param {string} id - The user id
 * @returns {Promise} - the user
 */
const getOne = async ({ client, id }) => {
    return client(tableName)
        .first('*')
        .where({ id })
        .catch((error) => ({ error }));
};

module.exports = {
    getOne,
    getOneByUsername,
};
