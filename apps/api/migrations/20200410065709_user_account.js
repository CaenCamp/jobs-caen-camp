exports.up = function (knex) {
    return knex.schema.createTable('user_account', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('username', 50).notNullable();
        table.string('password', 300).notNullable();
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.unique('username');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('user_account');
};
