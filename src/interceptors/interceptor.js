import axios from "axios";
import {API_BASE_URL} from "../constants/apiContants";


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
    console.log("ERROE",error.code)
        const token = localStorage.getItem("token");
        if (!token || error.response.status !== 401) {
            window.location.href='/login';
        }
});