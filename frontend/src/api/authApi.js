import api from "./api";

const BASEURL = '/users';

export const createNewUserApi = async (user) => {
    const response = await api.post(`${BASEURL}/create`, user);
    return response.data;
};