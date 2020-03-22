const knex = require('knex');
const { attachPaginate } = require('knex-paginate');

const knexfile = require('../../../knexfile');

attachPaginate();
const db = knex({
    ...knexfile,
    pool: { min: 0, max: 7 },
});

const dbConnexionMiddleware = async (ctx, next) => {
    ctx.db = db;
    await next();
};

module.exports = dbConnexionMiddleware;
