window.addEventListener('storage', (event) => {
    if (event.key === 'logout') {
        global.inMemoryToken = null;
    }
});

let refreshTimeOutId;

const refreshToken = (delay) => {
    refreshTimeOutId = window.setTimeout(getRefreshedJWT, delay * 1000 - 3000); // Validity period of the token in seconds, minus 3 seconds
};

const abordRefreshToken = () => {
    if (refreshTimeOutId) {
        window.clearTimeout(refreshTimeOutId);
    }
};

const getRefreshedJWT = () => {
    const request = new Request('http://localhost:8001/refresh-token', {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'include',
    });
    return fetch(request)
        .then((response) => {
            if (response.status !== 200) {
                global.inMemoryToken = null;
                window.localStorage.setItem('logout', Date.now());
                global.console.log(
                    'Failed to renew the jwt from the refresh token.'
                );
                return { token: null };
            }
            return response.json();
        })
        .then(({ token, tokenExpiry }) => {
            if (token) {
                global.inMemoryToken = {
                    token,
                };
                refreshToken(tokenExpiry);
                return true;
            }

            return false;
        });
};

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
                global.inMemoryToken = {
                    token,
                };
                refreshToken(tokenExpiry);
            });
    },
    logout: () => {
        const request = new Request('http://localhost:8001/logout', {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
        });
        global.inMemoryToken = null;
        window.localStorage.setItem('logout', Date.now());
        abordRefreshToken();

        return fetch(request).then(() => '/login');
    },
    checkAuth: () => {
        if (!global.inMemoryToken) {
            return getRefreshedJWT().then((gotIt) => {
                return gotIt ? Promise.resolve() : Promise.reject();
            });
        } else {
            return Promise.resolve();
        }
    },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            global.inMemoryToken = null;
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () => {
        return Promise.resolve();
    },
};
