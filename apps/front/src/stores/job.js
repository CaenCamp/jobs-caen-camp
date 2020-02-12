import { readable } from 'svelte/store';
import { fetchJobs } from '../services';

export const jobs = readable([], set => {
    fetchJobs().then(jobs => set(jobs));
});
