import BASE_URL from "./HTTPService"

export const getTablesByAreaId = (areaId) => {
    const response = BASE_URL.get(`/tables/area/${areaId}`);
    return response;
}
export const getOrderNotCompleteByTableId = (tableId) => {
    const response = BASE_URL.get(`/tables/${tableId}/order`);
    return response;
}

export const createTableByAreaId = (areaId, table) => {
    const response = BASE_URL.post(`/tables/area/${areaId}`, table);
    return response;
}

export const deleteTable = (tableId) => {
    const response = BASE_URL.delete(`/tables/${tableId}`);
    return response;
}

export const updateArea = (table) => {
    const response = BASE_URL.put(`/tables/area/${areaId}`, table);
    return response;
}