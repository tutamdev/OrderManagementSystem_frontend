import { Layout } from "antd";
const { Content} = Layout;
import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav/Nav";
import Side from "../../components/Side/Side";
import '../../assets/Shift/ShiftMonitor.css';
import {ArrowRightOutlined} from '@ant-design/icons';
import { getAllOrders } from "../../services/OrderService";
import { getOrderDetailsByOrderId } from "../../services/OrderDetailService";

const ShiftMonitorDetail = () => {
    const[revenue, setRevenue] = useState(0);
    const[orders, setOrders] = useState([]);
    const[quantityFood, setQuantityFood] = useState(0);

    useEffect(() => {
        fetchTotalPrice();
        fetchQuantity();
    }, []);

    const fetchTotalPrice = async ()=>{
        try {
            const response = await getAllOrders(); // Giả sử getAllOrders là một hàm async
            setOrders(response.data.result);

            // Tính tổng doanh thu ngay sau khi nhận được dữ liệu
            const total = response.data.result.reduce((acc, order) => acc + order.totalPrice, 0);
            setRevenue(total);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const fetchQuantity = async ()=>{
        try {
            // Tạo một mảng các Promise từ các yêu cầu bất đồng bộ
            const promises = orders.map(async (order) => {
                const response = await getOrderDetailsByOrderId(order.orderId); // Giả sử order có thuộc tính id   
                const totalQuantity = response.data.result.reduce((acc, food) => acc + food.quantity, 0);
                return totalQuantity; // Hoặc xử lý dữ liệu theo cách bạn muốn
            });
    
            // Chờ tất cả các Promise hoàn thành
            const results = await Promise.all(promises);
            // Tính tổng số món ăn từ tất cả các kết quả
            const totalItems = results.reduce((acc, quantity) => acc + quantity, 0);
            setQuantityFood(totalItems);
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    }

    return (
        <Layout>
            <Nav /> {/* Thanh điều hướng trên cùng */}
            <Layout>
                <Side/> {/* Sidebar */}
                <Layout style={{ padding: '0 24px 24px', marginTop:'100px'}}>
                    <Content>
                        <div>
                            <div>Chi tiết hóa đơn đã bán của ca</div>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default ShiftMonitorDetail;
