import React from 'react';
import { Show, SimpleShowLayout, TextField, UrlField } from 'react-admin';
import { PropTypes } from 'prop-types';
import DisplayAddress from '../toolbox/DispayAddress';

// Todo :
const OrganizationName = ({ record }) => {
    return <span>{record ? `${record.name}` : ''}</span>;
};
OrganizationName.propTypes = {
    record: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }),
};

const OrganizationLogo = ({ record }) => {
    return record && record.image ? (
        <img src={record.image} height="50" alt={record.name} />
    ) : (
        `Pas d'image pour "${record.name}"`
    );
};
OrganizationLogo.propTypes = {
    record: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
    }),
};

export const OrganizationShow = (props) => {
    return (
        // to add :
        <Show title={<OrganizationName />} {...props}>
            <SimpleShowLayout>
                <OrganizationLogo label="logo" />
                <TextField addlabel="false" source="name" />
                <TextField label="Email principal" source="email" />
                <UrlField label="Url du site web" source="url" />
                <TextField label="Présentation" source="description" />

                <DisplayAddress
                    label="adresse"
                    streetAddress="address.streetAddress"
                    postalCode="address.postalCode"
                    addressLocality="address.addressLocality"
                    addressCountry="address.addressCountry"
                />
            </SimpleShowLayout>
        </Show>
    );
};
OrganizationShow.propTypes = {
    address: PropTypes.object,
};
