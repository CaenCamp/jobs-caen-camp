import inMemoryJWT from './inMemoryJWT';

export const authProvider = {
    login: ({ username, password }) => {
        const request = new Request('http://localhost:8001/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
        });
        return fetch(request)
            .then((response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ token, tokenExpiry }) => {
                inMemoryJWT.setToken(token, tokenExpiry);
            });
    },
    logout: () => {
        const request = new Request('http://localhost:8001/logout', {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
        });
        inMemoryJWT.ereaseToken();

        return fetch(request).then(() => '/login');
    },
    checkAuth: () => {
        if (!inMemoryJWT.getToken()) {
            // We check that the user was not already logged thanks to the refreshToken cookie.
            // If it was, and the cookie's still valid, we'd get a new jwt.
            return inMemoryJWT.getRefreshedJWT().then((gotIt) => {
                return gotIt ? Promise.resolve() : Promise.reject();
            });
        } else {
            return Promise.resolve();
        }
    },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            inMemoryJWT.ereaseToken();
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () => {
        return Promise.resolve();
    },
};
