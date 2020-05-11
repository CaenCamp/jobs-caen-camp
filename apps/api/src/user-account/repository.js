const { getDbClient } = require('../toolbox/dbConnexion');

const tableName = `user_account`;

/**
 * Return a user account if exist
 *
 * @param {string} username - The searched username
 * @returns {Promise} - the user
 */
const getOneByUsername = async (username) => {
    const client = getDbClient();
    return client(tableName)
        .first('*')
        .where({ username })
        .catch((error) => ({ error }));
};

/**
 * Return a user account if exist
 *
 * @param {string} id - The user id
 * @returns {Promise} - the user
 */
const getOne = async (id) => {
    const client = getDbClient();
    return client(tableName)
        .first('*')
        .where({ id })
        .catch((error) => ({ error }));
};

module.exports = {
    getOne,
    getOneByUsername,
};
