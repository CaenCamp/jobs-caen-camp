const faker = require('faker');

faker.locale = 'fr';

module.exports = {
    fake: (id, organization) => ({
        '@context': 'http://schema.org',
        '@type': 'JobPosting',
        '@id': '/jobs/' + id,
        id: id,
        title: faker.lorem.words(3),
        hiringOrganization: {
            '@type': 'Organization',
            '@id': '/organizations/' + organization.id,
            name: organization.name
        }
    })
};
