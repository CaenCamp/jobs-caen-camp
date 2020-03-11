const Router = require('koa-router');

const { getOrganizationPaginatedList } = require('./repository');

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
    try {
        return JSON.parse(parameter);
    } catch (e) {
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

module.exports = router;
