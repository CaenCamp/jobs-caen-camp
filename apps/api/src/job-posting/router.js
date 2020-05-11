const Router = require('koa-router');

const {
    createOne,
    deleteOne,
    getOne,
    getPaginatedList,
    updateOne,
} = require('./repository');
const {
    formatPaginationToLinkHeader,
} = require('../toolbox/rest-list/pagination-helpers');

const router = new Router({
    prefix: '/api/job-postings',
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
    const { jobPostings, pagination } = await getPaginatedList(ctx.query);

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/job-postings',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = jobPostings;
});

router.post('/', async (ctx) => {
    const newJobPosting = await createOne(ctx.request.body);

    if (newJobPosting.error) {
        const explainedError = new Error(newJobPosting.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newJobPosting;
});

router.get('/:jobPostingId', async (ctx) => {
    const jobPosting = await getOne(ctx.params.jobPostingId);

    if (jobPosting.error) {
        const explainedError = new Error(jobPosting.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!jobPosting.id) {
        const explainedError = new Error(
            `The jobPosting of id ${ctx.params.jobPostingId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = jobPosting;
});

router.delete('/:jobPostingId', async (ctx) => {
    const deletedJobPosting = await deleteOne(ctx.params.jobPostingId);

    if (deletedJobPosting.error) {
        const explainedError = new Error(deletedJobPosting.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!deletedJobPosting.id) {
        const explainedError = new Error(
            `The jobPosting of id ${ctx.params.jobPostingId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = deletedJobPosting;
});

router.put('/:jobPostingId', async (ctx) => {
    const updatedJobPosting = await updateOne(
        ctx.params.jobPostingId,
        ctx.request.body
    );

    if (updatedJobPosting.error) {
        const explainedError = new Error(updatedJobPosting.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!updatedJobPosting.id) {
        const explainedError = new Error(
            `The jobPosting of id ${ctx.params.jobPostingId} does not exist, so it could not be updated`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = updatedJobPosting;
});

module.exports = router;
