const Router = require('koa-router');

const {
    deleteOrganization,
    createOrganization,
    getOrganization,
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
    console.log('CREATION ORGA');
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

router.get('/:organizationId', async ctx => {
    const organization = await getOrganization({
        client: ctx.db,
        organizationId: ctx.params.organizationId,
    });

    if (!organization.id) {
        const explainedError = new Error(
            `The organization of id ${ctx.params.organizationId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (organization.error) {
        const explainedError = new Error(organization.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = organization;
});

router.delete('/:organizationId', async ctx => {
    const deletedOrganization = await deleteOrganization({
        client: ctx.db,
        organizationId: ctx.params.organizationId,
    });

    if (!deletedOrganization) {
        const explainedError = new Error(
            `The organization of id ${ctx.params.organizationId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (deletedOrganization.error) {
        const explainedError = new Error(deletedOrganization.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = deletedOrganization;
});

module.exports = router;
