import React from 'react';

const OrderSummary = ({ data }) => {
    // Tính toán tổng số lượng đơn và tổng doanh thu
    let totalOrders = 0;
    let totalRevenue = 0;
    let totalFood = 0;

    // Duyệt qua dữ liệu và tính toán
    data.forEach(shift => {
        shift.orders.forEach(order => {
            totalOrders += 1;
            totalRevenue += (order.totalPrice - order.discountValue);
        });
    });

    return (
        <div className="flex space-x-4">
            <div className="p-4 border rounded shadow-md">
                <h3 className="text-xl font-semibold">Tổng số lượng đơn</h3>
                <p className="text-2xl">{totalOrders}</p>
            </div>
            <div className="p-4 border rounded shadow-md">
                <h3 className="text-xl font-semibold">Tổng doanh thu</h3>
                <p className="text-2xl">{totalRevenue.toLocaleString()} VND</p>
            </div>
        </div>
    );
};

export default OrderSummary;
