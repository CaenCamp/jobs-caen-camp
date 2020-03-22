import React from "react";
import { Create, SimpleForm, TextInput, required } from "react-admin";

export const OrganizationCreate = props => (
    <Create {...props} title="Création d'une entreprise">
        <SimpleForm>
            <TextInput
                fullWidth
                label="Nom de l'entreprise"
                source="name"
                validate={required()}
            />
            <TextInput
                fullWidth
                label="Url du logo"
                source="image"
                validate={required()}
            />
            <TextInput
                fullWidth
                label="Url du site web"
                source="url"
                validate={required()}
            />
            <TextInput
                fullWidth
                label="Email principal"
                source="email"
                validate={required()}
            />
            <TextInput fullWidth label="Téléphone" source="telephone" />
            <TextInput
                fullWidth
                multiline
                label="Présentation"
                source="description"
                validate={required()}
            />
            <TextInput
                source="address.streetAddress"
                label="Rue"
                fullWidth
                validate={required()}
            />
            <TextInput
                source="address.postalCode"
                label="Code Postal"
                fullWidth
                validate={required()}
            />
            <TextInput
                source="address.addressLocality"
                label="Ville"
                fullWidth
                validate={required()}
            />
            <TextInput
                fullWidth
                label="Nom du contact des offres d'emploi"
                source="contact_name"
                validate={required()}
            />
            <TextInput
                fullWidth
                label="Email du contact des offres d'emploi"
                source="contact_email"
            />
            <TextInput
                fullWidth
                label="Téléphone du contact des offres d'emploi"
                source="contact_phone"
            />
        </SimpleForm>
    </Create>
);
