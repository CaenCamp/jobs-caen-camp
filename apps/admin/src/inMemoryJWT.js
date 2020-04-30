const inMemoryJWTManager = () => {
    let inMemoryJWT = null;

    // This listener will allow to disconnect a session of the admin started in another tab
    window.addEventListener('storage', (event) => {
        if (event.key === 'logout') {
            inMemoryJWT = null;
        }
    });

    // This countdown feature is used to renew the JWT in a way that is transparent to the user.
    // before it's no longer valid
    let refreshTimeOutId;
    const refreshToken = (delay) => {
        refreshTimeOutId = window.setTimeout(
            getRefreshedJWT,
            delay * 1000 - 3000
        ); // Validity period of the token in seconds, minus 3 seconds
    };
    const abordRefreshToken = () => {
        if (refreshTimeOutId) {
            window.clearTimeout(refreshTimeOutId);
        }
    };

    // The method make a call to the refresh-token endpoint
    // If there is a valid cookie, the endpoint will return a fresh jwt.
    const getRefreshedJWT = () => {
        const request = new Request('http://localhost:8001/refresh-token', {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
        });
        return fetch(request)
            .then((response) => {
                if (response.status !== 200) {
                    ereaseToken();
                    global.console.log(
                        'Failed to renew the jwt from the refresh token.'
                    );
                    return { token: null };
                }
                return response.json();
            })
            .then(({ token, tokenExpiry }) => {
                if (token) {
                    setToken(token, tokenExpiry);
                    return true;
                }

                return false;
            });
    };

    const ereaseToken = () => {
        inMemoryJWT = null;
        abordRefreshToken();
        window.localStorage.setItem('logout', Date.now());
    };

    const setToken = (token, delay) => {
        inMemoryJWT = token;
        refreshToken(delay);
    };

    return {
        getToken: () => inMemoryJWT,
        setToken,
        ereaseToken,
        getRefreshedJWT,
    };
};

export default inMemoryJWTManager();
