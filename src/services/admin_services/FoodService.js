import BASE_URL from "../HTTPService"


export const getAllFoodByCategoryId = (categoryId) => {
    const response = BASE_URL.get(`/foods/${categoryId}`);
    return response;
}

export const createFood = (food) => {
    const response = BASE_URL.post("/foods", food);
    return response;
}

export const updateFood = (foodId, food) => {
    const response = BASE_URL.put(`/foods/${foodId}`, food);
    return response;
}

export const deleteFood = (foodId) => {
    const response = BASE_URL.delete(`/foods/${foodId}`);
    return response;
}