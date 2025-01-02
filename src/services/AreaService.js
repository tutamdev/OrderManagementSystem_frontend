import BASE_URL from "./HTTPService"

export const getAllArea = () => {
    const response = BASE_URL.get("/areas");
    return response;
}

export const createArea = (area) => {
    const response = BASE_URL.post("/areas", area);
    return response;
}
