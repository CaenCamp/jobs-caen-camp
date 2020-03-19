const Router = require('koa-router');

const {
    createJobPosting,
    deleteJobPosting,
    getJobPosting,
    getJobPostingPaginatedList,
} = require('./repository');
const { parseJsonQueryParameter } = require('../toolbox/sanitizers');

const router = new Router({
    prefix: '/api/job-postings',
});

router.get('/', async ctx => {
    const { jobPostings, contentRange } = await getJobPostingPaginatedList({
        client: ctx.db,
        filters: parseJsonQueryParameter(ctx.query.filters),
        sort: parseJsonQueryParameter(ctx.query.sort),
        pagination: parseJsonQueryParameter(ctx.query.pagination),
    });

    ctx.set('Content-Range', contentRange);
    ctx.body = jobPostings;
});

router.post('/', async ctx => {
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

router.get('/:jobPostingId', async ctx => {
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

router.delete('/:jobPostingId', async ctx => {
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

module.exports = router;
