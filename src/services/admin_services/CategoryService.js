import BASE_URL from "../HTTPService"

export const getAllCategory = () => {
    const response = BASE_URL.get("/categories");
    return response;
}

export const createCategory = (categoryName) => {
    const response = BASE_URL.post("/categories", categoryName);
    return response;
}

export const updateCategory = (categoryUpdate) => {
    const response = BASE_URL.put(`/categories/${categoryUpdate.categoryId}`, categoryUpdate.name);
    return response;
}

export const deleteCategory = (categoryId) => {
    const response = BASE_URL.delete(`/categories/${categoryId}`);
    return response;
}