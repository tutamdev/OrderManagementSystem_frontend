import BASE_URL from "./HTTPService"

export const getDiscountByDiscountCode = (discountCode) => {
    const response = BASE_URL.get(`/discounts/${discountCode}`);
    return response;
}

export const getAllDiscounts = () => {
    const response = BASE_URL.get("/discounts");
    return response;
}