import React from 'react';
import { Show, SimpleShowLayout, TextField } from 'react-admin';
import { PropTypes } from 'prop-types';

// Todo :
const OrganizationName = ({ record }) => {
    return <span>{record ? `${record.name}` : ''}</span>;
};
OrganizationName.propTypes = {
    record: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }),
};

const DisplayAddress = ({ record }) => {
    return record && record.address ? (
        <p>
            {record.address.streetAddress} <br />
            {record.address.postalCode} {record.address.addressLocality}{' '}
            {record.address.addressCountry}
        </p>
    ) : (
        `Pas d'addresse pour "${record.name}"`
    );
};
DisplayAddress.propTypes = {
    record: PropTypes.shape({
        name: PropTypes.string.isRequired,
        address: PropTypes.shape({
            addressCountry: PropTypes.string,
            addressLocality: PropTypes.string,
            postalCode: PropTypes.string,
            streetAddress: PropTypes.string,
        }),
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
                <TextField label="Nom de l'entreprise" source="name" />
                <TextField label="Email principal" source="email" />
                <TextField label="Url du site web" source="url" />
                <TextField label="Présentation" source="description" />
                {<DisplayAddress />}

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
OrganizationShow.propTypes = {
    address: PropTypes.object,
};
