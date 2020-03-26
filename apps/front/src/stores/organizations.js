import { writable } from 'svelte/store';
import { organizationsService } from '../services';

export const organizations = writable([]);

organizations.fetch = async () =>
    organizations.set(await organizationsService.fetchList());

export const organization = writable(null);

organization.fetch = async id =>
    organization.set(await organizationsService.fetchOne(id));
