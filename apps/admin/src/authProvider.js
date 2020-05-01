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
                return localStorage.setItem('permissions', 'authenticated');
            });
    },
    logout: () => {
        const request = new Request('http://localhost:8001/logout', {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
        });
        inMemoryJWT.ereaseToken();
        localStorage.setItem('permissions', 'anonymous');

        return fetch(request).then(() => '/');
    },
    checkAuth: () => {
        const role = localStorage.getItem('permissions');
        if (!inMemoryJWT.getToken() && role === 'authenticated') {
            return inMemoryJWT.getRefreshedJWT().then((gotIt) => {
                if (!gotIt) {
                    localStorage.setItem('permissions', 'anonymous');
                }
                return Promise.resolve();
            });
        } else {
            return Promise.resolve();
        }
    },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            inMemoryJWT.ereaseToken();
            localStorage.setItem('permissions', 'anonymous');
        }
        return Promise.resolve();
    },
    getPermissions: () => {
        const role = localStorage.getItem('permissions');
        const finalRole =
            role === 'authenticated' && inMemoryJWT.getToken
                ? 'authenticated'
                : 'anonymous';

        return Promise.resolve(finalRole);
    },
};
