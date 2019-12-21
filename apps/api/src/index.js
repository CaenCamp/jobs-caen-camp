const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
    ctx.body = {message: 'Hello CaenCamp Jobboard'};
});

app.listen(3000, () => console.log('API started on port 3000'));
