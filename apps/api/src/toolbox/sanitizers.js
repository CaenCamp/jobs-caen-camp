const querystring = require('querystring');

/**
| operateur | applicable à         | explication                 |
| --------- | -------------------- | --------------------------- |
| :eq       | string, number, date | Is equal to                 |
| :gt       | number, date         | Is greater than             |
| :lt       | number, date         | Is less than                |
| :gte      | number, date         | Is greater than or equal to |
| :lte      | number, date         | Is less than or equal to    |
*/
const FILTER_OPERATOR_EQ = 'eq';
const FILTER_OPERATOR_GT = 'gt';
const FILTER_OPERATOR_LT = 'lt';
const FILTER_OPERATOR_GTE = 'gte';
const FILTER_OPERATOR_LTE = 'lte';
const FILTER_OPERATOR_IN = 'in';
const FILTER_OPERATOR_PLP = '%l%';
const FILTER_OPERATOR_PL = '%l';
const FILTER_OPERATOR_LP = 'l%';
const filterOperators = [
    FILTER_OPERATOR_EQ,
    FILTER_OPERATOR_GT,
    FILTER_OPERATOR_GTE,
    FILTER_OPERATOR_LT,
    FILTER_OPERATOR_LTE,
    FILTER_OPERATOR_IN,
    FILTER_OPERATOR_LP,
    FILTER_OPERATOR_PL,
    FILTER_OPERATOR_PLP,
];

const parametersThatDefaultToPLP = ['title', 'skills', 'name'];

const parametersThatDefaultToLP = [
    'hiringOrganizationName',
    'hiringOrganizationPostalCode',
    'hiringOrganizationAddressLocality',
    'hiringOrganizationAddressCountry',
    'addressLocality',
    'postalCode',
];

const parametersThatDefaultToLT = ['validThrough'];

/**
 * Method to clean the filters sent in query parameters
 *
 * @param {object} filters from query parameters of type { foo: 'bar:eq', ... }
 * @param {object} filterableFields the fields allowed to be used as a filter
 * @returns {Array} Ready-to-use array of filter objects
 * possible returned value: [{ name: 'foo', value: 'bar', operator: 'eq' }, {...} ]
 */
const filtersSanitizer = (filters, filterableFields) => {
    if (!filters || typeof filters !== 'object') {
        return [];
    }

    let sanitizedFilters = Object.keys(filters)
        .map((filterKey) => {
            let unparsedValue = filters[filterKey];

            if (unparsedValue === null) {
                return { name: filterKey, value: null, operator: 'eq' };
            }

            if (
                unparsedValue === undefined ||
                unparsedValue.trim().length == 0 ||
                !filterableFields.includes(filterKey)
            ) {
                return null;
            }

            let [value, operator] = unparsedValue.split(':');

            if (!operator) {
                if (parametersThatDefaultToPLP.includes(filterKey)) {
                    operator = FILTER_OPERATOR_PLP;
                }
                if (parametersThatDefaultToLP.includes(filterKey)) {
                    operator = FILTER_OPERATOR_LP;
                }
                if (parametersThatDefaultToLT.includes(filterKey)) {
                    operator = FILTER_OPERATOR_LT;
                }
            }

            return {
                name: filterKey,
                value,
                operator:
                    !operator || !filterOperators.includes(operator)
                        ? FILTER_OPERATOR_EQ
                        : operator,
            };
        })
        .filter((filter) => filter !== null);

    return sanitizedFilters;
};

/**
 * Method to clean the sort sent in query parameters
 *
 * @param {object} sort - sort from query parameters
 * @param {Array} sortableFields the fields allowed to be used as a sort
 * @returns {Array} Ready-to-use filters for the sql query
 */
const sortSanitizer = (sort, sortableFields) => {
    if (!sort) {
        return [sortableFields[0], 'ASC'];
    }
    const { sortBy, orderBy } = sort;
    if (
        orderBy === undefined ||
        sortBy === undefined ||
        !sortableFields.includes(sortBy)
    ) {
        return [sortableFields[0], 'ASC'];
    }

    if (!['ASC', 'DESC'].includes(orderBy)) {
        return [sortBy, 'ASC'];
    }

    return [sortBy, orderBy];
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

/**
 * Extract the parameters from the query
 *
 * @param {object} query - The query received as ctx.query
 * @returns {object} The extracted parameters, ready for sanitizing
 */
const extractQueryParameters = ({
    sortBy,
    orderBy,
    currentPage,
    perPage,
    ...filters
} = {}) => ({
    sort: sortBy ? { sortBy, orderBy: orderBy || 'ASC' } : null,
    pagination: {
        currentPage: currentPage || 1,
        perPage: perPage || 10,
    },
    filters,
});

module.exports = {
    filtersSanitizer,
    paginationSanitizer,
    sortSanitizer,
    formatPaginationToLinkHeader,
    extractQueryParameters,
};
