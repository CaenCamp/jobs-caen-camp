import React from 'react';
import { PropTypes } from 'prop-types';
import {
    Datagrid,
    DateInput,
    EditButton,
    Filter,
    List,
    Pagination,
    ReferenceField,
    TextField,
    TextInput,
    SelectInput,
} from 'react-admin';

import { jobTypes } from './index';

const JobPostingFilter = (props) => (
    <Filter {...props}>
        <TextInput source="title:%l%" label="Filtre par titre" alwaysOn />
        <TextInput source="skills:%l%" label="Compétences" alwaysOn />
        <SelectInput
            source="employmentType"
            label="Type de contrat"
            choices={jobTypes}
            alwaysOn
        />
        <TextInput
            source="hiringOrganizationName:%l%"
            label="Nom d'entreprise"
            alwaysOn
        />
        <TextInput
            source="hiringOrganizationAddressLocality:l%"
            label="Ville de l'entreprise"
        />
        <TextInput
            source="hiringOrganizationPostalCode:l%"
            label="Code postal de l'entreprise"
        />
        <DateInput source="datePosted:lte" label="Postée avant le" />
        <DateInput source="datePosted:gte" label="Postée après le" />
        <DateInput source="jobStartDate:lte" label="Commence avant" alwaysOn />
        <DateInput source="jobStartDate:gte" label="Commence après" />
        <DateInput
            source="validThrough_before"
            label="Valide jusqu'au"
            alwaysOn
        />
        <DateInput source="validThrough:gte" label="Valide après le" />
    </Filter>
);

const JobPostingPagination = (props) => (
    <Pagination rowsPerPageOptions={[1, 10, 25, 50]} {...props} />
);

const Organization = ({ record }) => {
    return `${record.name} (${record.address.postalCode} ${record.address.addressLocality})`;
};

export const JobPostingList = ({ permissions, ...props }) => {
    return (
        <List
            {...props}
            filters={<JobPostingFilter />}
            sort={{ field: 'name', order: 'ASC' }}
            exporter={false}
            pagination={<JobPostingPagination />}
            bulkActionButtons={false}
            title="Liste des Offres d'Emploi"
        >
            <Datagrid rowClick="show">
                <TextField source="title" label="Titre de l'offre" />
                <TextField source="employmentType" label="Type de contrat" />
                <ReferenceField
                    sortable={false}
                    label="Entreprise"
                    source="hiringOrganization.identifier"
                    reference="organizations"
                >
                    <Organization source="name" />
                </ReferenceField>
                <TextField
                    source="skills"
                    label="Compétences demandées"
                    sortable={false}
                />
                <TextField source="datePosted" label="Date de création" />
                <TextField
                    source="jobStartDate"
                    label="Date de prise de poste"
                />
                <TextField source="validThrough" label="Valable jusqu'au" />
                {permissions === 'authenticated' && <EditButton />}
            </Datagrid>
        </List>
    );
};

JobPostingList.propTypes = {
    permissions: PropTypes.string.isRequired,
};
