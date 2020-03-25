import axios from 'axios';

export const getList = async () => {
    const { data } = await axios.get('http://127.0.0.1:8001/api/job-postings');
    return data;
};
