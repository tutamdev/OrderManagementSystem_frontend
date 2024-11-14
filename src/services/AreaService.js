import BASE_URL from "./HTTPService"

export const getAllArea = () => {
    const response = BASE_URL.get("/areas");
    return response;
}

export const createArea = (area) => {
    const response = BASE_URL.post("/areas", area);
    return response;
}

export const updateArea = (area) => {
    const response = BASE_URL.put(`/areas/${area.areaId}`, area);
    return response;
}


export const deleteArea = (areaId) => {
    const response = BASE_URL.delete(`/areas/${areaId}`);
    return response;
}