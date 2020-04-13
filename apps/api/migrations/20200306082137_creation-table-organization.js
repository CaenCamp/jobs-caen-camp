exports.up = function (knex) {
    return knex.schema
        .createTable('organization', function (table) {
            table
                .uuid('id')
                .primary()
                .defaultTo(knex.raw('uuid_generate_v4()'));
            table.string('name', 150).notNullable();
            table.text('description').nullable();
            table.string('url', 400).nullable();
            table.string('email', 150).nullable();
            table.text('image', 400).nullable();
            table.string('address_country', 5).notNullable().defaultTo('FR');
            table.string('address_locality', 150).notNullable();
            table.string('postal_code', 20).notNullable();
            table.string('street_address', 300).nullable();
        })
        .createTable('contact_point', function (table) {
            table
                .uuid('id')
                .primary()
                .defaultTo(knex.raw('uuid_generate_v4()'));
            table.uuid('organization_id');
            table
                .foreign('organization_id')
                .references('organization.id')
                .onDelete('CASCADE');
            table.string('email', 150).notNullable();
            table.string('telephone', 30).nullable();
            table.string('name', 300).notNullable();
            table.string('contact_type', 150).nullable();
            table.unique(['organization_id', 'email']);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('contact_point').dropTable('organization');
};
