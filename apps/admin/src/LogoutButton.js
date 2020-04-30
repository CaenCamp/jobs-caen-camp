import React, { forwardRef } from 'react';
import { useLogout, usePermissions, useRedirect } from 'react-admin';
import MenuItem from '@material-ui/core/MenuItem';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';
import LoginIcon from '@material-ui/icons/SettingsInputComponent';

const LogoutButton = (__, ref) => {
    const { permissions } = usePermissions();
    const logout = useLogout();
    const redirect = useRedirect();
    const handleLogout = () => logout();
    const handleLogin = () => redirect('/login');
    if (permissions === 'authenticated') {
        return (
            <MenuItem onClick={handleLogout} ref={ref}>
                <ExitIcon /> Logout
            </MenuItem>
        );
    }

    return (
        <MenuItem onClick={handleLogin} ref={ref}>
            <LoginIcon /> Administration
        </MenuItem>
    );
};

export default forwardRef(LogoutButton);
