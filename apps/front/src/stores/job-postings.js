import { readable } from 'svelte/store';
import { getList, getOne } from '../services/job-postings';

export const jobPostings = readable([], set => {
    getList().then(jobPostings => set(jobPostings));
});
export const fetchJobPosting = id =>
    readable(null, set => {
        getOne(id).then(jobPosting => set(jobPosting));
    });
