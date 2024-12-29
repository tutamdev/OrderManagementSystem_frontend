import BASE_URL from "./HTTPService"

export const getAllCategories = () => {
    const response = BASE_URL.get("/categories");
    return response;
}

export const createCategory = (category) => {
    const response = BASE_URL.post("/categories", category);
    return response;
}

export const updateCategory = (category) => {
    const response = BASE_URL.put(`/categories/${category.categoryId}`, category);
    return response;
}


export const deleteArea = (categoryId) => {
    const response = BASE_URL.delete(`/categories/${category.categoryId}`);
    return response;
}