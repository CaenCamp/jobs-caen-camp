import React from 'react';
import { Show, SimpleShowLayout, TextField } from 'react-admin';

// Todo :
// const OrganizationName = ({ record }) => {
//     return <span>{record ? `"${record.name}"` : ''}</span>;
// };

export const OrganizationShow = (props) => {
    return (
        // to add :
        // <Show title={<OrganizationName />} {...props}></Show>
        <Show title="vue de l'entreprise" {...props}>
            <SimpleShowLayout>
                {/* todo: LOGO */}
                <TextField label="Nom de l'entreprise" source="name" />
                <TextField label="Email principal" source="email" />
                <TextField label="Url du site web" source="url" />
                <TextField label="Présentation" source="description" />
                <TextField label="adresse" source="address" />

                <TextField
                    label="Nom du contact des offres d'emploi"
                    source="contact_name"
                />
                <TextField
                    label="Email du contact des offres d'emploi"
                    source="contact_email"
                />
                <TextField
                    label="Téléphone du contact des offres d'emploi"
                    source="contact_phone"
                />
            </SimpleShowLayout>
        </Show>
    );
};
