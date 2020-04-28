import React from 'react';
import { fetchUtils, Admin, Resource } from 'react-admin';

import jobBoardDataProvider from './jobBoardDataProvider';
import { authProvider } from './authProvider';
import Organization from './organization';
import JobPosting from './job-posting';

global.inMemoryToken = null;

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = global.inMemoryToken;
    if (token) {
        options.headers.set('Authorization', `Bearer ${token.token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

const dataProvider = jobBoardDataProvider(
    'http://localhost:8001/api',
    httpClient
);

const App = () => (
    <Admin authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="organizations" {...Organization} />
        <Resource name="job-postings" {...JobPosting} />
    </Admin>
);

export default App;
