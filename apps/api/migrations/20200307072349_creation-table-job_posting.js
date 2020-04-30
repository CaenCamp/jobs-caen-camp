exports.up = function (knex) {
    return knex.schema.createTable('job_posting', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('title', 300).notNullable();
        table.string('url', 400).nullable();
        table.date('date_posted').notNullable();
        table.text('employer_overview').notNullable();
        table
            .enu('employment_type', ['CDI', 'CDD', 'Alternance', 'Autre'])
            .notNullable();
        table.text('experience_requirements').notNullable();
        table.date('job_start_date').nullable();
        table.string('skills').notNullable();
        table.date('valid_through').nullable();
        table.uuid('hiring_organization_id');
        table
            .foreign('hiring_organization_id')
            .references('organization.id')
            .onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('job_posting');
};
