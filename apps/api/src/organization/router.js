const Router = require('koa-router');

const {
    createOrganization,
    getOrganizationPaginatedList,
} = require('./repository');

const router = new Router({
    prefix: '/api/organizations',
});

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
        // signale.debug('Problem with query param json encoding', e);
        return false;
    }
};

router.get('/', async ctx => {
    const { organizations, contentRange } = await getOrganizationPaginatedList({
        client: ctx.db,
        filters: parseJsonQueryParameter(ctx.query.filters),
        sort: parseJsonQueryParameter(ctx.query.sort),
        pagination: parseJsonQueryParameter(ctx.query.pagination),
    });

    ctx.set('Content-Range', contentRange);
    ctx.body = organizations;
});

router.post('/', async ctx => {
    const newOrganization = await createOrganization({
        client: ctx.db,
        apiData: ctx.request.body,
    });
    if (newOrganization.error) {
        const explainedError = new Error(newOrganization.error.message);
        explainedError.status = 400;
        throw explainedError;
    }

    ctx.body = newOrganization;
});

module.exports = router;
