import api from "./api";

const BASEURL = '/parks';

export const fetchAllParksApi = async () => {
    const response = await api.get(BASEURL);
    return response.data;
};

export const fetchAllParksByUserIdApi = async (userId) => {
    const url = BASEURL + `/with-user-info/${userId}`;
    const response = await api.get(url);
    return response.data;
};

export const fetchSimilarParksApi = async (targetParkId, limit = 5) => {
    const url = BASEURL + `/${targetParkId}/similar?limit=${limit}`;
    const response = await api.get(url);
    return response.data;
};