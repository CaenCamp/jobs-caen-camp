exports.up = function(knex) {
    return knex.schema.createTable('job_posting', function(table) {
        table
            .uuid('id')
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('title', 300).notNullable();
        table.string('url', 400).nullable();
        table.date('datePosted').notNullable();
        table.text('employerOverview').notNullable();
        table
            .enu('employmentType', ['CDI', 'CDD', 'Alternance', 'Autre'])
            .notNullable();
        table.text('experienceRequirements').notNullable();
        table.date('jobStartDate').nullable();
        table.string('skills').notNullable();
        table.date('validThrough').nullable();
        table.uuid('hiring_organization_id');
        table
            .foreign('hiring_organization_id')
            .references('organization.id')
            .onDelete('CASCADE');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('job_posting');
};
