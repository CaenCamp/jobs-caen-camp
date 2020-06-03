import React from 'react';
import { PropTypes } from 'prop-types';
import {
    List,
    Datagrid,
    TextField,
    EditButton,
    Filter,
    TextInput,
    Pagination,
} from 'react-admin';

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

const OrganizationAddress = ({ record: { address } }) => {
    return address
        ? `${address.streetAddress} ${address.postalCode} ${address.addressLocality}`
        : "L'adresse n'est pas renseignée.";
};

const OrganizationFilter = (props) => (
    <Filter {...props}>
        <TextInput source="name:%l%" label="Filtre par nom" alwaysOn />
        <TextInput
            source="addressLocality:l%"
            label="Filtre par ville"
            alwaysOn
        />
        <TextInput
            source="postalCode:l%"
            label="Filtre par code postal"
            alwaysOn
        />
    </Filter>
);

const OrganizationPagination = (props) => (
    <Pagination rowsPerPageOptions={[1, 10, 25, 50]} {...props} />
);

export const OrganizationList = ({ permissions, ...props }) => {
    return (
        <List
            {...props}
            filters={<OrganizationFilter />}
            sort={{ field: 'name', order: 'ASC' }}
            exporter={false}
            pagination={<OrganizationPagination />}
            bulkActionButtons={false}
            title="Liste des Entreprises"
        >
            <Datagrid rowClik="show">
                <OrganizationLogo label="Logo" />
                <TextField source="name" label="Nom de l'entreprise" />
                <OrganizationAddress label="Adresse" />
                {permissions === 'authenticated' && <EditButton />}
            </Datagrid>
        </List>
    );
};

OrganizationList.propTypes = {
    permissions: PropTypes.string.isRequired,
};
