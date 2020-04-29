import React, { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import { PropTypes } from 'prop-types';

const LoginPage = ({ theme }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();
    const submit = (e) => {
        e.preventDefault();
        login({ username, password }).catch(() =>
            notify('Invalid email or password')
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <form onSubmit={submit}>
                <input
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                />
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                />
                <input name="login" type="submit" value="Login" />
            </form>
            <Notification />
        </ThemeProvider>
    );
};

LoginPage.propTypes = {
    theme: PropTypes.object.isRequired,
};

export default LoginPage;
