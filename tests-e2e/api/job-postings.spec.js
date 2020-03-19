import frisby from 'frisby';
import omit from 'lodash.omit';

describe('JobPostings API Endpoints', () => {
    describe('GET: /api/job-posting', () => {
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
                .expect('header', 'content-range', 'jobpostings 0-3/3')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(3);
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

        it('devrait pouvoir renvoyer une liste ordonnée par title avec paramètres sort [title, DESC]', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?sort=${JSON.stringify([
                        'title',
                        'DESC',
                    ])}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'content-range', 'jobpostings 0-3/3')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(3);
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

        it('devrait pouvoir renvoyer une liste ordonnée par date de dépôt avec paramètres sort [datePosted, ASC]', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?sort=${JSON.stringify([
                        'datePosted',
                        'ASC',
                    ])}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'content-range', 'jobpostings 0-3/3')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(3);
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

        it('devrait pouvoir renvoyer une liste ordonnée par code postal de l\'entreprise [hiringOrganizationPostalCode, ASC]', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?sort=${JSON.stringify([
                        'hiringOrganizationPostalCode',
                        'ASC',
                    ])}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'content-range', 'jobpostings 0-3/3')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(3);
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

        it('devrait pouvoir modifier la pagination avevc le paramètre de requête "pagination"', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?pagination=${JSON.stringify(
                        [2, 1]
                    )}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'content-range', 'jobpostings 0-2/3')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(2);
                });
            await frisby
                .get(
                    `http://api:3001/api/job-postings?pagination=${JSON.stringify(
                        [2, 2]
                    )}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'content-range', 'jobpostings 2-3/3')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(1);
                });
        });

        it('devrait accepter un filtre par title en "%LIKE%"', async () => {
            expect.hasAssertions();
            await frisby
                .get(
                    `http://api:3001/api/job-postings?filters=${JSON.stringify({
                        title: 'Lead',
                    })}&sort=${JSON.stringify(['title', 'DESC'])}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'content-range', 'jobpostings 0-2/2')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(2);
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
                    })}&sort=${JSON.stringify(['title', 'DESC'])}`
                )
                .expect('status', 200)
                .expect(
                    'header',
                    'content-type',
                    'application/json; charset=utf-8'
                )
                .expect('header', 'content-range', 'jobpostings 0-2/2')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(2);
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
                .expect('header', 'content-range', 'jobpostings 0-1/1')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(1);
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
                .expect('header', 'content-range', 'jobpostings 0-1/1')
                .then(resp => {
                    expect(resp.json.length).toStrictEqual(1);
                    expect(resp.json[0].title).toStrictEqual(
                        'Ingénieur Lead Full Stack technico-fonctionnel'
                    );
                });
        });
    });

    describe('POST: /api/job-posting', () => {
        const newJobPosting = {
            title: 'Developpeur Javascript',
            url: 'https://jobs.caen.camp',
            datePosted: '2010-03-02',
            employerOverview:
                'Au sein d\'une équipe DSI composée de juniors et de séniors',
            employmentType: 'CDD',
            experienceRequirements:
                '3 ans d\'experience sur un projet Javascript',
            jobStartDate: '2020-05-02',
            skills: 'JavaScript, Devops, Php, ...',
            validThrough: null,
            hiringOrganizationId: 'a122edec-5580-4a93-aff7-fc18b41e4c57',
        };
        it('devrait retourner une erreur 400 si une props de l\'offre d\'emploi est manquante', async () => {
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
                .then(resp => {
                    expect(resp.json.message).toEqual(
                        'RequestValidationError: Schema validation error ( should have required property \'employmentType\')'
                    );
                });
        });

        it('devrait retourner une erreur 400 si une props de l\'offre d\'emploi est mal formattée', async () => {
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
                .then(resp => {
                    expect(resp.json.message).toEqual(
                        'RequestValidationError: Schema validation error (/jobStartDate: format should match format "date")'
                    );
                });
        });

        it('devrait retourner une erreur 400 si l\'ìdentifiant de l\'entreprise est mal formatté', async () => {
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
                .then(resp => {
                    expect(resp.json.message).toEqual(
                        'RequestValidationError: Schema validation error (/hiringOrganizationId: format should match format "uuid")'
                    );
                });
        });

        it('devrait retourner une erreur 400 si l\'entreprise associée n\'existe pas', async () => {
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
                .then(resp => {
                    expect(resp.json.message).toEqual(
                        'this organization does not exist'
                    );
                });
        });

        it('devrait retourner l\'offre d\'emploi complete lorsqu\'elle est créée', async () => {
            expect.hasAssertions();
            const organization = await frisby
                .get('http://api:3001/api/organizations')
                .expect('status', 200)
                .then(resp => {
                    return resp.json.find(org => org.name === 'Flexcity');
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
                hiringOrganization: omit(createdJobPosting.hiringOrganization, [
                    'identifier',
                ]),
            }).toEqual({
                title: 'Developpeur Javascript',
                url: 'https://jobs.caen.camp',
                datePosted: '2010-03-02',
                employerOverview:
                    'Au sein d\'une équipe DSI composée de juniors et de séniors',
                employmentType: 'CDD',
                experienceRequirements:
                    '3 ans d\'experience sur un projet Javascript',
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
});
