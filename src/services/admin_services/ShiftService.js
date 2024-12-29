import BASE_URL from "../HTTPService"


export const getAllShift = () => {
    const response = BASE_URL.get("/shifts");
    return response;
}

export const getActiveShift = () => {
    const response = BASE_URL.get("/shifts/active");
    return response;
}


export const createShift = (shift) => {
    const response = BASE_URL.post("/shifts", shift);
    return response;
}

export const closeShift = (shiftId) => {
    const response = BASE_URL.put(`/shifts/${shiftId}`);
    return response;
}
