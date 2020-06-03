import React from 'react';
import { Show, SimpleShowLayout, TextField, DateField } from 'react-admin';
import { PropTypes } from 'prop-types';

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
                <TextField source="title" label="Filtre par titre" />
                <TextField source="employmentType" label="Type de contrat" />
                <TextField source="skills" label="compétences demandées" />
                <DateField source="jobStartDate" label="Commence avant" />
                <DateField source="validThrough" label="Valide jusqu'au" />
                <TextField
                    source="hiringOrganizationName"
                    label="Nom d'entreprise"
                />
                <TextField
                    source="hiringOrganizationAddressLocality"
                    label="Ville de l'entreprise"
                />

                <TextField
                    source="hiringOrganizationPostalCode"
                    label="Code postal de l'entreprise"
                />
            </SimpleShowLayout>
        </Show>
    );
};
