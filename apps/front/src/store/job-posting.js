import { writable } from 'svelte/store';
import axios from 'axios';

const store = () => {
    const { subscribe, set, update } = writable(null);

    const init = async id => {
        const { data } = await axios.get(
            `http://127.0.0.1:8001/api/job-postings/${id}`
        );
        set(data);
    };

    return {
        subscribe,
        set,
        update,
        init,
    };
};

export const JobPostingStore = store();
