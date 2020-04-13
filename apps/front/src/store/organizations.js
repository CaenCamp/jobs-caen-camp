import { writable } from "svelte/store";
import axios from "axios";

const store = () => {
    const { subscribe, set, update } = writable([]);

    const init = async () => {
        const { data } = await axios.get(
            "http://127.0.0.1:8001/api/organizations"
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

export const OrganizationsStore = store();
