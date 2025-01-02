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
import LocalStorageService from "../../services/LocalStorageService";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Nếu bạn sử dụng autotable
import { notification } from "antd";



const ShiftMonitor= () => {
    const [showDetail, setShowDetail] = useState(false); // State để theo dõi nội dung hiển thị
    const[revenue, setRevenue] = useState(0);
    const[orders, setOrders] = useState([]);
    const[quantityFood, setQuantityFood] = useState(0);
    const[quantityOrderDetail, setQuantityOrderDetail] = useState(0);
    // const[shiftId, setShiftId] = useState();
    const shiftId = LocalStorageService.getItem("shiftId");

    // Invoice details data
    const [invoiceDetails, setInvoiceDetails] = useState([]);


    const columns = [
        { title: 'Ma hoa don', dataIndex: 'invoiceId', key: 'invoiceId' },
        { title: 'So luong mon', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Thoi gian thanh toan', dataIndex: 'paymentTime', key: 'paymentTime' },
        { title: 'Tong tien', dataIndex: 'total', key: 'total', render: total => `${total} VNĐ` },
    ];

    useEffect(() => {
        fetchTotalPrice();
    }, [shiftId]);

    useEffect(() => {
        fetchQuantity();
    }, [orders]);

    const fetchTotalPrice = async ()=>{
        try {
            // setShiftId((await getActiveShift()).data.result.shiftId);
            const response = await getAllOrderByShiftIdCompleted(shiftId); // Giả sử getAllOrders là một hàm async
            setOrders(response.data.result);
            // Tính tổng doanh thu ngay sau khi nhận được dữ liệu
            const total = response.data.result.reduce((acc, order) => acc + order.totalPrice - order.discountValue, 0);
            
            setRevenue(total);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // print hóa đơn
    const handlePayment = () => {
        if (!invoiceDetails || invoiceDetails.length === 0) {
            notification.error({ message: "Không có dữ liệu hóa đơn để in", duration: 2 });
            return;
        }
    
        const doc = new jsPDF();
    
        // Thêm tiêu đề
        const title = 'Chi tiet hoa don ca';
        const pageWidth = doc.internal.pageSize.width;
        const titleWidth = doc.getTextWidth(title);
        const titleX = (pageWidth - titleWidth) / 2;
        doc.setFont('Roboto', 'bold');
        doc.setFontSize(30);
        doc.text(title, titleX, 20);
    
        // Thêm thông tin doanh thu và số lượng món
        doc.setFont('Roboto', 'normal');
        doc.setFontSize(18);
        doc.text(`Doanh thu cua ca: ${revenue} VND`, 20, 30);
        doc.text(`So luong mon da ban: ${quantityFood}`, 20, 40);
    
        // Thêm bảng
        // lỗi sửa trực tiếp vào body
        doc.autoTable({
            head: [columns.map(col => col.title)],
            body: invoiceDetails.map(item => [
                item.invoiceId,
                item.quantity,
                item.paymentTime,
                `${item.total} VND`,
            ]),
            startY: 50,
        });
    
        // Lưu file PDF
        doc.save('hoa_don.pdf');
        fetchShift();
        notification.success({ message: "Đóng ca thành công", duration: 2 });
    };
    


    const fetchQuantity = async ()=>{
        try {
            // Tạo một mảng các Promise từ các yêu cầu bất đồng bộ
            const promises = orders.map(async (order) => {
                const response = await getOrderDetailsByOrderId(order.orderId); // Giả sử order có thuộc tính id   
                const totalQuantity = response.data.result.reduce((acc, food) => acc + food.quantity, 0);
                const totalPrice = response.data.result.reduce((acc, food) => acc + food.foodPrice * food.quantity, 0); // Tính tổng tiền
                const newTotal = totalPrice - order.discountValue;
                return {
                    invoiceId: order.orderId,
                    quantity: totalQuantity,
                    paymentTime: order.endedAt, // Thay đổi theo thời gian thực tế
                    total: newTotal,
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
                <Layout>
                    <Content>
                    <h1 className="flex items-center justify-center text-2xl mt-4" style={{fontWeight:'bold'}}>Chi tiết hóa đơn của ca</h1>
                        {showDetail ? (
                            <Card title="Chi tiết hóa đơn" bordered={false} style={{margin: '20px' }}>
                            <Table dataSource={invoiceDetails} columns={columns} rowKey="invoiceId" />
                            <Button type="primary" onClick={() => setShowDetail(false)} style={{ marginTop: '16px' }}>
                                Quay lại
                            </Button>
                        </Card>
                        ) : (
                            
                            <div className="flex items-center justify-between" style={{ padding: '0 24px 24px', marginTop: '30px' }}>
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
                        <div className="button-container flex items-center justify-center space-x-4">
                            <button 
                                className="btn bg-blue-500 text-white font-bold py-2 px-4 rounded shadow hover:bg-blue-600 hover:shadow-lg transition duration-200" 
                                onClick={fetchShift}
                            >
                                Chốt ca
                            </button>
                            <button style={{backgroundColor:'#F96E2A'}}
                                className="btn text-white font-bold py-2 px-4 rounded shadow hover:bg-green-600 hover:shadow-lg transition duration-200"
                                onClick={handlePayment}
                            >
                                Chốt ca và in đơn
                            </button>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default ShiftMonitor;
