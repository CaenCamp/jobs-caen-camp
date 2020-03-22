import React from "react";
import { Admin, Resource, ListGuesser } from "react-admin";

import jobBoardDataProvider from "./jobBoardDataProvider";
import Organization from "./organization";

const dataProvider = jobBoardDataProvider("http://localhost:8001/api");
const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="organizations" {...Organization} />
        <Resource name="job-postings" list={ListGuesser} />
    </Admin>
);

export default App;
