import BASE_URL from "../HTTPService"


export const getAllOrderByShiftIdCompleted = (shiftId) => {
    const response = BASE_URL.get(`/orders/shift/${shiftId}/complete`);
    return response;
}

export const getOrderByOrderId = (orderId) => {
    const response = BASE_URL.get(`/orders/${orderId}`);
    return response;
}

export const getAllOrderDetailByOrderId = (orderId) => {
    const response = BASE_URL.get(`/order-details/${orderId}`);
    return response;
}