import { Layout, Table, Button, Card } from "antd";
const { Content} = Layout;
import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav/Nav";
import Side from "../../components/Side/Side";
import '../../assets/Shift/ShiftMonitor.css';
import {ArrowRightOutlined} from '@ant-design/icons';
import {getAllOrderByShiftIdCompleted } from "../../services/OrderService";
import { getOrderDetailsByOrderId } from "../../services/OrderDetailService";
import { useNavigate } from "react-router-dom";
import { getActiveShift, closeShift } from "../../services/ShiftService";

const ShiftMonitor= () => {
    const [showDetail, setShowDetail] = useState(false); // State để theo dõi nội dung hiển thị
    const[revenue, setRevenue] = useState(0);
    const[orders, setOrders] = useState([]);
    const[quantityFood, setQuantityFood] = useState(0);
    const[quantityOrderDetail, setQuantityOrderDetail] = useState(0);
    const[shiftId, setShiftId] = useState();

    // Invoice details data
    const [invoiceDetails, setInvoiceDetails] = useState([]);


    const columns = [
        { title: 'Mã hóa đơn', dataIndex: 'invoiceId', key: 'invoiceId' },
        { title: 'Số lượng món', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Thời gian thanh toán', dataIndex: 'paymentTime', key: 'paymentTime' },
        { title: 'Tổng tiền', dataIndex: 'total', key: 'total', render: total => `${total} VNĐ` },
    ];

    useEffect(() => {
        fetchTotalPrice();
    }, [shiftId]);

    useEffect(() => {
        fetchQuantity();
    }, [orders]);

    const fetchTotalPrice = async ()=>{
        try {
            setShiftId((await getActiveShift()).data.result.shiftId);
            const response = await getAllOrderByShiftIdCompleted(shiftId); // Giả sử getAllOrders là một hàm async
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
                const totalPrice = response.data.result.reduce((acc, food) => acc + food.foodPrice * food.quantity, 0); // Tính tổng tiền
                return {
                    invoiceId: order.orderId,
                    quantity: totalQuantity,
                    paymentTime: order.endedAt, // Thay đổi theo thời gian thực tế
                    total: totalPrice,
                };
            });

            // Chờ tất cả các Promise hoàn thành
            const results = await Promise.all(promises);
            setInvoiceDetails(results);
            // Tính tổng số món ăn từ tất cả các kết quả
            const totalItems = results.reduce((acc, invoice) => acc + invoice.quantity, 0);
            setQuantityFood(totalItems);
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    }

    const navigate = useNavigate();
    const handleClick = () => {
        setShowDetail(true);
    };

    const fetchShift = async() => {
        await closeShift(shiftId);
        navigate("/shifts");
    }
    

    return (
        <Layout>
            <Nav /> {/* Thanh điều hướng trên cùng */}
            <Layout>
                <Side /> {/* Sidebar */}
                <Layout >
                    <Content>
                        {showDetail ? (
                            <Card title="Chi tiết hóa đơn" bordered={false} style={{margin: '20px' }}>
                            <Table dataSource={invoiceDetails} columns={columns} rowKey="invoiceId" />
                            <Button type="primary" onClick={() => setShowDetail(false)} style={{ marginTop: '16px' }}>
                                Quay lại
                            </Button>
                        </Card>
                        ) : (
                            <div className="flex items-center justify-between" style={{ padding: '0 24px 24px', marginTop: '100px' }}>
                                <div className="revenue-container">
                                    <div className="revenue-title">Doanh thu</div>
                                    <div className="revenue-value">{revenue} VNĐ</div>
                                </div>
                                <div className="revenue-container">
                                    <div className="revenue-title">Số lượng món đã bán</div>
                                    <div className="revenue-value">{quantityFood}</div>
                                </div>
                                <div className="revenue-container" onClick={handleClick} style={{ cursor: 'pointer' }}>
                                    <div className="revenue-title">Chi tiết hóa đơn</div>
                                    <div className="revenue-value" style={{ fontWeight: 'bold' }}><ArrowRightOutlined /></div>
                                </div>
                            </div>
                        )}
                        <div className="button-container flex items-center justify-center h-screen">
                            <button className="btn btn-confirm" onClick={fetchShift}>Chốt ca</button>
                            <button className="btn btn-print">Chốt ca và in đơn</button>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default ShiftMonitor;
