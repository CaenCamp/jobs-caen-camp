import { writable } from 'svelte/store';
import { jobPostingsService } from '../services';

const jobPostingListStore = writable([]);
const jobPostingStore = writable(null);

const fetchOne = async id => {
    const organization = await jobPostingsService.fetchOne(id);
    jobPostingStore.set(organization);
};

const fetchList = async () => {
    const organizations = await jobPostingsService.fetchList();
    jobPostingListStore.set(organizations);
};

export default {
    fetchOne,
    fetchList,
    jobPostings: jobPostingListStore,
    jobPosting: jobPostingStore,
};
