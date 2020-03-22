import React from "react";
import {
    Edit,
    TextInput,
    SimpleForm,
    SelectInput,
    DateInput,
    ReferenceInput
} from "react-admin";

import { jobTypes } from "./index";

const JobPostingTitle = ({ record }) =>
    record ? `Edition de l'offre "${record.title}"` : null;

export const JobPostingEdit = props => {
    return (
        <Edit title={<JobPostingTitle />} {...props}>
            <SimpleForm>
                <TextInput source="title" label="titre" fullWidth />
                <TextInput
                    source="employerOverview"
                    multiline
                    label="Description"
                    fullWidth
                />
                <TextInput
                    source="experienceRequirements"
                    multiline
                    label="Experience requise"
                    fullWidth
                />
                <TextInput
                    source="skills"
                    label="Compétences demandées"
                    fullWidth
                />
                <TextInput source="url" label="Lien vers l'annonce" fullWidth />
                <SelectInput
                    source="employmentType"
                    label="Type de contrat"
                    fullWidth
                    choices={jobTypes}
                />
                <DateInput
                    source="jobStartDate"
                    label="Date de prise de poste"
                    fullWidth
                />
                <DateInput
                    source="validThrough"
                    label="Valide jusqu'au"
                    fullWidth
                />
                <ReferenceInput
                    label="Entreprise"
                    source="hiringOrganization.identifier"
                    reference="organizations"
                >
                    <SelectInput optionText="name" />
                </ReferenceInput>
            </SimpleForm>
        </Edit>
    );
};
