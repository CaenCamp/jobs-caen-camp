const Router = require('koa-router');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getOneByUsername, getOne } = require('../../user-account/repository');
const {
    createOneForUser: createRefreshToken,
    deleteOne: deleteRefreshToken,
    getOneByUserId: getExistingRefreshToken,
    getOne: getExistingRefreshTokenById,
} = require('./refreshTokenRepository');
const config = require('../../config');

const router = new Router();

router.post('/authenticate', async (ctx) => {
    const { username, password, rememberMe = false } = ctx.request.body;

    const user = await getOneByUsername({ client: ctx.db, username });

    if (!user || user.error) {
        ctx.throw(user ? user.error : 'Invalid credentials.', 401);
        return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
        ctx.throw('Invalid credentials.', 401);
        return;
    }

    let refreshTokenId;
    const existingRefreshToken = await getExistingRefreshToken({
        client: ctx.db,
        userId: user.id,
    });
    if (existingRefreshToken && !existingRefreshToken.error) {
        refreshTokenId = existingRefreshToken.id;
    } else {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const newTokenData = {
            userId: user.id,
            rememberMe,
            validity_timestamp: rememberMe
                ? currentTimestamp +
                  config.security.refreshToken.rememberExpiration
                : currentTimestamp + config.security.refreshToken.expiration,
        };
        const newRefreshToken = await createRefreshToken({
            client: ctx.db,
            data: newTokenData,
        });

        if (!newRefreshToken || newRefreshToken.error) {
            ctx.throw(
                newRefreshToken.error
                    ? newRefreshToken.error.message
                    : 'Error during refresh token creation'
            );
            return;
        }

        refreshTokenId = newRefreshToken[0].id;
    }

    const delay = rememberMe
        ? config.security.refreshToken.rememberExpiration * 1000
        : config.security.refreshToken.expiration * 1000;
    const tokenExpires = new Date(new Date().getTime() + delay);
    const cookieOptions = {
        expires: tokenExpires,
        httpOnly: true,
        overwrite: true,
        secure: false,
        signed: true,
    };
    ctx.cookies.set(
        config.security.refreshToken.name,
        refreshTokenId,
        cookieOptions
    );

    const token = jwt.sign({ username }, config.security.jwt.secretkey, {
        expiresIn: config.security.jwt.expiration,
    });

    ctx.body = {
        token: token,
        tokenExpiry: 15, // config.security.jwt.expiration,
        username: user.username,
    };
});

router.get('/refresh-token', async (ctx) => {
    const refreshTokenId = ctx.cookies.get(config.security.refreshToken.name, {
        signed: true,
    });

    const dbToken = await getExistingRefreshTokenById({
        client: ctx.db,
        id: refreshTokenId,
    });

    if (!dbToken.id || dbToken.error) {
        const explainedError = new Error(`The refresh token is not valid.`);
        explainedError.status = 400;

        throw explainedError;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (dbToken.validityTimestamp <= currentTimestamp) {
        await deleteRefreshToken({ client: ctx.db, id: refreshTokenId });

        const explainedError = new Error(`The refresh token is expired.`);
        explainedError.status = 400;

        throw explainedError;
    }

    const user = await getOne({ client: ctx.db, id: dbToken.userId });

    if (!user || user.error) {
        ctx.throw(user.error || 'Invalid credentials.', 401);
        return;
    }

    const token = jwt.sign(
        { username: user.username },
        config.security.jwt.secretkey,
        {
            expiresIn: config.security.jwt.expiration,
        }
    );

    ctx.body = {
        token: token,
        tokenExpiry: 15, //config.security.jwt.expiration,
        username: user.username,
    };
});

router.get('/logout', async (ctx) => {
    const refreshTokenId = ctx.cookies.get(config.security.refreshToken.name, {
        signed: true,
    });

    await deleteRefreshToken({ client: ctx.db, id: refreshTokenId });

    const cookieOptions = {
        expires: new Date(new Date().getTime() - 1),
    };
    ctx.cookies.set(config.security.refreshToken.name, null, cookieOptions);

    ctx.body = { message: 'logout' };
});

module.exports = router;
