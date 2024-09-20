import baseRequest from "./baseRequest";

const handleError = (error: any) => {
    throw error?.response || error;
};

export const listUsers = async (params?: any) => {
    try {
        const response = await baseRequest.get("/api/users/list", { params });
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const createUser = async (body: any) => {
    try {
        const response = await baseRequest.post("/api/users/create", body);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const updateUser = async (id:any, body: any) => {
    try {
        const formattedData = {
            ...body,
            dob: body.dob ? new Date(body.dob).toISOString().split('T')[0] : null,
        };
        const response = await baseRequest.put(`/api/users/${id}/update`, formattedData);
        console.log("done");
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};


export const getUserDetails = async (id: any) => {
    try {
        const response = await baseRequest.get(`/api/users/${id}`);
        return response.data;
    } catch (error: any) {
    throw error?.response || error;
    }
};

export const deleteUser = async (id: any) => {
    try {
        const response = await baseRequest.delete(`/api/users/${id}`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};
