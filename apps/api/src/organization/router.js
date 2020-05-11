const Router = require('koa-router');

const {
    deleteOne,
    createOne,
    getOne,
    getPaginatedList,
    updateOne,
} = require('./repository');
const {
    formatPaginationToLinkHeader,
} = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/api/organizations',
});

router.use(async (ctx, next) => {
    if (
        !ctx.state.jwt &&
        ['POST', 'PUT', 'DELETE'].includes(ctx.request.method)
    ) {
        ctx.throw(401, "You don't have the rights to make this query");

        return;
    }

    await next();
});

router.get('/', async (ctx) => {
    const { organizations, pagination } = await getPaginatedList(ctx.query);

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
    const newOrganization = await createOne(ctx.request.body);

    if (newOrganization.error) {
        const explainedError = new Error(newOrganization.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newOrganization;
});

router.get('/:organizationId', async (ctx) => {
    const organization = await getOne(ctx.params.organizationId);

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
    const deletedOrganization = await deleteOne(ctx.params.organizationId);

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
    const updatedOrganization = await updateOne(
        ctx.params.organizationId,
        ctx.request.body
    );

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
