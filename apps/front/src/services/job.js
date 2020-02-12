import axios from 'axios';

export const fetchJobs = async () => {
    const { data } = await axios.get('http://127.0.0.1:8002/jobs');
    return data;
};
