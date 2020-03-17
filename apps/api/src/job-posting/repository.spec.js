const { formatJobPostingForAPI } = require('./repository');

describe('jobPosting repository', () => {
    describe('formatJobPostingForAPI', () => {
        it('should format jobPosting from db as a jobPosting object as describe in OpenAPI contract', () => {
            const dbJobPosting = {
                id: '095e0d16-705d-4934-aa34-8f973eab0bdd',
                title: 'Data Science Lead',
                url: 'https://qwarry.com/job/datasciencelead/',
                datePosted: new Date('2019-12-01'),
                employerOverview: 'overview',
                employmentType: 'CDI',
                experienceRequirements: 'experiences',
                jobStartDate: new Date('2020-05-02'),
                skills: 'Machine learning, Python, Spark, SQL',
                validThrough: null,
                hiringOrganizationId: 'ac3ab955-041e-4007-869d-21c5967e55cb',
                hiringOrganizationName: 'Qwarry',
                hiringOrganizationImage:
                    'https://qwarry.com/wp-content/uploads/2019/09/Qwarry-Logo-hearder-2.png',
                hiringOrganizationAddressCountry: 'FR',
                hiringOrganizationAddressLocality: 'Colombelles',
                hiringOrganizationPostalCode: '14460',
                hiringOrganizationUrl: 'https://org.org',
            };
            expect(formatJobPostingForAPI(dbJobPosting)).toEqual({
                id: '095e0d16-705d-4934-aa34-8f973eab0bdd',
                title: 'Data Science Lead',
                url: 'https://qwarry.com/job/datasciencelead/',
                datePosted: '2019-12-01',
                employerOverview: 'overview',
                employmentType: 'CDI',
                experienceRequirements: 'experiences',
                jobStartDate: '2020-05-02',
                skills: 'Machine learning, Python, Spark, SQL',
                validThrough: null,
                hiringOrganization: {
                    identifier: 'ac3ab955-041e-4007-869d-21c5967e55cb',
                    name: 'Qwarry',
                    image:
                        'https://qwarry.com/wp-content/uploads/2019/09/Qwarry-Logo-hearder-2.png',
                    url: 'https://org.org',
                    address: {
                        addressCountry: 'FR',
                        addressLocality: 'Colombelles',
                        postalCode: '14460',
                    },
                },
            });
        });
    });
});
