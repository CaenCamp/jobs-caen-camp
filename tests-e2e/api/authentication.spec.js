import frisby from 'frisby';

describe('Authentication API Endpoints', () => {
    describe('POST: /authenticate', () => {
        it("devrait retourner une erreur 401 si le username n'existe pas", async () => {
            expect.hasAssertions();
            await frisby
                .post(
                    'http://api:3001/authenticate',
                    { username: 'donotexist', password: 'azerty' },
                    { json: true }
                )
                .expect('status', 401)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then((resp) => {
                    expect(resp.json.message).toEqual('Invalid credentials.');
                });
        });

        it('devrait retourner une erreur 401 si le mot de passe est faux', async () => {
            expect.hasAssertions();
            await frisby
                .post(
                    'http://api:3001/authenticate',
                    { username: 'testUser', password: 'azerty' },
                    { json: true }
                )
                .expect('status', 401)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .then((resp) => {
                    expect(resp.json.message).toEqual('Invalid credentials.');
                });
        });

        it('devrait retourner un token et un username si le username et le mot de passe sont valides', async () => {
            expect.hasAssertions();
            await frisby
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
                    expect(resp.json.username).toEqual('testUser');
                    expect(resp.json.token).not.toBeUndefined();
                });
        });
    });
});
