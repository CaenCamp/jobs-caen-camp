import React from 'react';
import { fetchUtils, Admin, Resource } from 'react-admin';

import jobBoardDataProvider from './jobBoardDataProvider';
import { authProvider } from './authProvider';
import Organization from './organization';
import JobPosting from './job-posting';
import inMemoryJWT from './inMemoryJWT';
import LoginPage from './LoginPage';
import LogoutButton from './LogoutButton';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = inMemoryJWT.getToken();
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

const dataProvider = jobBoardDataProvider(
    'http://localhost:8001/api',
    httpClient
);

const App = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={dataProvider}
        loginPage={LoginPage}
        logoutButton={LogoutButton}
    >
        {(permissions) => [
            <Resource
                key="organisation"
                name="organizations"
                list={Organization.list}
                edit={
                    permissions === 'authenticated' ? Organization.edit : null
                }
                create={
                    permissions === 'authenticated' ? Organization.create : null
                }
                icon={Organization.icon}
                option={Organization.option}
                show={Organization.show}
            />,
            <Resource
                key="job-posting"
                name="job-postings"
                list={JobPosting.list}
                edit={permissions === 'authenticated' ? JobPosting.edit : null}
                create={
                    permissions === 'authenticated' ? JobPosting.create : null
                }
                icon={JobPosting.icon}
                option={JobPosting.option}
                show={Organization.show}
            />,
        ]}
    </Admin>
);

export default App;
