import axios from "axios";
import { getCookie, removeCookie } from "@/utils/cookieUtils";

const apiUrl = import.meta.env.VITE_API_URL;
const baseRequest = axios.create({
  baseURL: apiUrl,
});

baseRequest.interceptors.request.use(
  (config) => {
    const token = getCookie("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

baseRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeCookie("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default baseRequest;