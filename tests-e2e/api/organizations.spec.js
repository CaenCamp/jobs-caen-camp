import frisby from 'frisby';
import omit from 'lodash.omit';

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

describe('Organizations API Endpoints', () => {
    describe('GET: /api/organizations', () => {
        it('devrait renvoyer une liste paginée ordonnée par nom d\'entreprise sans paramètres de requête', async () => {
            expect.hasAssertions();
            await frisby
                .get('http://api:3001/api/organizations')
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'content-range', 'organizations 0-3/3')
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
                    return frisby
                        .delete(
                            `http://api:3001/api/organizations/${resp.json.id}`
                        )
                        .expect('status', 200);
                });
        });

        it('devrait permettre de créer une entreprise avec plusieurs contacts', async () => {
            expect.hasAssertions();
            await frisby
                .post(
                    'http://api:3001/api/organizations',
                    {
                        ...completeDataForCreation,
                        contactPoints: [
                            ...completeDataForCreation.contactPoints,
                            {
                                name: 'John C.',
                                email: 'john@impulse.com',
                                contactType: 'Conseilles en musique',
                            },
                        ],
                    },
                    { json: true }
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then(resp => {
                    expect(resp.json.contactPoints.length).toEqual(2);
                    return frisby
                        .delete(
                            `http://api:3001/api/organizations/${resp.json.id}`
                        )
                        .expect('status', 200);
                });
        });
    });

    describe('GET: /api/organizations/:organizationId', () => {
        it('devrait retourner une erreur 400 en cas d\'id mal formaté', async () => {
            expect.hasAssertions();
            await frisby
                .get('http://api:3001/api/organizations/id-mal-formaté')
                .expect('status', 400)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then(resp => {
                    expect(resp.json.message).toEqual(
                        'RequestValidationError: Schema validation error (/identifier: format should match format "uuid")'
                    );
                });
        });

        it('devrait retourner une erreur 404 en cas d\'id n\'existant pas en base de données', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    'http://api:3001/api/organizations/9a6c8995-df54-446c-a5b8-71532c304751'
                )
                .expect('status', 404)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then(resp => {
                    expect(resp.json.message).toEqual(
                        'The organization of id 9a6c8995-df54-446c-a5b8-71532c304751 does not exist.'
                    );
                });
        });

        it('devrait retourner une entreprise complete si elle existe', async () => {
            expect.hasAssertions();
            await frisby
                .get('http://api:3001/api/organizations')
                .expect('status', 200)
                .then(async resp => {
                    const qwarry = resp.json.find(org => org.name === 'Qwarry');
                    const qwarryFromGet = await frisby
                        .get(`http://api:3001/api/organizations/${qwarry.id}`)
                        .expect('status', 200)
                        .expect(
                            'header',
                            'Content-Type',
                            'application/json; charset=utf-8'
                        );

                    expect(qwarry).toEqual(qwarryFromGet.json);
                });
        });
    });

    describe('DELETE: /api/organizations/:organizationId', () => {
        it('devrait retourner une erreur 400 en cas d\'id mal formaté', async () => {
            expect.hasAssertions();
            await frisby
                .delete('http://api:3001/api/organizations/id-mal-formaté')
                .expect('status', 400)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then(resp => {
                    expect(resp.json.message).toEqual(
                        'RequestValidationError: Schema validation error (/identifier: format should match format "uuid")'
                    );
                });
        });

        it('devrait retourner une erreur 404 en cas d\'id n\'existant pas en base de données', async () => {
            expect.hasAssertions();
            await frisby
                .delete(
                    'http://api:3001/api/organizations/9a6c8995-df54-446c-a5b8-71532c304751'
                )
                .expect('status', 404)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then(resp => {
                    expect(resp.json.message).toEqual(
                        'The organization of id 9a6c8995-df54-446c-a5b8-71532c304751 does not exist.'
                    );
                });
        });

        it('devrait retourner l\'identifiant de l\'entreprise supprimée en cas de succes', async () => {
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
                .then(async ({ json: newOrganization }) => {
                    const { json: organizationList } = await frisby
                        .get('http://api:3001/api/organizations')
                        .expect('status', 200)
                        .expect(
                            'header',
                            'content-range',
                            'organizations 0-4/4'
                        );
                    expect(
                        organizationList.find(
                            org => org.id === newOrganization.id
                        )
                    ).toBeTruthy();
                    await frisby
                        .delete(
                            `http://api:3001/api/organizations/${newOrganization.id}`
                        )
                        .expect('status', 200);
                    const { json: updatedOrganizationList } = await frisby
                        .get('http://api:3001/api/organizations')
                        .expect('status', 200)
                        .expect(
                            'header',
                            'content-range',
                            'organizations 0-3/3'
                        );
                    expect(
                        updatedOrganizationList.find(
                            org => org.id === newOrganization.id
                        )
                    ).toBeFalsy();
                });
        });
    });

    describe('PUT: /api/organizations/:organizationId', () => {
        it('devrait retourner une erreur 404 en cas d\'id n\'existant pas en base de données', async () => {
            const completeDataForEdition = {
                ...completeDataForCreation,
                contactPoints: completeDataForCreation.contactPoints.map(
                    contact => ({
                        identifier: '999904e7-37a3-4eaf-92bb-4f51f70dc595',
                        ...contact,
                    })
                ),
            };
            expect.hasAssertions();
            await frisby
                .put(
                    'http://api:3001/api/organizations/9a6c8995-df54-446c-a5b8-71532c304751',
                    completeDataForEdition,
                    { json: true }
                )
                .expect('status', 404)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then(resp => {
                    expect(resp.json.message).toEqual(
                        'The organization of id 9a6c8995-df54-446c-a5b8-71532c304751 does not exist, so it could not be updated'
                    );
                });
        });

        it('devrait retourner une erreur 400 en cas d\'id mal formaté', async () => {
            expect.hasAssertions();
            await frisby
                .put(
                    'http://api:3001/api/organizations/this-is-not-an-uuid',
                    completeDataForCreation,
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
                        'RequestValidationError: Schema validation error (/identifier: format should match format "uuid")'
                    );
                });
        });

        it('devrait retourner une erreur 400 si il manque une donnée sur l\'entreprise', async () => {
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
                .then(async ({ json: organization }) => {
                    const incompleteOrganization = omit(organization, ['name']);
                    await frisby
                        .put(
                            `http://api:3001/api/organizations/${organization.id}`,
                            incompleteOrganization,
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
                    return frisby
                        .delete(
                            `http://api:3001/api/organizations/${organization.id}`
                        )
                        .expect('status', 200);
                });
        });

        it('devrait retourner une erreur 400 si une donnée sur l\'entreprise est mal formatée', async () => {
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
                .then(async ({ json: organization }) => {
                    const notWellFormatedOrganization = {
                        ...organization,
                        email: 'not-an-email',
                    };
                    await frisby
                        .put(
                            `http://api:3001/api/organizations/${organization.id}`,
                            notWellFormatedOrganization,
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
                    return frisby
                        .delete(
                            `http://api:3001/api/organizations/${organization.id}`
                        )
                        .expect('status', 200);
                });
        });

        it('devrait retourner une erreur 400 si il manque une donnée sur le contact entreprise', async () => {
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
                .then(async ({ json: organization }) => {
                    const incompleteOrganization = {
                        ...organization,
                        contactPoints: organization.contactPoints.map(
                            contact => ({ ...omit(contact, ['email']) })
                        ),
                    };
                    await frisby
                        .put(
                            `http://api:3001/api/organizations/${organization.id}`,
                            incompleteOrganization,
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
                                'RequestValidationError: Schema validation error (/contactPoints/0 should have required property \'email\')'
                            );
                        });
                    return frisby
                        .delete(
                            `http://api:3001/api/organizations/${organization.id}`
                        )
                        .expect('status', 200);
                });
        });

        it('devrait retourner une erreur 400 si une donnée sur un contact entreprise est mal formatée', async () => {
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
                .then(async ({ json: organization }) => {
                    const notWellFormatedOrganization = {
                        ...organization,
                        contactPoints: organization.contactPoints.map(
                            contact => ({
                                ...contact,
                                email: 'not-an-email',
                            })
                        ),
                    };
                    await frisby
                        .put(
                            `http://api:3001/api/organizations/${organization.id}`,
                            notWellFormatedOrganization,
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
                                'RequestValidationError: Schema validation error (/contactPoints/0/email: format should match format "email")'
                            );
                        });
                    return frisby
                        .delete(
                            `http://api:3001/api/organizations/${organization.id}`
                        )
                        .expect('status', 200);
                });
        });

        it('devrait permettre de mettre à jour une entreprise et son/ses contact.s', async () => {
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
                .then(async ({ json: organization }) => {
                    const updatedData = {
                        ...omit(organization, ['id']),
                        name: 'Ma petite entreprise',
                        contactPoints: organization.contactPoints.map(
                            contact => ({
                                ...contact,
                                name: 'Alain B.',
                            })
                        ),
                    };
                    await frisby
                        .put(
                            `http://api:3001/api/organizations/${organization.id}`,
                            updatedData,
                            { json: true }
                        )
                        .expect('status', 200)
                        .expect(
                            'header',
                            'Content-Type',
                            'application/json; charset=utf-8'
                        )
                        .then(resp => {
                            expect(resp.json.name).toEqual(
                                'Ma petite entreprise'
                            );
                            return frisby
                                .get(
                                    `http://api:3001/api/organizations/${organization.id}`
                                )
                                .expect('status', 200)
                                .then(resp => {
                                    expect(resp.json.name).toEqual(
                                        'Ma petite entreprise'
                                    );
                                    expect(
                                        resp.json.contactPoints[0].name
                                    ).toEqual('Alain B.');
                                });
                        });
                    return frisby
                        .delete(
                            `http://api:3001/api/organizations/${organization.id}`
                        )
                        .expect('status', 200);
                });
        });

        it('devrait permettre d\'ajouter et de supprimer des contacts', async () => {
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
                .then(async ({ json: organization }) => {
                    const newContact = {
                        name: 'John C.',
                        email: 'john@impulse.com',
                        contactType: 'Conseillé musical',
                    };
                    const updatedData = {
                        ...omit(organization, ['id']),
                        contactPoints: [
                            ...organization.contactPoints,
                            newContact,
                        ],
                    };
                    // test adding contact
                    const updatedContactPoints = await frisby
                        .put(
                            `http://api:3001/api/organizations/${organization.id}`,
                            updatedData,
                            { json: true }
                        )
                        .expect('status', 200)
                        .expect(
                            'header',
                            'Content-Type',
                            'application/json; charset=utf-8'
                        )
                        .then(() => {
                            return frisby
                                .get(
                                    `http://api:3001/api/organizations/${organization.id}`
                                )
                                .expect('status', 200)
                                .then(resp => {
                                    expect(
                                        resp.json.contactPoints.length
                                    ).toEqual(2);
                                    return resp.json.contactPoints;
                                });
                        });
                    // test remove contact
                    await frisby
                        .put(
                            `http://api:3001/api/organizations/${organization.id}`,
                            {
                                ...updatedData,
                                contactPoints: updatedContactPoints
                                    .filter(
                                        contact => contact.name === 'John C.'
                                    )
                                    .map(contact => ({
                                        ...contact,
                                        email: 'john-updated@impulse.com',
                                    })),
                            },
                            { json: true }
                        )
                        .expect('status', 200)
                        .expect(
                            'header',
                            'Content-Type',
                            'application/json; charset=utf-8'
                        )
                        .then(() => {
                            return frisby
                                .get(
                                    `http://api:3001/api/organizations/${organization.id}`
                                )
                                .expect('status', 200)
                                .then(resp => {
                                    expect(
                                        resp.json.contactPoints.length
                                    ).toEqual(1);
                                    expect(
                                        resp.json.contactPoints[0].name
                                    ).toEqual('John C.');
                                    expect(
                                        resp.json.contactPoints[0].email
                                    ).toEqual('john-updated@impulse.com');
                                });
                        });
                    return frisby
                        .delete(
                            `http://api:3001/api/organizations/${organization.id}`
                        )
                        .expect('status', 200);
                });
        });
    });
});
