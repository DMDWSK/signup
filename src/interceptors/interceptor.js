import axios from "axios";
import {API_BASE_URL} from "../constants/apiContants";
import {removeToken} from "../token/tokenOperations";


export const authAxios = axios.create({
    baseURL: API_BASE_URL,
})


authAxios.interceptors.request.use(req => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
    }
    return req
});

authAxios.interceptors.response.use(response => response,
    async error => {
    console.log("ERROR",error)
        const token = localStorage.getItem("token");
        if (!token || error.status !== 401) {
            removeToken();
            window.location.href='/login';
        }
});