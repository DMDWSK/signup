import {authAxios} from "../interceptors/interceptor";

const upload = (files, url, onUploadProgress) => {
    let formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
    }

    return authAxios.post(url, formData, {
        onUploadProgress,
    })
}

export default {
    upload,
};
;