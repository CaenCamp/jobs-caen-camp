const Router = require('koa-router');

const {
    createJobPosting,
    deleteJobPosting,
    getJobPosting,
    getJobPostingPaginatedList,
    updateJobPosting,
} = require('./repository');
const {
    parseJsonQueryParameter,
    formatPaginationToLinkHeader,
} = require('../toolbox/sanitizers');

const router = new Router({
    prefix: '/api/job-postings',
});

router.get('/', async (ctx) => {
    const { jobPostings, pagination } = await getJobPostingPaginatedList({
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
    const newJobPosting = await createJobPosting({
        client: ctx.db,
        apiData: ctx.request.body,
    });

    if (newJobPosting.error) {
        const explainedError = new Error(newJobPosting.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = newJobPosting;
});

router.get('/:jobPostingId', async (ctx) => {
    const jobPosting = await getJobPosting({
        client: ctx.db,
        jobPostingId: ctx.params.jobPostingId,
    });

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
    const deletedJobPosting = await deleteJobPosting({
        client: ctx.db,
        jobPostingId: ctx.params.jobPostingId,
    });

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
    const updatedJobPosting = await updateJobPosting({
        client: ctx.db,
        jobPostingId: ctx.params.jobPostingId,
        apiData: ctx.request.body,
    });

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
