const convict = require('convict');

const config = convict({
    env: {
        doc: 'Application environment.',
        format: ['production', 'development', 'test'],
        default: '',
        env: 'NODE_ENV',
    },
    db: {
        host: {
            doc: 'Database host name/IP',
            format: '*',
            default: 'postgres',
            env: 'POSTGRES_HOST',
        },
        port: {
            doc: 'Database port',
            format: 'port',
            default: 5432,
            env: 'POSTGRES_PORT',
        },
        database: {
            doc: 'Database name',
            format: String,
            default: '',
            env: 'POSTGRES_DB',
        },
        user: {
            doc: 'Database user',
            format: String,
            default: '',
            env: 'POSTGRES_USER',
        },
        password: {
            doc: 'Database password',
            format: String,
            default: '',
            env: 'POSTGRES_PASSWORD',
        },
    },
    security: {
        bcryptSaltRounds: {
            doc: 'the cost of processing the salt used during password hashing',
            format: 'integer',
            default: 10,
            env: 'PASSWORD_SALT_ROUNDS',
        },
        jwt: {
            secretkey: {
                doc: 'the key used to sign the token with HMAC SHA256',
                format: String,
                default: 'thisIsTheDefaultJWTSecretKey',
                env: 'JWT_SECRET_KET',
            },
            expiration: {
                doc: 'duration in seconds of the token lifetime',
                format: 'integer',
                default: 600, // 10 min - Token life time must be short !
                env: 'JWT_EXPIRATION',
            },
        },
    },
});

config.validate({ allowed: 'strict' });

module.exports = config.getProperties();
