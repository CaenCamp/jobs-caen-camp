const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const { oas } = require('koa-oas3');
const error = require('koa-json-error');

const dbMiddleware = require('./toolbox/middleware/db');
const organizationRouter = require('./organization/router');
const jobPostingRouter = require('./job-posting/router');

const app = new Koa();

// See https://github.com/zadzbw/koa2-cors for configuration
app.use(
    cors({
        origin: '*',
        allowHeaders: ['Origin, Content-Type, Accept'],
        exposeHeaders: ['X-Total-Count', 'Link'],
    })
);

const router = new Router();
const env = process.env.NODE_ENV;

/**
 * This handler catch errors throw by oas middleware validation.
 *
 * @param {object} error - oas error
 * @throw {Error} reformated oas error
 */
const errorHandler = error => {
    let errorDetails = false;
    if (error.meta && error.meta.rawErrors) {
        errorDetails = error.meta.rawErrors.reduce((acc, rawError) => {
            return [...acc, rawError.error];
        }, []);
    }
    const updatedError = new Error(
        `${error.message}${errorDetails ? ` (${errorDetails.join(', ')})` : ''}`
    );
    updatedError.status = 400;

    throw updatedError;
};

/**
 * This method is used to format message return by the global error middleware
 *
 * @param {object} error - the catched error
 * @return {object} the content of the json error return
 */
const formatError = error => {
    return {
        status: error.status,
        message: error.message,
    };
};

app.use(bodyParser());
app.use(error(formatError));
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
app.use(jobPostingRouter.routes()).use(jobPostingRouter.allowedMethods());

app.listen(3001, () => global.console.log('API started on port 3001'));
