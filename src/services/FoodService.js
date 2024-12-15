import BASE_URL from "./HTTPService"

export const getAllFoodsByCategoryId = (categoryId) => {
    const response = BASE_URL.get(`/foods/${categoryId}`);
    return response;
}
