const Router = require('koa-router');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getOneByUsername } = require('../../user-account/repository');
const config = require('../../config');

const router = new Router();

router.post('/authenticate', async (ctx) => {
    const { username, password } = ctx.request.body;

    const user = await getOneByUsername({ client: ctx.db, username });

    if (!user) {
        ctx.throw('Invalid credentials.', 401);
        return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
        ctx.throw('Invalid credentials.', 401);
        return;
    }

    const token = jwt.sign({ username }, config.security.jwt.secretkey, {
        expiresIn: config.security.jwt.expiration,
    });

    ctx.body = {
        token: token,
        username: user.username,
    };
});

module.exports = router;
