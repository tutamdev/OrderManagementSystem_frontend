import BASE_URL from "./HTTPService"

export const createOrder = (order) => {
    const response = BASE_URL.post("/orders", order);
    return response;
}


export const getAllOrders = () => {
    const response = BASE_URL.get("/orders");
    return response;
}

export const getAllOrderByShiftIdCompleted = (shiftId) => {
    const response = BASE_URL.get(`/orders/shift/${shiftId}/complete`);
    return response;
}

export const completeOrder = (orderId) => {
    const response = BASE_URL.post(`/orders/${orderId}/complete`);
    return response;
}

export const updateOrder = (orderId, order) => {
    const response = BASE_URL.put(`/orders/${orderId}`, order);
    return response;
}

export const getOrderNotCompleteByTableId = (tableId) => {
    const response = BASE_URL.get(`/tables/${tableId}/order`);
    return response;
}

export const deleteOrder = (orderId) => {
    const response = BASE_URL.delete(`/orders/${orderId}`);
    return response;
}