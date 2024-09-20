import baseRequest from "./baseRequest";

const handleError = (error: any) => {
    throw error?.response || error;
};

export const listArtists = async (params?: any) => {
    try {
        const response = await baseRequest.get("/api/artists/list", { params });
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const createArtist = async (body: any) => {
    try {
        const response = await baseRequest.post("/api/artists/create", body);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const updateArtist = async (id:any, body: any) => {
    try {
        const formattedData = {
            ...body,
            dob: body.dob ? new Date(body.dob).toISOString().split('T')[0] : null,
        };
        const response = await baseRequest.put(`/api/artists/${id}/update`, formattedData);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};


export const getArtistDetails = async (id: any) => {
    try {
        const response = await baseRequest.get(`/api/artists/${id}`);
        return response.data;
    } catch (error: any) {
    throw error?.response || error;
    }
};

export const deleteArtist = async (id: any) => {
    try {
        const response = await baseRequest.delete(`/api/artists/${id}`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};
