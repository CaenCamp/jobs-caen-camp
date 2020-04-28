exports.up = function (knex) {
    return knex.schema.createTable('refresh_token', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('user_id');
        table
            .foreign('user_id')
            .references('user_account.id')
            .onDelete('CASCADE');
        table.boolean('remember_me').defaultTo(false);
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.integer('validity_timestamp').unsigned().notNullable();
        table.unique('user_id');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('refresh_token');
};
