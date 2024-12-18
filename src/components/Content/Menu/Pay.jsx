import save from '../../../assets/save.png';
import del from '../../../assets/delete.png';
import '../../../assets/Menu/Menu.css';
import FoodPay from './FoodPay';
import { useState, useEffect, useRef } from 'react';
import { Button, Form, Input, notification } from "antd";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Nếu bạn sử dụng autotable
import font from '../../../assets/Roboto/Roboto-Regular.ttf';
import { useNavigate, useParams } from 'react-router-dom';
import { completeOrder } from '../../../services/OrderService';
import { getDiscountByDiscountCode, getAllDiscounts } from '../../../services/DiscountService';
import {updateOrder} from "../../../services/OrderService";
import {getEmployeeInfo} from "../../../services/EmployeeService";


function Pay({cartItems, updateState, onQuantityChange}){
    const [note, setNote] = useState(); // State để lưu ghi chú
    const [discountCode, setDiscountCode] = useState(); // State để lưu mã giảm giá
    const [existingDiscount, setExistingDiscount] = useState([]); // State để lưu mã giảm giá
    const [totalAmount, setTotalAmount] = useState(0); // State để lưu tổng số tiền
    const printRef = useRef(); // Sử dụng useRef để tham chiếu đến phần HTML cần in
    const {orderId} = useParams();
    const {idTable} = useParams();
    const navigate = useNavigate();
    

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
        const total = subtotal - discount; // Tính tổng sau khi giảm giá
        return total < 0 ? 0 : total; // Đảm bảo tổng không âm
    };

    const fetchDiscount = async() =>{
        const check = await getAllDiscounts();
        const exist = check.data.result.find(dis => dis.discountCode === discountCode);
        if(exist){
            setExistingDiscount(exist);
        }
        else{
            setExistingDiscount();
        }
        // if(existingDiscount){
        //     const response = await getDiscountByDiscountCode(discountCode);
        //     setDiscountCodes(response.data.result);
        // }   
    }

    const fetchComplteOrder = async () => {
        await completeOrder(orderId);
    }


    const fetchUpdateOrder = async () => {
        try {
            const employee = await getEmployeeInfo();
    
            const existingOrder = {
                employeeId: employee.data.result.id,
                note: 'Đây là note',
                tableId: idTable,
                discountCode: ''
            };
    
            // Gọi API để cập nhật đơn hàng
            const response = await updateOrder(orderId, {
                employeeId: employee.data.result.id,
                note: 'Đây là note',
                tableId: idTable,
                discountCode: existingDiscount.discountCode
            });
    
            console.log(response.data.message);
        } catch (error) {
            if (error.response) {
                console.error("Lỗi từ server:", error.response.data);
                console.error("Lỗi từ server:", error.message);
            } else {
                console.error("Lỗi không xác định:", error.message);
            }        
        }
    }


    // print hóa đơn
    const handlePayment = () => {
        const doc = new jsPDF();
        
        // Thêm font chữ
        // doc.addFileToVFS('Roboto-Regular.ttf', font);
        // doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        // doc.setFont('Roboto'); // Sử dụng font chữ Roboto
        
        // Thêm tiêu đề
        doc.setFontSize(20);
        doc.text('Order Payment', 20, 20);

        // Thêm thông tin chi tiết hóa đơn
        let y = 30; // Vị trí y bắt đầu
        cartItems.forEach(item => {
            doc.text(`${item.foodName} - ${item.foodPrice} VNĐ x ${item.quantity}`, 20, y);
            y += 10; // Tăng vị trí y cho dòng tiếp theo
        });

        // Tính tổng
        const total = cartItems.reduce((sum, item) => sum + item.foodPrice * item.quantity, 0);
        doc.text(`Total: ${total} VNĐ`, 20, y);

        //note
        doc.text(`Note: ${note}`, 20, 20);

        // Lưu file PDF
        doc.save('hoa_don.pdf');
        fetchComplteOrder();
        fetchUpdateOrder();
        navigate(-1);
        notification.success({
            message: "Thành toán thành công",
            duration: 2,
          });

    };

    
    return(
        <>
            <div className='pay-container ml-1 font-bold flex-grow flex flex-col justify-between'>
                <div>
                    <div className='flex items-center text-2xl text-white bg-blue-500 border-b-2 border-gray-200 p-2'>
                        <img src={save} alt="Lưu" className='w-5 h-5' style={{marginRight: '10px', borderRadius: '2px'}}/>
                        <div>Giỏ hàng</div>
                        <div className='flex-grow'></div>
                        <img src={del} alt="Xóa" className='w-5 h-5' style={{marginLeft: '10px', borderRadius: '2px'}}/>
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
                    <button onClick={handlePayment} updateState="AVAILABLE" className="bg-red-500 text-lg text-white p-2 w-full flex  justify-between">
                        <span>Thanh toán</span> 
                        <span>{totalAmount.toLocaleString()} VNĐ</span>
                    </button>

                </div>
            </div>
        </>
    );
}

export default Pay;
