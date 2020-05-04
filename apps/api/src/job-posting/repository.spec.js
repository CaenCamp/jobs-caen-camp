const {
    formatBaseSalary,
    prepareDataForDb,
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

    describe('prepareDataForDb', () => {
        it('should set default job location type if it is not set', () => {
            const formatedData = prepareDataForDb({});
            expect(formatedData.jobLocationType).toEqual('office');
        });

        it('should set default job location type if ray data is not valid', () => {
            const formatedData = prepareDataForDb({
                jobLocationType: 'maison',
            });
            expect(formatedData.jobLocationType).toEqual('office');
        });

        it('should stringify base salary if it is not null', () => {
            const formatedData = prepareDataForDb({
                jobLocationType: 'maison',
                baseSalary: { value: 10 },
            });
            expect(formatedData.baseSalary).toEqual(
                JSON.stringify({
                    currency: 'EUR brut annuel',
                    minValue: null,
                    maxValue: null,
                    value: 10,
                })
            );
        });
    });
    describe('formatBaseSalary', () => {
        it('should return null if base salary is null', () => {
            expect(formatBaseSalary(null)).toBeNull();
        });

        it('should return null if base salary neither value neither minValue AND maxValue', () => {
            expect(formatBaseSalary({})).toBeNull();
            expect(formatBaseSalary({ minValue: 10 })).toBeNull();
            expect(formatBaseSalary({ maxValue: 20 })).toBeNull();
            expect(
                formatBaseSalary({ minValue: 10, maxValue: 20 })
            ).not.toBeNull();
            expect(formatBaseSalary({ value: 20 })).not.toBeNull();
        });

        it('should compute value from minValue and maxValue if value is not set', () => {
            const baseSalary = formatBaseSalary({
                minValue: 10,
                maxValue: 20,
            });
            expect(baseSalary.value).toEqual(15);
        });

        it('should not compute value from minValue and maxValue if value is not set', () => {
            const baseSalary = formatBaseSalary({
                minValue: 10,
                maxValue: 20,
                value: 12,
            });
            expect(baseSalary.value).toEqual(12);
        });

        it('should set default currency if currency is not set', () => {
            const baseSalary = formatBaseSalary({
                value: 12,
            });
            expect(baseSalary.currency).toEqual('EUR brut annuel');
        });

        it('should not set default currency if currency is set', () => {
            const baseSalary = formatBaseSalary({
                currency: 'USD',
                value: 12,
            });
            expect(baseSalary.currency).toEqual('USD');
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
