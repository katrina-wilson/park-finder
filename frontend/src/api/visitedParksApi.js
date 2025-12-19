import api from "./api";

const BASEURL = '/visited-parks';

export const updateVisitedPark = async (parkId, payload, token) => {
    const url = `${BASEURL}/${parkId}`;
    const response = await api.put(
        url, 
        payload,     
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};