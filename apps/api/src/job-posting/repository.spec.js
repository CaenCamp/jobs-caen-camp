const {
    formatJobPostingForAPI,
    renameFiltersFromAPI,
} = require('./repository');

describe('jobPosting repository', () => {
    describe('renameFiltersFromAPI', () => {
        it('should not change anything if nothing needs to be changed.', () => {
            const queryParameters = {
                sortBy: 'foo',
                bar: 'foo:neq',
            };
            expect(renameFiltersFromAPI(queryParameters)).toEqual(
                queryParameters
            );
        });

        it('should rename the filters whose mapping is declared.', () => {
            const queryParameters = {
                sortBy: 'foo',
                hiringOrganizationName: 'foo:l%',
            };
            expect(renameFiltersFromAPI(queryParameters)).toEqual({
                sortBy: 'foo',
                'organization.name': 'foo:l%',
            });
        });

        it('should rename the sortBy if needed.', () => {
            const queryParameters = {
                sortBy: 'hiringOrganizationName',
                bar: 'foo:l%',
            };
            expect(renameFiltersFromAPI(queryParameters)).toEqual({
                sortBy: 'organization.name',
                bar: 'foo:l%',
            });
        });
    });

    describe('formatJobPostingForAPI', () => {
        it('should return an empty object if return from db is null', () => {
            expect(formatJobPostingForAPI(null)).toEqual({});
        });

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
