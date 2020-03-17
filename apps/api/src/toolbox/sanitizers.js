/**
 * Method to clean the filters sent in query parameters
 *
 * @param {object} filters from query parameters
 * @param {object} filterableFields the fields allowed to be used as a filter
 * @returns {object} Ready-to-use filters for the sql query
 */
const filtersSanitizer = (filters, filterableFields) => {
    if (!filters || typeof filters !== 'object') {
        return {};
    }

    return Object.keys(filters)
        .filter(key => filterableFields.includes(key))
        .filter(key => filters[key] !== undefined)
        .filter(key => {
            if (typeof filters[key] === 'string') {
                return filters[key].trim() !== '';
            }
            return true;
        })
        .reduce((obj, key) => {
            obj[key] = filters[key];
            return obj;
        }, {});
};

/**
 * Method to clean the sort sent in query parameters
 *
 * @param {object} sort - sort from query parameters
 * @param {object} sortableFields the fields allowed to be used as a sort
 * @returns {object} Ready-to-use filters for the sql query
 */
const sortSanitizer = (sort, sortableFields) => {
    const sortTwoFirstParameters = [
        sort ? sort[0] || null : null,
        sort ? sort[1] || null : null,
    ];
    if (
        !sortTwoFirstParameters ||
        !sortableFields.includes(sortTwoFirstParameters[0])
    ) {
        return [sortableFields[0], 'ASC'];
    }

    if (!['ASC', 'DESC'].includes(sort[1])) {
        return [sortTwoFirstParameters[0], 'ASC'];
    }

    return sortTwoFirstParameters;
};

/**
 * Function to clean the pagination sent in query parameters
 *
 * @param {object} pagination - pagination object from query parameters
 * @returns {object} Ready-to-use filters for the sql query
 */
const paginationSanitizer = pagination => {
    const sortTwoFirstParameters = [
        pagination ? parseInt(pagination[0]) || null : null,
        pagination ? parseInt(pagination[1]) || null : null,
    ];

    if (
        !Number.isInteger(sortTwoFirstParameters[0]) ||
        !Number.isInteger(sortTwoFirstParameters[1])
    ) {
        return [10, 1];
    }

    return sortTwoFirstParameters;
};

/**
 * Transforms the Knex paging object into a string compatible with the "content-Range" header.
 * https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Content-Range
 *
 * @param {string} objectType - type of object returned in the paginated collection
 * @param {object} pagination - Knex pagination object (https://github.com/felixmosh/knex-paginate#pagination-object)
 * @returns {string} string ready to be set has "Content-Range" http header
 * @example Content-Range: posts 0-24/319
 */
const formatPaginationContentRange = (objectType, pagination) =>
    `${objectType.toLowerCase()} ${pagination.from}-${pagination.to}/${
        pagination.total
    }`;

/**
 * This method intercepts query parameters expected in JSON but incorrectly formatted.
 *
 * @param {string} parameter - the query parameter expected in JSON
 * @returns {(object|boolean)} the parsed parameter or false if incorrectly formatted
 */
const parseJsonQueryParameter = parameter => {
    if (parameter === undefined) {
        return false;
    }
    try {
        return JSON.parse(parameter);
    } catch (e) {
        return false;
    }
};

module.exports = {
    filtersSanitizer,
    formatPaginationContentRange,
    paginationSanitizer,
    parseJsonQueryParameter,
    sortSanitizer,
};
