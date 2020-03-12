const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const { oas } = require('koa-oas3');
const signale = require('signale');

const dbMiddleware = require('./toolbox/middleware/db');
const organizationRouter = require('./organization/router');

const app = new Koa();
const router = new Router();
const env = process.env.NODE_ENV;

const errorHandler = (error, ctx) => {
    signale.error(error);
    ctx.body = {
        message: 'There is an error :(',
    };
};

app.use(bodyParser());
app.use(
    oas({
        file: `${__dirname}/../openapi/openapi.yaml`,
        endpoint: '/openapi.json',
        uiEndpoint: '/documentation',
        validateResponse: true,
        validatePaths: ['/api'],
        errorHandler,
    })
);

if (env === 'development') {
    router.get('/', ctx => {
        ctx.body = {
            message:
                'Front is not serve here in dev environment. See documentation. API is available on /api endpoint',
        };
    });
} else {
    app.use(serve(`${__dirname}/../../front/public`));
}

router.get('/api', ctx => {
    ctx.body = { message: 'CaenCamp Jobboard API' };
});
app.use(router.routes()).use(router.allowedMethods());
app.use(dbMiddleware);
app.use(organizationRouter.routes()).use(organizationRouter.allowedMethods());

app.listen(3001, () => global.console.log('API started on port 3001'));
