/* eslint-disable jest/no-test-return-statement */
/* eslint-disable jest/expect-expect */
import frisby from 'frisby';

describe('api server', () => {
    it('should return ok status code', () => {
        expect.assertions(1);
        return frisby.get('http://localhost:3001').expect('status', 200);
    });
});
