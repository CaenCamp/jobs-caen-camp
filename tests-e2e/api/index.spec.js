import frisby from 'frisby';
const Joi = frisby.Joi;

describe('jobBoard API endpoint', () => {
    describe('/api', () => {
        it('devrait renvoyer un simple message de bienvenue', async () => {
            expect.hasAssertions();
            await frisby
                .get('http://jobboard:3001/api')
                .expect('status', 200)
                .expect(
                    'header',
                    'Content-Type',
                    'application/json; charset=utf-8'
                )
                .expect('jsonTypes', 'message', Joi.string().required())
                .then(resp => {
                    expect(resp.json.message).toStrictEqual(
                        'CaenCamp Jobboard API'
                    );
                });
        });
    });
});
