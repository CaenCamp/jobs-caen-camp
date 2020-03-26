import { writable } from 'svelte/store';
import { jobPostingsService } from '../services';

export const jobPostings = writable([]);

jobPostings.fetch = async () =>
    jobPostings.set(await jobPostingsService.fetchList());

export const jobPosting = writable(null);

jobPosting.fetch = async id =>
    jobPosting.set(await jobPostingsService.fetchOne(id));
