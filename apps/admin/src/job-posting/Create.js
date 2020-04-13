import React from 'react';
import {
    Create,
    TextInput,
    SimpleForm,
    SelectInput,
    DateInput,
    ReferenceInput,
    required,
} from 'react-admin';

import { jobTypes } from './index';

export const JobPostingCreate = (props) => {
    return (
        <Create title="Création d'une nouvelle offre d'emploi" {...props}>
            <SimpleForm>
                <TextInput
                    source="title"
                    label="titre"
                    fullWidth
                    validate={required()}
                />
                <TextInput
                    source="employerOverview"
                    multiline
                    label="Description"
                    fullWidth
                    validate={required()}
                />
                <TextInput
                    source="experienceRequirements"
                    multiline
                    label="Experience requise"
                    fullWidth
                    validate={required()}
                />
                <TextInput
                    source="skills"
                    label="Compétences demandées"
                    fullWidth
                    validate={required()}
                />
                <TextInput source="url" label="Lien vers l'annonce" fullWidth />
                <SelectInput
                    source="employmentType"
                    label="Type de contrat"
                    fullWidth
                    choices={jobTypes}
                    validate={required()}
                />
                <DateInput
                    source="jobStartDate"
                    label="Date de prise de poste"
                    fullWidth
                    validate={required()}
                />
                <DateInput
                    source="validThrough"
                    label="Valide jusqu'au"
                    fullWidth
                />
                <ReferenceInput
                    label="Entreprise"
                    source="hiringOrganizationId"
                    reference="organizations"
                    validate={required()}
                >
                    <SelectInput optionText="name" />
                </ReferenceInput>
            </SimpleForm>
        </Create>
    );
};
