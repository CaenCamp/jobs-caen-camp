import React from 'react';
import { Show, SimpleShowLayout, TextField, DateField } from 'react-admin';

export const JobPostingShow = (props) => {
    return (
        <Show title="Vue de l'offre d'emploi" {...props}>
            <SimpleShowLayout>
                <TextField source="title:%l%" label="Filtre par titre" />
                <TextField source="employmentType" label="Type de contrat" />
                <TextField
                    source="hiringOrganizationName:%l%"
                    label="Nom d'entreprise"
                />
                <TextField
                    source="hiringOrganizationAddressLocality:l%"
                    label="Ville de l'entreprise"
                />
                <TextField
                    source="hiringOrganizationPostalCode:l%"
                    label="Code postal de l'entreprise"
                />

                <DateField source="datePosted:lte" label="Postée avant le" />
                <TextField source="datePosted:gte" label="Postée après le" />
                <TextField source="jobStartDate:lte" label="Commence avant" />
                <TextField source="jobStartDate:gte" label="Commence après" />
                <TextField
                    source="validThrough_before"
                    label="Valide jusqu'au"
                />
                <TextField source="validThrough:gte" label="Valide après le" />
            </SimpleShowLayout>
        </Show>
    );
};
