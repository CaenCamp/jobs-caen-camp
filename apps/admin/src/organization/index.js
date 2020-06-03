import OrganizationIcon from '@material-ui/icons/People';

import { OrganizationList } from './List';
import { OrganizationEdit } from './Edit';
import { OrganizationCreate } from './Create';
import { OrganizationShow } from './Show';

export default {
    create: OrganizationCreate,
    edit: OrganizationEdit,
    icon: OrganizationIcon,
    list: OrganizationList,
    show: OrganizationShow,
    options: { label: 'Entreprises' },
};
