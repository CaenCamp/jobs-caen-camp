import frisby from 'frisby';

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

        it("devrait pouvoir renvoyer une liste ordonnée par code postal de l'entreprise [hiringOrganizationPostalCode, ASC]", async () => {
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
});
