import save from '../../../assets/save.png';
import del from '../../../assets/delete.png';
import '../../../assets/Menu/Menu.css';
import FoodPay from './FoodPay';
import { useState, useEffect, useRef } from 'react';
import { Button, Form, Input, notification, Popconfirm } from "antd";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Nếu bạn sử dụng autotable
import font from '../../../assets/Roboto/Roboto-Black.ttf';
import { useNavigate, useParams } from 'react-router-dom';
import { completeOrder, deleteOrder } from '../../../services/OrderService';
import { getDiscountByDiscountCode, getAllDiscounts } from '../../../services/DiscountService';
import { updateOrder, getOrderByOrderId } from "../../../services/OrderService";
import { getEmployeeInfo } from "../../../services/EmployeeService";
import LocalStorageService from '../../../services/LocalStorageService';

function Pay({ cartItems, tableId, orderId, onQuantityChange}) {
    const [note, setNote] = useState(); // State để lưu ghi chú
    const [discountCode, setDiscountCode] = useState(); // State để lưu mã giảm giá
    const [existingDiscount, setExistingDiscount] = useState([]); // State để lưu mã giảm giá
    const [totalAmount, setTotalAmount] = useState(0); // State để lưu tổng số tiền
    const [beforeDiscount, setBeforeDiscount] = useState(); // State để lưu tổng số tiền
    const [discountValue, setDiscountValue] = useState(0); // State để luu tien giảm giá
    const [tableName, setTableName] = useState();
    const [areaName, setAreaName] = useState();
    const navigate = useNavigate();
    const employee = LocalStorageService.getItem("userLogged");
    
    useEffect(() => {
        fetchOrder();
    }, []);

    // Cập nhật tổng số tiền mỗi khi cartItems thay đổi
    useEffect(() => {
        const newTotal = calculateTotal();
        setTotalAmount(newTotal);
    }, [cartItems, existingDiscount]);

    useEffect(() => {
        fetchDiscount(discountCode);
    }, [discountCode]);

    // Tính tổng số tiền
    const calculateTotal = () => {
        const subtotal = cartItems.reduce((total, item) => total + item.foodPrice * item.quantity, 0);
        setBeforeDiscount(subtotal);
        // Nếu đã tồn tại, tìm discount 
        // Áp dụng mã giảm giá nếu có
        let discount = 0;
        if (existingDiscount) {
            if (existingDiscount.discountType === 'PERCENT') {
                discount = (subtotal * existingDiscount.discountValue) / 100; // Giảm theo phần trăm
            } else if (existingDiscount.discountType === 'FIXED') {
                discount = existingDiscount.discountValue; // Giảm theo số tiền cố định
            }
        }
        setDiscountValue(discount);
        const total = subtotal - discount; // Tính tổng sau khi giảm giá
        setTotalAmount(total);
        return total < 0 ? 0 : total; // Đảm bảo tổng không âm
    };

    const fetchDiscount = async () => {
        const check = await getAllDiscounts();
        const exist = check.data.result.find(dis => dis.discountCode === discountCode);
        if (exist) {
            setExistingDiscount(exist);
        }
        else {
            setExistingDiscount();
        }
    }

    const fetchComplteOrder = async () => {
        try {
            // Gọi API để cập nhật đơn hàng
            const order = {
                employeeId: employee.id,
                note: note,
                tableId: tableId,
                discountCode: discountCode
            }

            const response = await updateOrder(orderId, order);
            if (response.data.code == 200) {
                await completeOrder(orderId);
            }
        } catch (error) {
            if (error.response) {
                console.error("Lỗi từ server:", error.response.data);
            } else {
                console.error("Lỗi không xác định:", error.message);
            }
        }
    }

    const fetchOrder = async () => {
        const response = await getOrderByOrderId(orderId);
        setTableName(response.data.result.tableName);
        setAreaName(response.data.result.areaName);
    }


    const fetchUpdateOrder = async () => {
        try {
            // Gọi API để cập nhật đơn hàng
            const order = {
                employeeId: employee.id,
                note: note,
                tableId: tableId,
                discountCode: discountCode
            }
            const response = await updateOrder(orderId, order);

        } catch (error) {
            if (error.response) {
                console.error("Lỗi từ server:", error.response.data);
            } else {
                console.error("Lỗi không xác định:", error.message);
            }
        }
    }

    const removeVietnameseTones = (str) => {
        if (!str) {
            return ''; // Return an empty string if input is undefined or null
        }
    
        return str
            .normalize("NFD") // Chuẩn hóa chuỗi thành dạng tổ hợp ký tự
            .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu thanh
            .replace(/đ/g, "d") // Chuyển đổi chữ "đ"
            .replace(/Đ/g, "D") // Chuyển đổi chữ "Đ"
            .replace(/[^\w\s]/gi, ""); // Loại bỏ các ký tự đặc biệt (tùy chọn)
    };

    const handlePayment = () => {
        const doc = new jsPDF();
    
        // Thêm tiêu đề, căn giữa
        const title = 'Hoa don thanh toan';
        const pageWidth = doc.internal.pageSize.width; // Lấy chiều rộng của trang
        const titleWidth = doc.getTextWidth(title); // Lấy chiều rộng của văn bản
        const titleX = (pageWidth - titleWidth - 40) / 2; // Tính toán vị trí X để căn giữa
        doc.setFont('Roboto', 'bold');
        doc.setFontSize(30);
        doc.text(title, titleX, 20);
    
        // Cập nhật vị trí Y để bắt đầu phần sau
    
        // Thêm thông tin chi tiết hóa đơn (Table + Area)
        const table = removeVietnameseTones(tableName);
        const area = removeVietnameseTones(areaName);
        doc.setFont('Roboto', 'normal');
        doc.setFontSize(20);
        doc.text(`${table} - ${area}`, titleX+20, 30);
        
        let y = 50;
        // Thêm các món ăn vào hóa đơn
        cartItems.forEach(item => {
            const name = removeVietnameseTones(item.foodName);
            doc.text(`${name} - ${item.foodPrice} VND x ${item.quantity}`, 20, y);
            y += 10; // Tăng vị trí y cho dòng tiếp theo
        });
    
        // Tính giảm giá và tổng tiền
        doc.setFontSize(16);
        doc.text(`Giam: ${discountValue} VND`, 20, y);
        y += 10; // Increase Y for the next line
        doc.text(`Tong: ${totalAmount} VND`, 20, y);
        y += 10; // Increase Y for the next line
    
        // Ghi chú (Notes section)
        doc.setFontSize(14);
        const note_remove = removeVietnameseTones(note);
        doc.text(`Ghi chu: ${note_remove}`, 20, y);
        y += 20; // Increase Y for the next section
    
        // Thêm thời gian thanh toán
        const endTime = new Date();
        const hours = endTime.getHours();
        const minutes = endTime.getMinutes();
        const seconds = endTime.getSeconds();
        const day = endTime.getDate();
        const month = endTime.getMonth() + 1; // Months are 0-based (0-11)
        const year = endTime.getFullYear();
        const formattedTime = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    
        doc.text(`Thoi gian thanh toan: ${formattedTime}`, 20, y);
    
        // Lưu file PDF
        doc.save('hoa_don.pdf');
        
        // Fetch update order and navigate
        fetchComplteOrder();
        navigate("/");
    
        // Hiển thị thông báo thành công
        notification.success({
            message: "Thanh toán thành công",
            duration: 2,
        });
    };
    


    const delOrder = async () => {
        try {
            await deleteOrder(orderId);
            notification.success({
                message: "Xoá đơn hàng thành công!"
            })
            navigate(-2);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <div className='pay-container ml-1 font-bold flex-grow flex flex-col justify-between'>
                <div>
                    <div className='flex items-center text-2xl text-white bg-blue-500 border-b-2 border-gray-200 p-2'>
                        <img src={save} alt="Lưu" className='w-5 h-5' style={{ marginRight: '10px', borderRadius: '2px' }} />
                        <div>Giỏ hàng</div>
                        <div className='flex-grow'></div>
                        <Popconfirm
                            placement="bottomRight"
                            title="Xoá đơn hàng"
                            description="Bạn có muốn xoá đơn hàng không?"
                            okText="Xoá"
                            cancelText="Huỷ bỏ"
                            onConfirm={delOrder}
                        >
                            <img src={del} alt="Xóa" className='w-5 h-5' style={{ marginLeft: '10px', borderRadius: '2px' }} />
                        </Popconfirm>
                    </div>

                    {/* add foodpay component */}
                    {cartItems.map((item) => (
                        <FoodPay
                            key={item.foodId}
                            foodId={item.foodId}
                            foodName={item.foodName}
                            foodPrice={item.foodPrice}
                            quantity={item.quantity}
                            onQuantityChange={onQuantityChange}
                        />
                    ))}
                </div>

                <div >
                    {/* Phần ghi chú và mã giảm giá */}
                    <div className="bg-white p-2 border-b-2 border-t-2 border-gray-200">
                        <label className="block text-gray-700">Ghi chú</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Nhập ghi chú của bạn ở đây..."
                        />
                    </div>

                    <div className="bg-white p-2 border-b-2 border-gray-200">
                        <label className="block text-gray-700">Mã giảm giá</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Nhập mã giảm giá của bạn ở đây..."
                        />
                    </div>

                    {/* Hiển thị tổng số tiền */}
                    <button onClick={() => {
                        handlePayment();
                    }} className="bg-red-500 text-lg text-white p-2 w-full flex  justify-between" >
                        <span >Thanh toán</span>
                        {discountCode && (
                            <span style={{ textDecoration: "line-through" }}>{(beforeDiscount / 1000).toLocaleString()}K</span>
                        )}
                        <span>{totalAmount.toLocaleString()} VNĐ</span>
                    </button>

                </div>
            </div>
        </>
    );
}

export default Pay;
