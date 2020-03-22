const {
    formatOrganizationForAPI,
    getIdsToDelete,
    prepareOrganizationDataForSave,
} = require('./repository');

describe('Organization Repository', () => {
    describe('formatOrganizationForAPI', () => {
        it('should transforms organization data from db into organization object as describe in OpenApi contract', () => {
            const dbOrganization = {
                name: 'test org',
                description: 'desc',
                image: 'https://www.org.org/logo.svg',
                email: 'contact@org.org',
                url: 'https://www.org.org',
                addressCountry: 'FR',
                addressLocality: 'Caen',
                postalCode: '14000',
                streetAddress: '5, place de la Répulique',
                contactPoints: [
                    {
                        email: 'job@org.org',
                        telephone: '0606060606',
                        name: 'John Do, CTO',
                        contactType: "Offres d'emploi",
                    },
                ],
            };
            expect(formatOrganizationForAPI(dbOrganization)).toEqual({
                name: 'test org',
                description: 'desc',
                image: 'https://www.org.org/logo.svg',
                email: 'contact@org.org',
                url: 'https://www.org.org',
                address: {
                    addressCountry: 'FR',
                    addressLocality: 'Caen',
                    postalCode: '14000',
                    streetAddress: '5, place de la Répulique',
                },
                contactPoints: [
                    {
                        email: 'job@org.org',
                        telephone: '0606060606',
                        name: 'John Do, CTO',
                        contactType: "Offres d'emploi",
                    },
                ],
            });
        });
    });

    describe('prepareOrganizationDataForSave', () => {
        it('should return valid data ready to be saved in db from API valided data', () => {
            const apiValidatedData = {
                name: 'test org',
                description: 'desc',
                image: 'https://www.org.org/logo.svg',
                email: 'contact@org.org',
                url: 'https://www.org.org',
                address: {
                    addressCountry: 'FR',
                    addressLocality: 'Caen',
                    postalCode: '14000',
                    streetAddress: '5, place de la Répulique',
                },
                contactPoints: [
                    {
                        email: 'job@org.org',
                        telephone: '0606060606',
                        name: 'John Do, CTO',
                        contactType: "Offres d'emploi",
                    },
                ],
            };
            expect(prepareOrganizationDataForSave(apiValidatedData)).toEqual({
                organization: {
                    name: 'test org',
                    description: 'desc',
                    image: 'https://www.org.org/logo.svg',
                    email: 'contact@org.org',
                    url: 'https://www.org.org',
                    addressCountry: 'FR',
                    addressLocality: 'Caen',
                    postalCode: '14000',
                    streetAddress: '5, place de la Répulique',
                },
                contactPoint: {
                    email: 'job@org.org',
                    telephone: '0606060606',
                    name: 'John Do, CTO',
                    contactType: "Offres d'emploi",
                },
                contactPoints: [
                    {
                        email: 'job@org.org',
                        telephone: '0606060606',
                        name: 'John Do, CTO',
                        contactType: "Offres d'emploi",
                    },
                ],
            });
        });
    });

    describe('getIdsToDelete', () => {
        it('should return ids presents in db but absent from API', () => {
            expect(
                getIdsToDelete(
                    ['a', 'b', 'c'],
                    [{ identifier: 'a' }, { identifier: 'c' }]
                )
            ).toEqual(['b']);
        });

        it('should return an empty array if nothing change', () => {
            expect(
                getIdsToDelete(
                    ['a', 'b'],
                    [{ identifier: 'a' }, { identifier: 'b' }]
                )
            ).toEqual([]);
        });

        it('should return all db ids if all is deleted from API', () => {
            expect(getIdsToDelete(['a', 'b', 'c'], [])).toEqual([
                'a',
                'b',
                'c',
            ]);
        });

        it('should manage case where object from API has no identifier (creation case from API)', () => {
            expect(
                getIdsToDelete(
                    ['a', 'c'],
                    [
                        { identifier: 'a' },
                        { name: 'new object without identifier' },
                    ]
                )
            ).toEqual(['c']);
        });
    });
});
