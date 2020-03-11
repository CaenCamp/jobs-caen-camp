import frisby from 'frisby';

describe('jobBoard API endpoint', () => {
    describe('/api/organizations', () => {
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
});
