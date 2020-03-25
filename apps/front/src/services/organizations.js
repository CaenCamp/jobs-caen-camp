import axios from 'axios';

export const getList = async () => {
    const { data } = await axios.get('http://127.0.0.1:8001/api/organizations');
    return data;
};
export const getOne = async id => {
    const { data } = await axios.get(
        `http://127.0.0.1:8001/api/organizations/${id}`
    );
    return data;
};
