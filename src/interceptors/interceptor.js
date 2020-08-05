import axios from "axios";
import {API_BASE_URL} from "../constants/apiContants";


export const authAxios = axios.create({
    baseURL: API_BASE_URL,
})


authAxios.interceptors.request.use(req => {
    const token = localStorage.getItem("token");
    console.log("TOKEN",token)
    if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
        console.log(req.headers['Authorization'] )
    }
    return req
});