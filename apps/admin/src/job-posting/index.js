import JobPostingIcon from '@material-ui/icons/EventSeat';
import { JobPostingShow } from './Show';
import { JobPostingList } from './List';
import { JobPostingEdit } from './Edit';
import { JobPostingCreate } from './Create';

export const jobTypes = [
    { id: 'CDI', name: 'CDI' },
    { id: 'CDD', name: 'CDD' },
    { id: 'Alternance', name: 'Alternace' },
    { id: 'Autre', name: 'Autres' },
];

export default {
    create: JobPostingCreate,
    edit: JobPostingEdit,
    icon: JobPostingIcon,
    list: JobPostingList,
    show: JobPostingShow,
    options: { label: "Offres d'emploi" },
};
