const knex = require('knex');
const omit = require('lodash.omit');
const signale = require('signale');

const fixtures = require('../fixtures/fixed-fixtures.json');
const knexConfig = require('../knexfile');

const pg = knex(knexConfig);

const getOrganizationFromJobPosting = jobPosting => {
    return omit(
        {
            ...jobPosting.hiringOrganization,
            addressCountry:
                jobPosting.hiringOrganization.address.addressCountry,
            addressLocality:
                jobPosting.hiringOrganization.address.addressLocality,
            postalCode: jobPosting.hiringOrganization.address.postalCode,
            streetAddress: jobPosting.hiringOrganization.address.streetAddress,
        },
        ['address', 'contactPoints']
    );
};

const getContactPointFromJobPosting = jobPosting =>
    jobPosting.hiringOrganization.contactPoints[0];

const importFixtures = async () => {
    signale.info('Importation des fixtures fixes');
    await pg('organization').del();
    for (let i = 0; i < fixtures.length; i++) {
        try {
            const jobPosting = omit(fixtures[i], ['hiringOrganization']);
            const organization = getOrganizationFromJobPosting(fixtures[i]);
            const contactPoint = getContactPointFromJobPosting(fixtures[i]);

            const [organizationId] = await pg('organization')
                .returning('id')
                .insert(organization);

            await pg('contact_point').insert({
                ...contactPoint,
                organizationId,
            });

            await pg('job_posting').insert({
                ...jobPosting,
                hiringOrganizationId: organizationId,
                datePosted: new Date(jobPosting.datePosted),
                jobStartDate: new Date(jobPosting.jobStartDate),
                validThrough: jobPosting.validThrough
                    ? new Date(jobPosting.validThrough)
                    : null,
            });
        } catch (error) {
            signale.error("Erreur lors de la création d'une offre : ", error);
        }
    }
    return fixtures.length;
};

importFixtures()
    .then(nbJobPosting => {
        signale.info(
            `Fin de l'importation des ${nbJobPosting} offres d'emploi`
        );
        process.exit(0);
    })
    .catch(error => {
        signale.error("Erreur lors de l'importation des fixtures : ", error);
        process.exit(1);
    });
