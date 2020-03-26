import axios from 'axios';

const fetchList = async () => {
    const { data } = await axios.get('http://127.0.0.1:8001/api/job-postings');
    return data;
};
const fetchOne = async id => {
    const { data } = await axios.get(
        `http://127.0.0.1:8001/api/job-postings/${id}`
    );
    return data;
};
export default {
    fetchList,
    fetchOne,
};
