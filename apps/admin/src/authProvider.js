window.addEventListener('storage', (event) => {
    if (event.key === 'logout') {
        global.inMemoryToken = null;
    }
});

export const authProvider = {
    login: ({ username, password }) => {
        const request = new Request('http://localhost:8001/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then((response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ token }) => {
                global.inMemoryToken = {
                    token,
                };
            });
    },
    logout: () => {
        global.inMemoryToken = null;
        window.localStorage.setItem('logout', Date.now());

        return Promise.resolve();
    },
    checkAuth: () =>
        global.inMemoryToken ? Promise.resolve() : Promise.reject(),
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            global.inMemoryToken = null;
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () => Promise.resolve(),
};
