import { readable } from 'svelte/store';
import { getList } from '../services/organizations';

export const organizations = readable([], set => {
    getList().then(organizations => set(organizations));
});
