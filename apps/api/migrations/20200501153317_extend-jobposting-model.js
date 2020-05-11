exports.up = function (knex) {
    return knex.schema.table('job_posting', (table) => {
        table.jsonb('base_salary').nullable();
        table
            .enum('job_location_type', [
                'office',
                'remote',
                'remote and office',
                'remote or office',
            ])
            .notNullable()
            .defaultTo('office');
        table.boolean('job_immediate_start').defaultTo(false);
    });
};

exports.down = function (knex) {
    return knex.schema.table('job_posting', (table) => {
        table.dropColumn('base_salary');
        table.dropColumn('job_location_type');
        table.dropColumn('job_immediate_start');
    });
};
