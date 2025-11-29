import api from "./api";

export const fetchAllParksApi = async () => {
    const response = await api.get("/parks");
    return response.data;
}