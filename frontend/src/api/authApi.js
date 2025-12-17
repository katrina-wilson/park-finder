import api from "./api";

const BASEURL = '/users';

export const createNewUserApi = async (user) => {
    const response = await api.post(`${BASEURL}/create`, user);
    return response?.data;
};

export const loginUserApi = async (user) => {
    const params = new URLSearchParams();
    params.append('username', user.email);
    params.append('password', user.password);
    params.append('grant_type', 'password');

    const tokenResp = await api.post(`/auth/token`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenResp?.data?.accessToken;
    if (accessToken) {
        const currentUser = await fetchCurrentLoggedInUser(accessToken);
        return { ...currentUser, token: accessToken };
    } else {
        console.error("Failed to retrieve access token.");
    }
};

export const fetchCurrentLoggedInUser = async (token) => {
    const response = await api.get(`${BASEURL}/current`, {
          headers: { Authorization: `Bearer ${token}` }
        });
    return response?.data;
};