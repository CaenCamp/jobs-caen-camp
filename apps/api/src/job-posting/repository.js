const omit = require('lodash.omit');
const signale = require('signale');

const {
    filtersSanitizer,
    formatPaginationContentRange,
    paginationSanitizer,
    sortSanitizer,
} = require('../toolbox/sanitizers');

const jobPostingSortableFields = [
    'datePosted',
    'title',
    'jobStartDate',
    'validThrough',
    'hiringOrganizationName',
    'hiringOrganizationIdentifier',
    'hiringOrganizationPostalCode',
    'hiringOrganizationAddressLocality',
    'hiringOrganizationAddressCountry',
];

const jobPostingFilterableFields = [
    'title',
    'skills',
    'datePosted_before',
    'datePosted_after',
    'jobStartDate_before',
    'jobStartDate_after',
    'validThrough_before',
    'validThrough_after',
    'hiringOrganizationName',
    'hiringOrganizationPostalCode',
    'hiringOrganizationAddressLocality',
    'hiringOrganizationAddressCountry',
];

/**
 * Knex query for filtrated jobPosting list
 *
 * @param {object} client - The Database client
 * @param {object} filters - jobPosting Filter
 * @param {Array} sort - Sort parameters [columnName, direction]
 * @returns {Promise} - Knew query for filtrated jobPosting list
 */
const getFilteredJobPostingsQuery = (client, filters, sort) => {
    const {
        title,
        skills,
        hiringOrganizationName,
        hiringOrganizationPostalCode,
        hiringOrganizationAddressLocality,
        hiringOrganizationAddressCountry,
        ...restFiltersThatMustBeDates
    } = filters;
    const query = client
        .select(
            'job_posting.*',
            'organization.name as hiringOrganizationName',
            'organization.postal_code as hiringOrganizationPostalCode',
            'organization.address_locality as hiringOrganizationAddressLocality',
            'organization.address_country as hiringOrganizationAddressCountry',
            'organization.image as hiringOrganizationImage',
            'organization.url as hiringOrganizationUrl'
        )
        .from('job_posting')
        .join('organization', {
            'organization.id': 'job_posting.hiring_organization_id',
        });

    if (title) {
        query.andWhere('title', 'LIKE', `%${title}%`);
    }
    if (skills) {
        query.andWhere('skills', 'LIKE', `%${skills}%`);
    }
    if (hiringOrganizationPostalCode) {
        query.andWhere(
            'organization.postal_code',
            'LIKE',
            `${hiringOrganizationPostalCode}%`
        );
    }
    if (hiringOrganizationName) {
        query.andWhere(
            'organization.name',
            'LIKE',
            `%${hiringOrganizationName}%`
        );
    }
    if (hiringOrganizationAddressLocality) {
        query.andWhere(
            'organization.address_locality',
            'LIKE',
            `${hiringOrganizationAddressLocality}%`
        );
    }
    if (hiringOrganizationAddressCountry) {
        query.andWhere(
            'organization.address_country',
            'LIKE',
            `${hiringOrganizationAddressCountry}%`
        );
    }

    Object.keys(restFiltersThatMustBeDates).map(key => {
        try {
            const queryDate = new Date(restFiltersThatMustBeDates[key]);
            const [what, when] = key.split('_');
            if (when && ['after', 'before'].includes(when)) {
                query.andWhere(
                    what,
                    when === 'after' ? '>' : '<',
                    queryDate.toISOString()
                );
            }
        } catch (error) {
            signale.debug('the date in filter is not well formated');
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
const formatJobPostingForAPI = dbJobPosting => ({
    ...omit(dbJobPosting, [
        'hiringOrganizationId',
        'hiringOrganizationName',
        'hiringOrganizationPostalCode',
        'hiringOrganizationAddressLocality',
        'hiringOrganizationAddressCountry',
        'hiringOrganizationImage',
        'hiringOrganizationUrl',
    ]),
    hiringOrganization: {
        identifier: dbJobPosting.hiringOrganizationId,
        name: dbJobPosting.hiringOrganizationName,
        image: dbJobPosting.hiringOrganizationImage,
        url: dbJobPosting.hiringOrganizationUrl,
        address: {
            addressCountry: dbJobPosting.hiringOrganizationAddressCountry,
            addressLocality: dbJobPosting.hiringOrganizationAddressLocality,
            postalCode: dbJobPosting.hiringOrganizationPostalCode,
        },
    },
    datePosted: dbJobPosting.datePosted
        ? dbJobPosting.datePosted.toISOString().substring(0, 10)
        : null,
    jobStartDate: dbJobPosting.jobStartDate
        ? dbJobPosting.jobStartDate.toISOString().substring(0, 10)
        : null,
    validThrough: dbJobPosting.validThrough
        ? dbJobPosting.validThrough.toISOString().substring(0, 10)
        : null,
});

/**
 * Return paginated and filtered list of jobPosting
 *
 * @param {object} client - The Database client
 * @param {object} filters - JobPosting Filters
 * @param {Array} sort - Sort parameters [columnName, direction]
 * @param {Array} pagination - Pagination [perPage, currentPage]
 * @returns {Promise} - paginated object with paginated jobPosting list and totalCount
 */
const getJobPostingPaginatedList = async ({
    client,
    filters,
    sort,
    pagination,
}) => {
    const query = getFilteredJobPostingsQuery(
        client,
        filtersSanitizer(filters, jobPostingFilterableFields),
        sortSanitizer(sort, jobPostingSortableFields)
    );
    const [perPage, currentPage] = paginationSanitizer(pagination);

    return query
        .paginate({ perPage, currentPage, isLengthAware: true })
        .then(result => ({
            jobPostings: result.data.map(formatJobPostingForAPI),
            contentRange: formatPaginationContentRange(
                'jobPostings',
                result.pagination
            ),
        }));
};

module.exports = {
    formatJobPostingForAPI,
    getJobPostingPaginatedList,
};
