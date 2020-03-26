import { writable } from 'svelte/store';
import { organizationsService } from '../services';

const organizationListStore = writable([]);
const organizationStore = writable(null);

const fetchOne = async id => {
    const organization = await organizationsService.fetchOne(id);
    organizationStore.set(organization);
};

const fetchList = async () => {
    const organizations = await organizationsService.fetchList();
    organizationListStore.set(organizations);
};

export default {
    fetchOne,
    fetchList,
    organizations: organizationListStore,
    organization: organizationStore,
};
