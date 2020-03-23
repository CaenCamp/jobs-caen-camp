import React from "react";
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
    SelectInput
} from "react-admin";

import { jobTypes } from "./index";

const JobPostingFilter = props => (
    <Filter {...props}>
        <TextInput source="title" label="Filtre par titre" alwaysOn />
        <TextInput source="skills" label="Compétences" alwaysOn />
        <SelectInput
            source="employmentType"
            label="Type de contrat"
            choices={jobTypes}
            alwaysOn
        />
        <TextInput
            source="hiringOrganizationName"
            label="Nom d'entreprise"
            alwaysOn
        />
        <TextInput
            source="hiringOrganizationAddressLocality"
            label="Ville de l'entreprise"
        />
        <TextInput
            source="hiringOrganizationPostalCode"
            label="Code postal de l'entreprise"
        />
        <DateInput source="datePosted_before" label="Postée avant le" />
        <DateInput source="datePosted_after" label="Postée après le" />
        <DateInput
            source="jobStartDate_before"
            label="Commence avant"
            alwaysOn
        />
        <DateInput source="jobStartDate_after" label="Commence après" />
        <DateInput
            source="validThrough_before"
            label="Valide jusqu'au"
            alwaysOn
        />
        <DateInput source="validThrough_after" label="Valide après le" />
    </Filter>
);

const JobPostingPagination = props => (
    <Pagination rowsPerPageOptions={[1, 10, 25, 50]} {...props} />
);

const Organization = ({ record }) => {
    return `${record.name} (${record.address.postalCode} ${record.address.addressLocality})`;
};

export const JobPostingList = props => {
    return (
        <List
            {...props}
            filters={<JobPostingFilter />}
            sort={{ field: "name", order: "ASC" }}
            exporter={false}
            pagination={<JobPostingPagination />}
            bulkActionButtons={false}
            title="Liste des Offres d'Emploi"
        >
            <Datagrid>
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
                <EditButton />
            </Datagrid>
        </List>
    );
};
