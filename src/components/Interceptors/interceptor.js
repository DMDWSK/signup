import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";


const token = localStorage.getItem("token");

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