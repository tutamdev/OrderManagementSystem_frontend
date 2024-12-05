import React, { useEffect, useState } from 'react';
import RevenueByShift from './Charts/RevenueByShift';
import { getAllShift } from '../../services/admin_services/ShiftService';
import { getAllOrderByShiftIdCompleted, getOrderByOrderId } from '../../services/admin_services/OrderService';
import OrderSummary from './Charts/OrderSummary';
import RevenueHorizontalBarChart from './Charts/RevenueHorizontalBarChart';


// Cảm ơn ChatGPT đã giúp đỡ :D
const getOrderDetails = async (orderId) => {
    try {
        // Kiểm tra nếu order đã có thông tin chi tiết (để tránh gọi lại API)
        if (orderDetailsCache[orderId]) {
            return orderDetailsCache[orderId]; // Trả về thông tin từ cache
        }

        // Nếu không có thông tin trong cache, gọi API
        const response = await getOrderByOrderId(orderId);
        if (response.data.code === 200) {
            // Lưu dữ liệu vào cache
            orderDetailsCache[orderId] = response.data.result;
            return response.data.result;
        }
    } catch (error) {
        console.log("Error fetching order details:", error);
    }
    return [];
};

// Cache để tránh gọi lại API nhiều lần
const orderDetailsCache = {};

export const Dashboard = () => {
    const [shifts, setShifts] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        // Lấy dữ liệu về các ca làm việc
        fetchAllShift();
    }, []);

    useEffect(() => {
        if (shifts.length > 0) {
            // Lấy đơn hàng cho tất cả các ca làm việc khi shifts đã được tải
            fetchOrdersForAllShifts();
        }
    }, [shifts]);

    const fetchAllShift = async () => {
        try {
            const shiftsResponse = await getAllShift();
            if (shiftsResponse.data.code === 200) {
                const sortedShifts = shiftsResponse.data.result.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // Sắp xếp từ ca mới nhất
                const latestShifts = sortedShifts.slice(0, 15); // Chỉ lấy 15 ca gần nhất
                setShifts(latestShifts); // Cập nhật shifts
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getOrdersByShift = async (shiftId) => {
        try {
            const response = await getAllOrderByShiftIdCompleted(shiftId);
            if (response.data.code === 200) {
                return response.data.result;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchOrdersForAllShifts = async () => {
        const ordersForShifts = [];

        // Lấy tất cả orders cho từng ca làm việc
        for (const shift of shifts) {
            const orders = await getOrdersByShift(shift.shiftId);

            // Sử dụng Promise.all để gọi API lấy chi tiết món ăn cho từng order
            const ordersWithDetails = await Promise.all(
                orders.map(async (order) => {
                    const orderDetails = await getOrderDetails(order.orderId);
                    return {
                        ...order,
                        details: orderDetails
                    };
                })
            );

            ordersForShifts.push({ shiftId: shift.shiftId, orders: ordersWithDetails });
        }

        console.log(ordersForShifts);
        setData(ordersForShifts); // Cập nhật data sau khi lấy xong
    };

    return (
        <div className="container mx-auto p-4">
            {/* <h1 className="text-2xl font-bold mb-6">Dashboard</h1> */}
            <div className="p-4 mb-4 flex justify-center bg-white rounded-lg">
                <OrderSummary data={data} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white shadow-lg rounded-lg">
                    <RevenueByShift data={data} />

                </div>
                <div className="p-4 bg-white shadow-lg rounded-lg">
                    <RevenueHorizontalBarChart data={data} />

                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            </div>
        </div>
    );
};
