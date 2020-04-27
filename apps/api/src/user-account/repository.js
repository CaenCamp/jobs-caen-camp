const tableName = `user_account`;

/**
 * Return a user account if exist
 *
 * @param {object} client - The Database client
 * @param {object} username - The searched username
 * @returns {Promise} - the user
 */
const getOneByUsername = async ({ client, username }) => {
    return client(tableName)
        .first('*')
        .where({ username })
        .catch((error) => ({ error }));
};

module.exports = {
    getOneByUsername,
};
