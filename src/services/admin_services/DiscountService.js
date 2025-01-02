import BASE_URL from "../HTTPService"


export const getAllDiscount = () => {
    const response = BASE_URL.get("/discounts");
    return response;
}

export const createDiscount = (discount) => {
    const response = BASE_URL.post("/discounts", discount);
    return response;
}

export const updateDiscount = (discount) => {
    const response = BASE_URL.put(`/discounts`, discount);
    return response;
}
