import React from 'react';
import { Admin, Resource } from 'react-admin';

import jobBoardDataProvider from './jobBoardDataProvider';
import Organization from './organization';
import JobPosting from './job-posting';

const dataProvider = jobBoardDataProvider('http://localhost:8001/api');

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="organizations" {...Organization} />
        <Resource name="job-postings" {...JobPosting} />
    </Admin>
);

export default App;
