import querystring from 'querystring';
import frisby from 'frisby';
import omit from 'lodash.omit';

const newJobPosting = {
    title: 'Developpeur Javascript',
    url: 'https://jobs.caen.camp',
    datePosted: '2010-03-02',
    employerOverview:
        "Au sein d'une équipe DSI composée de juniors et de séniors",
    employmentType: 'CDD',
    experienceRequirements: "3 ans d'experience sur un projet Javascript",
    jobStartDate: '2020-05-02',
    skills: 'JavaScript, Devops, Php, ...',
    validThrough: null,
    hiringOrganizationId: 'a122edec-5580-4a93-aff7-fc18b41e4c57',
};

describe('JobPostings API Endpoints', () => {
    describe('GET: /api/job-postings', () => {
        it('devrait renvoyer une liste paginée ordonnée par date de création sans paramètres de requête', async () => {
            expect.hasAssertions();
            await frisby
                .get('http://api:3001/api/job-postings')
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'x-total-count', '3')
                .expect(
                    'header',
                    'link',
                    [
                        '</api/job-postings?currentPage=1&perPage=10>; rel="first"',
                        // '</api/job-postings?currentPage=1&perPage=10>; rel="prev"',
                        // '</api/job-postings?currentPage=1&perPage=10>; rel="self"',
                        // '</api/job-postings?currentPage=1&perPage=10>; rel="next"',
                        // '</api/job-postings?currentPage=1&perPage=10>; rel="last"',
                    ].join(',')
                )
                .then((resp) => {
                    expect(resp.json).toHaveLength(3);
                    expect(resp.json[0].title).toStrictEqual(
                        'Data Science Lead'
                    );
                    expect(resp.json[1].title).toStrictEqual(
                        'Ingénieur Lead Full Stack technico-fonctionnel'
                    );
                    expect(resp.json[2].title).toStrictEqual(
                        'R&D Software Engineer'
                    );
                });
        });

        it('devrait pouvoir renvoyer une liste ordonnée par title avec paramètres { sortBy: title, orderBy: DESC }', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?${querystring.stringify({
                        sortBy: 'title',
                        orderBy: 'DESC',
                    })}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'x-total-count', '3')
                .expect(
                    'header',
                    'link',
                    [
                        '</api/job-postings?currentPage=1&perPage=10>; rel="first"',
                        // '</api/job-postings?currentPage=1&perPage=10>; rel="prev"',
                        // '</api/job-postings?currentPage=1&perPage=10>; rel="self"',
                        // '</api/job-postings?currentPage=1&perPage=10>; rel="next"',
                        // '</api/job-postings?currentPage=1&perPage=10>; rel="last"',
                    ].join(',')
                )
                .then((resp) => {
                    expect(resp.json).toHaveLength(3);
                    expect(resp.json[0].title).toStrictEqual(
                        'R&D Software Engineer'
                    );
                    expect(resp.json[1].title).toStrictEqual(
                        'Ingénieur Lead Full Stack technico-fonctionnel'
                    );
                    expect(resp.json[2].title).toStrictEqual(
                        'Data Science Lead'
                    );
                });
        });

        it('devrait pouvoir renvoyer une liste ordonnée par date de dépôt avec paramètres { sortBy: "datePosted", orderBy: "ASC"', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?${querystring.stringify({
                        sortBy: 'datePosted',
                        orderBy: 'ASC',
                    })}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'x-total-count', '3')
                .expect(
                    'header',
                    'link',
                    [
                        '</api/job-postings?currentPage=1&perPage=10>; rel="first"',
                        // '</api/job-postings?currentPage=1&perPage=10>; rel="prev"',
                        // '</api/job-postings?currentPage=1&perPage=10>; rel="self"',
                        // '</api/job-postings?currentPage=1&perPage=10>; rel="next"',
                        // '</api/job-postings?currentPage=1&perPage=10>; rel="last"',
                    ].join(',')
                )
                .then((resp) => {
                    expect(resp.json).toHaveLength(3);
                    expect(resp.json[0].title).toStrictEqual(
                        'Data Science Lead'
                    );
                    expect(resp.json[1].title).toStrictEqual(
                        'Ingénieur Lead Full Stack technico-fonctionnel'
                    );
                    expect(resp.json[2].title).toStrictEqual(
                        'R&D Software Engineer'
                    );
                });
        });

        it("devrait pouvoir renvoyer une liste ordonnée par code postaux ascendant de l'entreprise hiringOrganizationPostalCode", async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?${querystring.stringify({
                        sortBy: 'hiringOrganizationPostalCode',
                        orderBy: 'ASC',
                    })}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'x-total-count', '3')
                .then((resp) => {
                    expect(resp.headers.get('link')).toBe(
                        [
                            '</api/job-postings?currentPage=1&perPage=10>; rel="first"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="prev"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="self"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="next"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="last"',
                        ].join(',')
                    );
                    expect(resp.json).toHaveLength(3);
                    expect(
                        resp.json[0].hiringOrganization.address.postalCode
                    ).toStrictEqual('14460');
                    expect(
                        resp.json[1].hiringOrganization.address.postalCode
                    ).toStrictEqual('14461');
                    expect(
                        resp.json[2].hiringOrganization.address.postalCode
                    ).toStrictEqual('93300');
                });
        });

        it('devrait pouvoir modifier la pagination avec les paramètres de requête "pagination"', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?${querystring.stringify({
                        perPage: 2,
                        currentPage: 1,
                    })}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'x-total-count', '3')
                .then((resp) => {
                    expect(resp.headers.get('link')).toBe(
                        [
                            '</api/job-postings?currentPage=1&perPage=2>; rel="first"',
                            '</api/job-postings?currentPage=1&perPage=2>; rel="prev"',
                            '</api/job-postings?currentPage=1&perPage=2>; rel="self"',
                            '</api/job-postings?currentPage=2&perPage=2>; rel="next"',
                            '</api/job-postings?currentPage=2&perPage=2>; rel="last"',
                        ].join(',')
                    );
                    expect(resp.json).toHaveLength(2);
                });
            await frisby
                .get(
                    `http://api:3001/api/job-postings?${querystring.stringify({
                        perPage: 2,
                        currentPage: 2,
                    })}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'x-total-count', '3')
                .then((resp) => {
                    expect(resp.headers.get('link')).toBe(
                        [
                            '</api/job-postings?currentPage=1&perPage=2>; rel="first"',
                            '</api/job-postings?currentPage=1&perPage=2>; rel="prev"',
                            '</api/job-postings?currentPage=2&perPage=2>; rel="self"',
                            '</api/job-postings?currentPage=2&perPage=2>; rel="next"',
                            '</api/job-postings?currentPage=2&perPage=2>; rel="last"',
                        ].join(',')
                    );
                    expect(resp.json).toHaveLength(1);
                });
        });

        it('devrait accepter un filtre par title en "%LIKE%"', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?${querystring.stringify({
                        title: 'Lead',
                        sortBy: 'title',
                        orderBy: 'DESC',
                    })}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'x-total-count', '2')
                .then((resp) => {
                    expect(resp.headers.get('link')).toBe(
                        [
                            '</api/job-postings?currentPage=1&perPage=10>; rel="first"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="prev"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="self"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="next"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="last"',
                        ].join(',')
                    );
                    expect(resp.json).toHaveLength(2);
                    expect(resp.json[0].title).toStrictEqual(
                        'Ingénieur Lead Full Stack technico-fonctionnel'
                    );
                    expect(resp.json[1].title).toStrictEqual(
                        'Data Science Lead'
                    );
                });
        });

        it('devrait accepter un filtre par hiringOrganizationPostalCode en "LIKE%"', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?filters=${JSON.stringify({
                        hiringOrganizationPostalCode: 14,
                    })}&${querystring.stringify({
                        sortBy: 'title',
                        orderBy: 'DESC',
                    })}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'x-total-count', '2')
                .then((resp) => {
                    expect(resp.headers.get('link')).toBe(
                        [
                            '</api/job-postings?currentPage=1&perPage=10>; rel="first"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="prev"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="self"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="next"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="last"',
                        ].join(',')
                    );
                    expect(resp.json).toHaveLength(2);
                    expect(resp.json[0].title).toStrictEqual(
                        'Ingénieur Lead Full Stack technico-fonctionnel'
                    );
                    expect(resp.json[1].title).toStrictEqual(
                        'Data Science Lead'
                    );
                });
        });

        it('devrait accepter un filtre par datePosted_after', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?filters=${JSON.stringify({
                        datePosted_after: '2019-12-02',
                    })}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'x-total-count', '1')
                .then((resp) => {
                    expect(resp.headers.get('link')).toBe(
                        [
                            '</api/job-postings?currentPage=1&perPage=10>; rel="first"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="prev"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="self"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="next"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="last"',
                        ].join(',')
                    );
                    expect(resp.json).toHaveLength(1);
                    expect(resp.json[0].title).toStrictEqual(
                        'R&D Software Engineer'
                    );
                });
        });

        it('devrait accepter un filtre par jobStartDate_before', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?filters=${JSON.stringify({
                        jobStartDate_before: '2020-05-02',
                    })}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'x-total-count', '1')
                .then((resp) => {
                    expect(resp.headers.get('link')).toBe(
                        [
                            '</api/job-postings?currentPage=1&perPage=10>; rel="first"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="prev"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="self"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="next"',
                            '</api/job-postings?currentPage=1&perPage=10>; rel="last"',
                        ].join(',')
                    );
                    expect(resp.json).toHaveLength(1);
                    expect(resp.json[0].title).toStrictEqual(
                        'Ingénieur Lead Full Stack technico-fonctionnel'
                    );
                });
        });
    });

    describe('GET: /api/job-postings/:id', () => {
        it("devrait retourner une erreur 400 en cas d'id mal formaté", async () => {
            expect.hasAssertions();
            await frisby
                .get('http://api:3001/api/job-postings/id-mal-formaté')
                .expect('status', 400)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then((resp) => {
                    expect(resp.json.message).toEqual(
                        'RequestValidationError: Schema validation error (/identifier: format should match format "uuid")'
                    );
                });
        });

        it("devrait retourner une erreur 404 en cas d'id n'existant pas en base de données", async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    'http://api:3001/api/job-postings/9a6c8995-df54-446c-a5b8-71532c304751'
                )
                .expect('status', 404)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then((resp) => {
                    expect(resp.json.message).toEqual(
                        'The jobPosting of id 9a6c8995-df54-446c-a5b8-71532c304751 does not exist.'
                    );
                });
        });

        it("devrait retourner l'offre d'emploi complete lorsqu'elle existe", async () => {
            expect.hasAssertions();
            const jobPosting = await frisby
                .get('http://api:3001/api/job-postings')
                .expect('status', 200)
                .then((resp) => {
                    return resp.json.find(
                        (org) => org.title === 'Data Science Lead'
                    );
                });

            await frisby
                .get(`http://api:3001/api/job-postings/${jobPosting.id}`)
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then((resp) => {
                    expect(resp.json.title).toEqual('Data Science Lead');
                });
        });
    });

    describe('POST, PUT and DELETE SECURITY', () => {
        it('should return 401 on POST request without JWT authentication', async () => {
            expect.hasAssertions();
            await frisby
                .post('http://api:3001/api/job-postings', newJobPosting, {
                    json: true,
                })
                .expect('status', 401)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then((resp) => {
                    expect(resp.json.message).toEqual(
                        "You don't have the rights to make this query"
                    );
                });
        });

        it('should return 401 on DELETE request without JWT authentication', async () => {
            expect.hasAssertions();
            await frisby
                .delete(
                    'http://api:3001/api/job-postings/df2aa40e-f7be-486e-96c3-44aa5fb5ce42'
                )
                .expect('status', 401)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then((resp) => {
                    expect(resp.json.message).toEqual(
                        "You don't have the rights to make this query"
                    );
                });
        });

        it('should return 401 on PUT request without JWT authentication', async () => {
            expect.hasAssertions();
            await frisby
                .put(
                    'http://api:3001/api/job-postings/df2aa40e-f7be-486e-96c3-44aa5fb5ce42',
                    newJobPosting,
                    { json: true }
                )
                .expect('status', 401)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then((resp) => {
                    expect(resp.json.message).toEqual(
                        "You don't have the rights to make this query"
                    );
                });
        });
    });

    describe('Protected endpoints', () => {
        beforeEach(async () => {
            const jwt = await frisby
                .post(
                    'http://api:3001/authenticate',
                    { username: 'testUser', password: 'n33dToB3+Str0ng' },
                    { json: true }
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then((resp) => {
                    return resp.json.token;
                });
            frisby.globalSetup({
                request: {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                },
            });
        });

        describe('POST: /api/job-postings', () => {
            it("devrait retourner une erreur 400 si une props de l'offre d'emploi est manquante", async () => {
                expect.hasAssertions();
                await frisby
                    .post(
                        'http://api:3001/api/job-postings',
                        omit(newJobPosting, ['employmentType']),
                        { json: true }
                    )
                    .expect('status', 400)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    )
                    .then((resp) => {
                        expect(resp.json.message).toEqual(
                            "RequestValidationError: Schema validation error ( should have required property 'employmentType')"
                        );
                    });
            });

            it("devrait retourner une erreur 400 si une props de l'offre d'emploi est mal formattée", async () => {
                expect.hasAssertions();
                await frisby
                    .post(
                        'http://api:3001/api/job-postings',
                        {
                            ...newJobPosting,
                            jobStartDate: 'this-is-not-a-date',
                        },
                        { json: true }
                    )
                    .expect('status', 400)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    )
                    .then((resp) => {
                        expect(resp.json.message).toEqual(
                            'RequestValidationError: Schema validation error (/jobStartDate: format should match format "date")'
                        );
                    });
            });

            it("devrait retourner une erreur 400 si l'ìdentifiant de l'entreprise est mal formatté", async () => {
                expect.hasAssertions();
                await frisby
                    .post(
                        'http://api:3001/api/job-postings',
                        {
                            ...newJobPosting,
                            hiringOrganizationId: 'not-uuid',
                        },
                        { json: true }
                    )
                    .expect('status', 400)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    )
                    .then((resp) => {
                        expect(resp.json.message).toEqual(
                            'RequestValidationError: Schema validation error (/hiringOrganizationId: format should match format "uuid")'
                        );
                    });
            });

            it("devrait retourner une erreur 400 si l'entreprise associée n'existe pas", async () => {
                expect.hasAssertions();
                await frisby
                    .post('http://api:3001/api/job-postings', newJobPosting, {
                        json: true,
                    })
                    .expect('status', 400)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    )
                    .then((resp) => {
                        expect(resp.json.message).toEqual(
                            'this organization does not exist'
                        );
                    });
            });

            it("devrait retourner l'offre d'emploi complete lorsqu'elle est créée", async () => {
                expect.hasAssertions();
                const organization = await frisby
                    .get('http://api:3001/api/organizations')
                    .expect('status', 200)
                    .then((resp) => {
                        return resp.json.find((org) => org.name === 'Flexcity');
                    });
                const { json: createdJobPosting } = await frisby
                    .post(
                        'http://api:3001/api/job-postings',
                        {
                            ...newJobPosting,
                            hiringOrganizationId: organization.id,
                        },
                        { json: true }
                    )
                    .expect('status', 200)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    );
                expect({
                    ...omit(createdJobPosting, ['id']),
                    hiringOrganization: omit(
                        createdJobPosting.hiringOrganization,
                        ['identifier']
                    ),
                }).toEqual({
                    title: 'Developpeur Javascript',
                    url: 'https://jobs.caen.camp',
                    datePosted: '2010-03-02',
                    employerOverview:
                        "Au sein d'une équipe DSI composée de juniors et de séniors",
                    employmentType: 'CDD',
                    experienceRequirements:
                        "3 ans d'experience sur un projet Javascript",
                    jobStartDate: '2020-05-02',
                    skills: 'JavaScript, Devops, Php, ...',
                    validThrough: null,
                    hiringOrganization: {
                        name: 'Flexcity',
                        image:
                            'https://www.flexcity.energy/sites/g/files/dvc3216/files/styles/logo_desktop_base/public/Logo-Flexcity-by-Veolia---480x128.jpg',
                        url: 'https://www.flexcity.energy/fr',
                        address: {
                            addressCountry: 'FR',
                            addressLocality: 'Aubervilliers',
                            postalCode: '93300',
                        },
                    },
                });

                return frisby
                    .delete(
                        `http://api:3001/api/job-postings/${createdJobPosting.id}`
                    )
                    .expect('status', 200);
            });
        });

        describe('DELETE: /api/job-postings/:id', () => {
            it("devrait retourner une erreur 400 en cas d'id mal formaté", async () => {
                expect.hasAssertions();
                await frisby
                    .delete('http://api:3001/api/job-postings/id-mal-formaté')
                    .expect('status', 400)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    )
                    .then((resp) => {
                        expect(resp.json.message).toEqual(
                            'RequestValidationError: Schema validation error (/identifier: format should match format "uuid")'
                        );
                    });
            });

            it("devrait retourner une erreur 404 en cas d'id n'existant pas en base de données", async () => {
                expect.hasAssertions();
                await frisby
                    .delete(
                        'http://api:3001/api/job-postings/9a6c8995-df54-446c-a5b8-71532c304751'
                    )
                    .expect('status', 404)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    )
                    .then((resp) => {
                        expect(resp.json.message).toEqual(
                            'The jobPosting of id 9a6c8995-df54-446c-a5b8-71532c304751 does not exist.'
                        );
                    });
            });

            it("devrait retourner l'identifiant de l'offre d'emploi complete en cas de succès", async () => {
                expect.hasAssertions();
                const organization = await frisby
                    .get('http://api:3001/api/organizations')
                    .expect('status', 200)
                    .then((resp) => {
                        return resp.json.find((org) => org.name === 'Flexcity');
                    });

                // A new job posting is being created
                const { json: createdJobPosting } = await frisby
                    .post(
                        'http://api:3001/api/job-postings',
                        {
                            ...newJobPosting,
                            hiringOrganizationId: organization.id,
                        },
                        { json: true }
                    )
                    .expect('status', 200);

                // We verify that the job offer has been created...
                await frisby
                    .get('http://api:3001/api/job-postings')
                    .expect('status', 200)
                    .expect('header', 'x-total-count', '4')
                    .then((resp) => {
                        expect(resp.headers.get('link')).toBe(
                            [
                                '</api/job-postings?currentPage=1&perPage=10>; rel="first"',
                                '</api/job-postings?currentPage=1&perPage=10>; rel="prev"',
                                '</api/job-postings?currentPage=1&perPage=10>; rel="self"',
                                '</api/job-postings?currentPage=1&perPage=10>; rel="next"',
                                '</api/job-postings?currentPage=1&perPage=10>; rel="last"',
                            ].join(',')
                        );
                        expect(
                            resp.json.find(
                                (jb) => jb.id === createdJobPosting.id
                            )
                        ).toBeTruthy();
                    });

                // We're removing the job offer
                await frisby
                    .delete(
                        `http://api:3001/api/job-postings/${createdJobPosting.id}`
                    )
                    .expect('status', 200)
                    .then((resp) => {
                        expect(resp.json.id).toEqual(createdJobPosting.id);
                    });

                // We're checking to see if the offer has been deleted...
                return frisby
                    .get('http://api:3001/api/job-postings')
                    .expect('status', 200)
                    .expect('header', 'x-total-count', '3')
                    .then((resp) => {
                        expect(resp.headers.get('link')).toBe(
                            [
                                '</api/job-postings?currentPage=1&perPage=10>; rel="first"',
                                '</api/job-postings?currentPage=1&perPage=10>; rel="prev"',
                                '</api/job-postings?currentPage=1&perPage=10>; rel="self"',
                                '</api/job-postings?currentPage=1&perPage=10>; rel="next"',
                                '</api/job-postings?currentPage=1&perPage=10>; rel="last"',
                            ].join(',')
                        );
                        expect(
                            resp.json.find(
                                (jb) => jb.id === createdJobPosting.id
                            )
                        ).toBeFalsy();
                    });
            });
        });

        describe('PUT: /api/job-postings/:jobPostingId', () => {
            it("devrait retourner une erreur 400 si l'id de l'offre d'emploi est mal formattée", async () => {
                expect.hasAssertions();
                await frisby
                    .put(
                        'http://api:3001/api/job-postings/not-an-uuid',
                        newJobPosting,
                        { json: true }
                    )
                    .expect('status', 400)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    )
                    .then((resp) => {
                        expect(resp.json.message).toEqual(
                            'RequestValidationError: Schema validation error (/identifier: format should match format "uuid")'
                        );
                    });
            });
            it("devrait retourner une erreur 400 si une props de l'offre d'emploi est manquante", async () => {
                expect.hasAssertions();
                await frisby
                    .put(
                        'http://api:3001/api/job-postings/b6c2cd95-1dfa-4fa0-a776-8f125918c45c',
                        omit(newJobPosting, ['employmentType']),
                        { json: true }
                    )
                    .expect('status', 400)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    )
                    .then((resp) => {
                        expect(resp.json.message).toEqual(
                            "RequestValidationError: Schema validation error ( should have required property 'employmentType')"
                        );
                    });
            });

            it("devrait retourner une erreur 400 si une props de l'offre d'emploi est mal formattée", async () => {
                expect.hasAssertions();
                await frisby
                    .put(
                        'http://api:3001/api/job-postings/b6c2cd95-1dfa-4fa0-a776-8f125918c45c',
                        {
                            ...newJobPosting,
                            jobStartDate: 'this-is-not-a-date',
                        },
                        { json: true }
                    )
                    .expect('status', 400)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    )
                    .then((resp) => {
                        expect(resp.json.message).toEqual(
                            'RequestValidationError: Schema validation error (/jobStartDate: format should match format "date")'
                        );
                    });
            });

            it("devrait retourner une erreur 404 si l'offre d'emploi n'existe pas", async () => {
                expect.hasAssertions();
                await frisby
                    .put(
                        'http://api:3001/api/job-postings/b6c2cd95-1dfa-4fa0-a776-8f125918c45c',
                        newJobPosting,
                        { json: true }
                    )
                    .expect('status', 404)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    )
                    .then((resp) => {
                        expect(resp.json.message).toEqual(
                            'The jobPosting of id b6c2cd95-1dfa-4fa0-a776-8f125918c45c does not exist, so it could not be updated'
                        );
                    });
            });

            it("devrait retourner une erreur 400 si un changement d'entreprise concerne une entreprise qui n'existe pas", async () => {
                expect.hasAssertions();
                const jobPosting = await frisby
                    .get('http://api:3001/api/job-postings')
                    .expect('status', 200)
                    .then((resp) => {
                        return resp.json.find(
                            (org) => org.title === 'Data Science Lead'
                        );
                    });

                await frisby
                    .put(
                        `http://api:3001/api/job-postings/${jobPosting.id}`,
                        {
                            ...omit(jobPosting, ['id', 'hiringOrganization']),
                            hiringOrganizationId:
                                'b6c2cd95-1dfa-4fa0-a776-8f125918c45c',
                        },
                        { json: true }
                    )
                    .expect('status', 400)
                    .then((resp) => {
                        expect(resp.json.message).toEqual(
                            'the new hiring organization does not exist'
                        );
                    });
            });

            it("devrait retourner l'offre d'emploi mise à jour", async () => {
                expect.hasAssertions();
                const organization = await frisby
                    .get('http://api:3001/api/organizations')
                    .expect('status', 200)
                    .then((resp) => {
                        return resp.json.find((org) => org.name === 'Flexcity');
                    });

                const { json: createdJobPosting } = await frisby
                    .post(
                        'http://api:3001/api/job-postings',
                        {
                            ...newJobPosting,
                            hiringOrganizationId: organization.id,
                        },
                        { json: true }
                    )
                    .expect('status', 200)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    );
                expect(createdJobPosting.title).toEqual(
                    'Developpeur Javascript'
                );

                await frisby
                    .put(
                        `http://api:3001/api/job-postings/${createdJobPosting.id}`,
                        {
                            ...omit(createdJobPosting, [
                                'id',
                                'hiringOrganization',
                            ]),
                            hiringOrganizationId:
                                createdJobPosting.hiringOrganization.identifier,
                            title: 'Developpeur Php',
                        },
                        { json: true }
                    )
                    .expect('status', 200)
                    .then((resp) => {
                        expect(resp.json.title).toEqual('Developpeur Php');
                        expect(resp.json.hiringOrganization.identifier).toEqual(
                            organization.id
                        );
                    });

                return frisby
                    .delete(
                        `http://api:3001/api/job-postings/${createdJobPosting.id}`
                    )
                    .expect('status', 200);
            });

            it("devrait permettre de changer l'entreprise liée à une offre", async () => {
                expect.hasAssertions();
                const organizations = await frisby
                    .get('http://api:3001/api/organizations')
                    .expect('status', 200)
                    .then((resp) => resp.json);

                const firstOrganization = organizations.find(
                    (org) => org.name === 'Flexcity'
                );
                const secondOrganization = organizations.find(
                    (org) => org.name === 'Limengo'
                );

                const { json: createdJobPosting } = await frisby
                    .post(
                        'http://api:3001/api/job-postings',
                        {
                            ...newJobPosting,
                            hiringOrganizationId: firstOrganization.id,
                        },
                        { json: true }
                    )
                    .expect('status', 200)
                    .expect(
                        'header',
                        'Content-Type',
                        'application/json; charset=utf-8'
                    );

                expect(createdJobPosting.title).toEqual(
                    'Developpeur Javascript'
                );

                await frisby
                    .put(
                        `http://api:3001/api/job-postings/${createdJobPosting.id}`,
                        {
                            ...omit(createdJobPosting, [
                                'id',
                                'hiringOrganization',
                            ]),
                            hiringOrganizationId: secondOrganization.id,
                            title: 'Developpeur Php',
                        },
                        { json: true }
                    )
                    .expect('status', 200)
                    .then((resp) => {
                        expect(resp.json.hiringOrganization.name).toEqual(
                            'Limengo'
                        );
                    });

                return frisby
                    .delete(
                        `http://api:3001/api/job-postings/${createdJobPosting.id}`
                    )
                    .expect('status', 200);
            });
        });
    });
});
