const faker = require('faker');

faker.locale = 'fr';

module.exports = {
    fake: id => ({
        '@context': 'http://schema.org',
        '@type': 'Organization',
        '@id': '/organizations/' + id,
        id: id,
        name: faker.company.companyName(),
        description: faker.lorem.sentence(),
        image: {
            '@type': 'ImageObject',
            caption: 'Logo',
            contentUrl: faker.image.imageUrl(300, 200),
            width: 300,
            height: 200,
        },
        url: faker.internet.url(),
        email: faker.internet.email(),
        address: {
            '@type': 'PostalAddress',
            streetAddress: faker.address.streetAddress(),
            postalCode: faker.address.postalCode,
            addressLocality:
                faker.address.city() + ', ' + faker.address.country(),
        },
        jobs: [],
    }),
    addJob: (organization, job) => {
        organization.jobs.push({
            '@type': 'JobPosting',
            '@id': '/jobs/' + job.id,
            title: job.title,
        });
    },
};
