import { readable } from 'svelte/store';
import { getList } from '../services/job-postings';

export const jobPostings = readable([], set => {
    getList().then(jobPostings => set(jobPostings));
});
