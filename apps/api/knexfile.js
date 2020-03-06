const config = require('./src/config');

/**
 * Convert a SnakeCase String to a snake_case one
 *
 * @param {string} str
 * @param {string} separator
 * @returns {string}
 */
function convertToSnakeCase(str, separator) {
    separator = typeof separator === 'undefined' ? '_' : separator;

    return str
        .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
        .toLowerCase();
}

module.exports = {
    client: 'pg',
    connection: config.db,
    wrapIdentifier: (value, origImpl) => origImpl(convertToSnakeCase(value)),
    migrations: {
        tableName: 'migrations',
    },
};
