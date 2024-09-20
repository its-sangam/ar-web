import baseRequest from "./baseRequest";

const handleError = (error: any) => {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
};

export const listMusic = async (params?: any) => {
    try {
        const response = await baseRequest.get("/api/music/list", { params });
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const createMusic = async (body: any) => {
    try {
        const response = await baseRequest.post("/api/music/create", body);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const updateMusic = async (id: any, body: any) => {
    try {
        const response = await baseRequest.put(`/api/music/${id}/update`, body);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const getMusicDetails = async (id: any) => {
    try {
        const response = await baseRequest.get(`/api/music/${id}`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const deleteMusic = async (id: any) => {
    try {
        const response = await baseRequest.delete(`/api/music/${id}`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};
