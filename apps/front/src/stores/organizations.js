import { readable } from 'svelte/store';
import { getList, getOne } from '../services/organizations';

export const organizations = readable([], set => {
    getList().then(organizations => set(organizations));
});

export const fetchOrganization = (id) => readable(null, set => {
    getOne(id).then(organization => set(organization));
});
