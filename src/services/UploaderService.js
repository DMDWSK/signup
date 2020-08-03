import axios from 'axios'
import {API_BASE_URL} from "../constants/apiContants";
import {authAxios} from "../components/Interceptors/interceptor";

const upload = (files, onUploadProgress) => {
    let formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
    }

    return authAxios.post( "/upload", formData, {
        onUploadProgress,
    })
}
export default {
    upload,
};
;