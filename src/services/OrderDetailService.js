import BASE_URL from "./HTTPService"

export const getOrderDetailsByOrderId = (orderId) => {
    const response = BASE_URL.get(`/order-details/${orderId}`);
    return response;
}

export const createOrderDetail = (orderId, orderDetail) => {
    const response = BASE_URL.post(`/order-details/${orderId}`, orderDetail);
    return response;
}

export const updateOrderDetail = (orderId, orderDetail) => {
    const response = BASE_URL.put(`/order-details/${orderId}`, orderDetail);
    return response;
}