import React from "react";
import { Edit, TextInput, TabbedForm, FormTab } from "react-admin";

const OrganizationTitle = ({ record }) =>
    record ? `Entreprise ${record.name}` : null;

export const OrganizationEdit = props => {
    const handleStringify = React.useCallback(
        v => JSON.stringify(v, null, 2),
        []
    );
    const handleParse = React.useCallback(v => JSON.parse(v), []);

    return (
        <Edit title={<OrganizationTitle />} {...props}>
            <TabbedForm>
                <FormTab label="L'entreprise">
                    <TextInput source="name" label="Nom" fullWidth />
                    <TextInput
                        source="description"
                        multiline
                        label="Description"
                        fullWidth
                    />
                    <TextInput source="image" label="Logo" fullWidth />
                    <TextInput source="url" label="Site web" fullWidth />
                    <TextInput
                        source="email"
                        label="Email principal"
                        fullWidth
                    />
                </FormTab>
                <FormTab label="Adresse">
                    <TextInput
                        source="address.streetAddress"
                        label="Rue"
                        fullWidth
                    />
                    <TextInput
                        source="address.postalCode"
                        label="Code Postal"
                        fullWidth
                    />
                    <TextInput
                        source="address.addressLocality"
                        label="Ville"
                        fullWidth
                    />
                </FormTab>
                <FormTab label="Contacts">
                    <TextInput
                        source="contactPoints"
                        label="Contacts"
                        fullWidth
                        multiline
                        format={handleStringify}
                        parse={handleParse}
                    />
                </FormTab>
            </TabbedForm>
        </Edit>
    );
};
