import axios from "axios";
import { getCookie, removeCookie } from "@/utils/cookieUtils";

const apiUrl = import.meta.env.VITE_API_URL;
export const baseRequest = axios.create({
  baseURL: apiUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

baseRequest.interceptors.request.use(
  (config) => {
    const token = getCookie("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

baseRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeCookie("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const formRequest = axios.create({
  baseURL: apiUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  },
});

formRequest.interceptors.request.use(
  (config) => {
    const token = getCookie("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default baseRequest;