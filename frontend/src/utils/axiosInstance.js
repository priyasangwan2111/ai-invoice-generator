import axios from "axios";
import {BASE_URL} from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accesstoken = localStorage.getItem("token");
        if (accesstoken) {
            config.headers.Authorization = `Bearer ${accesstoken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error)=>{
        if(error.response){
            if(error.response,status===500){
                console.error("server error.please try again later")
            }

        }
        else if(error.code==='ECONNABORTED'){
            console.error("request timeout. please try again later")
        }
        return Promise.reject(error);
    
    }
);
export default axiosInstance;