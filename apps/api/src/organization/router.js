const Router = require('koa-router');

const {
    deleteOrganization,
    createOrganization,
    getOrganization,
    getOrganizationPaginatedList,
    updateOrganization,
} = require('./repository');
const {
    parseJsonQueryParameter,
    formatPaginationToLinkHeader,
} = require('../toolbox/sanitizers');

const router = new Router({
    prefix: '/api/organizations',
});

router.get('/', async (ctx) => {
    const { organizations, pagination } = await getOrganizationPaginatedList({
        client: ctx.db,
        filters: parseJsonQueryParameter(ctx.query.filters),
        sort: {
            sortBy: ctx.query.sortBy,
            orderBy: ctx.query.orderBy,
        },
        pagination: {
            currentPage: ctx.query.currentPage,
            perPage: ctx.query.perPage,
        },
    });

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/organizations',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = organizations;
});

router.post('/', async (ctx) => {
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

router.get('/:organizationId', async (ctx) => {
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

router.delete('/:organizationId', async (ctx) => {
    const deletedOrganization = await deleteOrganization({
        client: ctx.db,
        organizationId: ctx.params.organizationId,
    });

    if (!deletedOrganization.id) {
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

router.put('/:organizationId', async (ctx) => {
    const updatedOrganization = await updateOrganization({
        client: ctx.db,
        organizationId: ctx.params.organizationId,
        apiData: ctx.request.body,
    });

    if (updatedOrganization.error) {
        const explainedError = new Error(updatedOrganization.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedOrganization.id) {
        const explainedError = new Error(
            `The organization of id ${ctx.params.organizationId} does not exist, so it could not be updated`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedOrganization;
});

module.exports = router;
