const {
    filtersSanitizer,
    formatOrganizationForAPI,
    formatPaginationContentRange,
    paginationSanitizer,
    prepareOrganizationDataForSave,
    sortSanitizer,
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
                addressCountry: 'France',
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
                    addressCountry: 'France',
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
                    addressCountry: 'France',
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
                    addressCountry: 'France',
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
            });
        });
    });

    describe('formatPaginationContentRange', () => {
        it('should transforms the Knex paging object into a string compatible with the "content-Range" header', () => {
            const knexPagination = {
                from: 33,
                to: 42,
                total: 666,
            };
            expect(
                formatPaginationContentRange('fooOBJECT', knexPagination)
            ).toEqual('fooobject 33-42/666');
        });
    });

    describe('filtersSanitizer', () => {
        it('should return an empty object if query filters are not set', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer(undefined, defaultFilterableFields)
            ).toEqual({});
        });

        it('should remove all unfiltrable fields from query parameters', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer(
                    { unfiltrable: 'yes' },
                    defaultFilterableFields
                )
            ).toEqual({});
        });

        it('should return valid filter from query parameters', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer({ foo: 'yes' }, defaultFilterableFields)
            ).toEqual({ foo: 'yes' });
        });

        it('should return valid filter and remove unfiltrable from query parameters', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer(
                    { bar: 'yes', unfiltrable: 'yes' },
                    defaultFilterableFields
                )
            ).toEqual({ bar: 'yes' });
        });

        it('should remove empty valid filters from query parameters', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer(
                    { foo: 'yes', bar: '  ' },
                    defaultFilterableFields
                )
            ).toEqual({ foo: 'yes' });
        });

        it('should not remove null valid filters from query parameters', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer(
                    { foo: 'yes', bar: null },
                    defaultFilterableFields
                )
            ).toEqual({ foo: 'yes', bar: null });
        });

        it('should not remove false valid filters from query parameters', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer(
                    { foo: 'yes', bar: false },
                    defaultFilterableFields
                )
            ).toEqual({ foo: 'yes', bar: false });
        });

        it('should remove undefined valid filters from query parameters', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer(
                    { foo: 'yes', bar: undefined },
                    defaultFilterableFields
                )
            ).toEqual({ foo: 'yes' });
        });
    });

    describe('sortSanitizer', () => {
        it('should return the first sortable field ASC if query sort are not set', () => {
            const defaultSortableFields = ['foo', 'bar'];
            expect(sortSanitizer(undefined, defaultSortableFields)).toEqual([
                'foo',
                'ASC',
            ]);
        });

        it('should return the first sortable field ASC if query sort is not an array', () => {
            const defaultSortableFields = ['foo', 'bar'];
            expect(
                sortSanitizer({ bar: 'DESC' }, defaultSortableFields)
            ).toEqual(['foo', 'ASC']);
        });

        it('should return the first sortable field ASC if query sort is not a sortable field', () => {
            const defaultSortableFields = ['foo', 'bar'];
            expect(
                sortSanitizer(['notSortable', 'DESC'], defaultSortableFields)
            ).toEqual(['foo', 'ASC']);
        });

        it('should replace the sort order with ASC if the query param sort order is not valid', () => {
            const defaultSortableFields = ['foo', 'bar'];
            expect(
                sortSanitizer(['bar', 'horizontal'], defaultSortableFields)
            ).toEqual(['bar', 'ASC']);
        });

        it('should remove the supernumerary parameters of the sorting array', () => {
            const defaultSortableFields = ['foo', 'bar'];
            expect(
                sortSanitizer(
                    ['bar', 'DESC', 'this', 'is', 'too', 'much'],
                    defaultSortableFields
                )
            ).toEqual(['bar', 'DESC']);
        });

        it('should return a well formated sort from query parameter', () => {
            const defaultSortableFields = ['foo', 'bar'];
            expect(
                sortSanitizer(['bar', 'DESC'], defaultSortableFields)
            ).toEqual(['bar', 'DESC']);
        });
    });

    describe('paginationSanitizer', () => {
        it('should return string pagination params as integer if it possible', () => {
            expect(paginationSanitizer(['12', '2'])).toEqual([12, 2]);
        });

        it('should return default pagination if pagination array is empty', () => {
            expect(paginationSanitizer([])).toEqual([10, 1]);
        });

        it('should return default pagination if one of pagination params could not be cast as integer', () => {
            expect(paginationSanitizer(['douze', '2'])).toEqual([10, 1]);
            expect(paginationSanitizer(['12', 'deux'])).toEqual([10, 1]);
            expect(paginationSanitizer([{}, '2'])).toEqual([10, 1]);
            expect(paginationSanitizer([null, '2'])).toEqual([10, 1]);
        });

        it('should remove the supernumerary parameters of the pagination array', () => {
            expect(paginationSanitizer([22, 3, 'foo', 'bar'])).toEqual([22, 3]);
        });
    });
});
