import baseRequest from "./baseRequest";
import { setCookie, removeCookie } from "@/utils/cookieUtils";

export const registerUser = async (data: any) => {
    try {
        const response = await baseRequest.post("/api/auth/register", data);
        return response.data;
    } catch (error: any) {
        throw error?.response || error;
    }
};

export const loginUser = async (data: any) => {
    try {
        const response = await baseRequest.post("/api/auth/login", data);
        if (response.status === 200 && response.data.token) {
            setCookie("authToken", response.data.token, { path: "/", maxAge: 86400 });
        }
        return response;
    } catch (error: any) {
        throw error?.response || error;
    }
};

export const logoutUser = () => {
    removeCookie("authToken");
};

export const getProfile = async () => {
    return baseRequest.get("/api/auth/me");
};
