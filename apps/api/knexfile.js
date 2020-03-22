const config = require('./src/config');
const knexStringcase = require('knex-stringcase');

const knexConfig = {
    client: 'pg',
    connection: config.db,
    migrations: {
        tableName: 'migrations',
    },
};

module.exports = knexStringcase(knexConfig);
