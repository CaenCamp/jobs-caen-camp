const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');

const app = new Koa();
const router = new Router();
const env = process.env.NODE_ENV;

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

app.listen(3001, () => global.console.log('API started on port 3001'));
