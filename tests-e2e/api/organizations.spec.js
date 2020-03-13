import frisby from 'frisby';

describe('JobBoard Organizations API Endpoints', () => {
    describe('GET: /api/organizations', () => {
        it('devrait renvoyer une liste paginée ordonnée par nom d\'entreprise sans paramètres de requête', async () => {
            expect.hasAssertions();
            await frisby
                .get('http://api:3001/api/organizations')
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'Content-Range', 'organizations 0-3/3')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(3);
                    expect(resp.json[0].name).toStrictEqual('Flexcity');
                    expect(resp.json[1].name).toStrictEqual('Limengo');
                    expect(resp.json[2].name).toStrictEqual('Qwarry');
                });
        });

        it('devrait changer la pagination via le paramètre de requête pagination', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/organizations?pagination=${JSON.stringify(
                        [1, 1]
                    )}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'Content-Range', 'organizations 0-1/3')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(1);
                    expect(resp.json[0].name).toStrictEqual('Flexcity');
                });
            await frisby
                .get(
                    `http://api:3001/api/organizations?pagination=${JSON.stringify(
                        [1, 3]
                    )}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'Content-Range', 'organizations 2-3/3')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(1);
                    expect(resp.json[0].name).toStrictEqual('Qwarry');
                });
        });

        it('devrait accepter un parametre de requête "sort" pour le tri', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/organizations?sort=${JSON.stringify([
                        'name',
                        'ASC',
                    ])}`
                )
                .expect('status', 200)
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(3);
                    expect(resp.json[0].name).toStrictEqual('Flexcity');
                    expect(resp.json[1].name).toStrictEqual('Limengo');
                    expect(resp.json[2].name).toStrictEqual('Qwarry');
                });
            await frisby
                .get(
                    `http://api:3001/api/organizations?sort=${JSON.stringify([
                        'name',
                        'DESC',
                    ])}`
                )
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(3);
                    expect(resp.json[0].name).toStrictEqual('Qwarry');
                    expect(resp.json[1].name).toStrictEqual('Limengo');
                    expect(resp.json[2].name).toStrictEqual('Flexcity');
                });
        });

        it('devrait accepter un filtre par nom en "%LIKE%"', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/organizations?filters=${JSON.stringify(
                        { name: 'lex' }
                    )}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'Content-Range', 'organizations 0-1/1')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(1);
                    expect(resp.json[0].name).toStrictEqual('Flexcity');
                });
        });

        it('devrait accepter un filtre par ville en "%LIKE"', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/organizations?filters=${JSON.stringify(
                        { address_locality: 'Auber' }
                    )}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'Content-Range', 'organizations 0-1/1')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(1);
                    expect(resp.json[0].name).toStrictEqual('Flexcity');
                });
            await frisby
                .get(
                    `http://api:3001/api/organizations?filters=${JSON.stringify(
                        { address_locality: 'villier' }
                    )}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'Content-Range', 'organizations 0-0/0')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(0);
                });
        });

        it('devrait accepter un filtre par code postal en "%LIKE"', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/organizations?filters=${JSON.stringify(
                        { postal_code: 14 }
                    )}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'Content-Range', 'organizations 0-2/2')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(2);
                });
            await frisby
                .get(
                    `http://api:3001/api/organizations?filters=${JSON.stringify(
                        { postal_code: 460 }
                    )}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'Content-Range', 'organizations 0-0/0')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(0);
                });
        });
    });

    describe('POST: /api/organizations', () => {
        const incompleteDataForCreation = {
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
                    contactType: 'Offres d\'emploi',
                },
            ],
        };

        const completeDataForCreation = {
            name: 'test org',
            ...incompleteDataForCreation,
        };

        it('devrait retourner une erreur 400 en cas de données incompletes', async () => {
            expect.hasAssertions();
            await frisby
                .post(
                    'http://api:3001/api/organizations',
                    incompleteDataForCreation,
                    { json: true }
                )
                .expect('status', 400)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then(resp => {
                    expect(resp.json.message).toEqual(
                        'RequestValidationError: Schema validation error ( should have required property \'name\')'
                    );
                });
        });

        it('devrait retourner une erreur 400 en cas de données erronées', async () => {
            expect.hasAssertions();
            await frisby
                .post(
                    'http://api:3001/api/organizations',
                    {
                        ...completeDataForCreation,
                        email: 'not-an-email',
                    },
                    { json: true }
                )
                .expect('status', 400)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then(resp => {
                    expect(resp.json.message).toEqual(
                        'RequestValidationError: Schema validation error (/email: format should match format "email")'
                    );
                });
        });

        it('devrait retourner l\'entreprise crée avec un nouvel id en cas de succès', async () => {
            expect.hasAssertions();
            await frisby
                .post(
                    'http://api:3001/api/organizations',
                    completeDataForCreation,
                    { json: true }
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then(resp => {
                    expect(resp.json.id).not.toBeUndefined();
                    expect(resp.json.address).toEqual({
                        addressCountry: 'FR',
                        addressLocality: 'Caen',
                        postalCode: '14000',
                        streetAddress: '5, place de la Répulique',
                    });
                });
        });
    });
});
