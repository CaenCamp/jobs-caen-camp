import React from 'react';
import { Show, SimpleShowLayout, TextField, DateField } from 'react-admin';

export const JobPostingShow = (props) => {
    return (
        <Show title="Vue de l'offre d'emploi" {...props}>
            <SimpleShowLayout>
                <TextField source="title" label="Filtre par titre" />
                <TextField source="employmentType" label="Type de contrat" />
                <TextField
                    source="hiringOrganizationName"
                    label="Nom d'entreprise"
                />
                <TextField
                    source="hiringOrganizationAddressLocality"
                    label="Ville de l'entreprise"
                />
                <DateField
                    source="hiringOrganizationPostalCode"
                    label="Code postal de l'entreprise"
                />

                <DateField source="jobStartDate" label="Commence avant" />
                <DateField source="validThrough" label="Valide jusqu'au" />
            </SimpleShowLayout>
        </Show>
    );
};
