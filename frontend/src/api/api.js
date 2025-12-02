import axios, { AxiosError } from "axios";
import camelcaseKeys from 'camelcase-keys';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 8000,
});

api.interceptors.response.use((response) => {
    if (response?.data && response?.headers['content-type'] === 'application/json') {
        response.data = camelcaseKeys(response.data, { deep: true, exclude: [/_$/, /-/]});
    }
    return response;
    }, async (error) => {

        switch (error.response.status) {
            case 401:
                console.error(error, "Unauthorized. Logging out.");
                break;
            default:
                throw new AxiosError(error.response, error.status);
        }

        if (!error.response) {
            // 503?
            throw new AxiosError(error.response, error.status);
        }
    }
);

export default api;