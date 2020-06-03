import React from 'react';
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    UrlField,
} from 'react-admin';
import { PropTypes } from 'prop-types';
import DisplayAddress from '../toolbox/DispayAddress';

const JobPostingTitle = ({ record }) => {
    return <span>{record ? `${record.title}` : ''}</span>;
};
JobPostingTitle.propTypes = {
    record: PropTypes.shape({
        title: PropTypes.string.isRequired,
    }),
};

export const JobPostingShow = (props) => {
    return (
        <Show title={<JobPostingTitle />} {...props}>
            <SimpleShowLayout>
                <TextField source="title" label="titre" />
                <UrlField source="url" label="URL de l'offre" />
                <TextField source="employmentType" label="Type de contrat" />
                <TextField
                    source="hiringOrganization.name"
                    label="Proposé par"
                />
                <TextField
                    source="experienceRequirements"
                    label="Expérience requise"
                />
                <TextField source="skills" label="compétences demandées" />

                <DateField
                    source="jobStartDate"
                    label="Date de prise de poste"
                />
                <DateField source="validThrough" label="Valide jusqu'au" />
                <DisplayAddress
                    label="adresse"
                    streetAddress="hiringOrganization.address.streetAddress"
                    postalCode="hiringOrganization.address.postalCode"
                    addressLocality="hiringOrganization.address.addressLocality"
                    addressCountry="hiringOrganization.address.addressCountry"
                />
            </SimpleShowLayout>
        </Show>
    );
};
