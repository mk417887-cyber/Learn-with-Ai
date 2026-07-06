import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with a status code outside the 2xx range
            if (error.response.status === 500) {
                console.error("Server error. Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            // Request took longer than the defined timeout
            console.error("Request timeout. Please try again.");
        } else {
            // Backend server is down or user is offline
            console.error("Network error. Could not connect to the server.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;