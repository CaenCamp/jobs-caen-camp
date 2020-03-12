exports.up = function(knex) {
    return knex.raw(`CREATE extension IF NOT EXISTS "uuid-ossp"`);
};

exports.down = function() {
    return true;
};
