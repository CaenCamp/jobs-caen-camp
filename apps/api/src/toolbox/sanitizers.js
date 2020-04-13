const querystring = require('querystring');

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
        .filter((key) => filterableFields.includes(key))
        .filter((key) => filters[key] !== undefined)
        .filter((key) => {
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
 * @returns {Array} Ready-to-use filters for the sql query
 */
const paginationSanitizer = ({ perPage, currentPage }) => {
    return [parseInt(perPage) || 10, parseInt(currentPage) || 1];
};

/**
 * This method intercepts query parameters expected in JSON but incorrectly formatted.
 *
 * @param {string} parameter - the query parameter expected in JSON
 * @returns {(object|boolean)} the parsed parameter or false if incorrectly formatted
 */
const parseJsonQueryParameter = (parameter) => {
    if (parameter === undefined) {
        return false;
    }
    try {
        return JSON.parse(parameter);
    } catch (e) {
        return false;
    }
};

/**
 * Function to return a single pagination information
 *
 * @param {object}
 * @returns {String}
 * @example </api/job-postings?currentPage=1&perPage=10>; rel="self"
 */
const linkHeaderItem = ({ resourceURI, currentPage, perPage, rel }) => {
    const params = {
        currentPage,
        perPage,
    };
    return `<${resourceURI}?${querystring.stringify(params)}>; rel="${rel}"`;
};

/**
 * Function to return a fill pagination information with
 * first, prev, self, next and last relations.
 *
 * @param {object}
 * @returns {String}
 */
const formatPaginationToLinkHeader = ({ resourceURI, pagination = {} }) => {
    const { currentPage, perPage, lastPage } = pagination;

    if (!resourceURI || !currentPage || !perPage || !lastPage) {
        return null;
    }

    const prevPage =
        currentPage - 1 <= lastPage && currentPage - 1 > 0
            ? currentPage - 1
            : currentPage;
    const nextPage =
        currentPage + 1 <= lastPage ? currentPage + 1 : currentPage;

    let items = [
        { resourceURI, currentPage: 1, perPage, rel: 'first' },
        {
            resourceURI,
            currentPage: prevPage,
            perPage,
            rel: 'prev',
        },
        { resourceURI, currentPage, perPage, rel: 'self' },
        {
            resourceURI,
            currentPage: nextPage,
            perPage,
            rel: 'next',
        },
        {
            resourceURI,
            currentPage: lastPage,
            perPage,
            rel: 'last',
        },
    ];

    return items.map((item) => linkHeaderItem(item)).join(',');
};

module.exports = {
    filtersSanitizer,
    paginationSanitizer,
    parseJsonQueryParameter,
    sortSanitizer,
    formatPaginationToLinkHeader,
};
