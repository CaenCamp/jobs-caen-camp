const Router = require('koa-router');

const { getJobPostingPaginatedList } = require('./repository');
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

module.exports = router;
