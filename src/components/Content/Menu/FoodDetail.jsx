import styled from 'styled-components';
import { useState } from 'react';
import { Modal } from 'antd';
import { getOrderDetailsByOrderId, createOrderDetail, updateOrderDetail } from '../../../services/OrderDetailService';


const StyledCard = styled.div`
    width: 100%;
    aspect-ratio: 1 / 1;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    position: relative;
    border: 1px solid #e0e0e0;
    background-color: ${props => props.available === 'false' ? '#f8f8f8' : '#ffffff'};
    color: ${props => props.available === 'false' ? '#b0b0b0' : '#333333'};

    &:hover {
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
        border: 3px solid #0D92F4;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .price-tag {
        position: absolute;
        top: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 4px 8px;
        border-bottom-left-radius: 8px;
        font-weight: bold;
        font-size: 1vw;
        border: 1px solid #ccc;
    }

    .food-name {
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        text-align: center;
        padding: 8px 0;
        font-size: 1vw;
        font-weight: 600;
    }
    background-color: ${props => {
        switch(props.available){
            case 'false':
                return '#3CD19D'
            default:
                return '#FFFFFF'
        }
    }};

    color: ${props => {
        switch(props.available){
            case 'false':
                return 'gray'
            default:
                return '#000000'
        }
    }};
`;

const StyledModal = styled(Modal)`
    .ant-modal-content {
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .ant-modal-header {
        background-color: #0D92F4;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        padding: 16px 24px;
    }

    .ant-modal-title {
        color: white;
        font-weight: 600;
        text-align: center;
    }

    .ant-modal-body {
        padding: 24px;
        text-align: center;
    }

    .ant-modal-footer {
        display: flex;
        justify-content: space-between;
        padding: 16px 24px;
        border-top: none;
    }

    .ant-btn-default {
        border: 2px solid #FF4D4F;
        color: #FF4D4F;
        font-weight: 600;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
            background-color: #FF4D4F;
            color: white;
        }
    }

    .ant-btn-primary {
        background-color: #0D92F4;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;

        &:hover {
            background-color: #1A73E8;
        }
    }
`;

function FoodDetail({key, foodId, foodName, foodPrice, imgUrl, available, quantity, onFoodClick, orderId}){
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [orderDetail, setOrderDetail] = useState([]);
    const [addOrderDetail, setAddOrderDetail] = useState([]);
    // Kiểm tra orderdetail đã tồn tại chưa
    const checkExistingOrderDetail = async () => {
        try {
            const response = await getOrderDetailsByOrderId(orderId);
            // Kiểm tra nếu response.data.result rỗng
            if(response.data.result.length === 0){
                return false;
            }
            return true; // Trả về true nếu rỗng, false nếu không
        } catch (error) {
            console.error('Error checking order detail:', error);
            return false; // Trả về false trong trường hợp có lỗi
        }
    };
    

    const handleClick = () => {
        // Hiển thị modal xác nhận
        setIsModalVisible(true);
    }

    const handleConfirm = async () => {
        try {
            // Kiểm tra orderdetail đã tồn tại chưa
            const exists = await checkExistingOrderDetail();
            if (!exists) {

                const createdOrderDetail = await createOrderDetail(orderId, [{
                    "foodId" : foodId,
                    "quantity": quantity,
                    "foodNote": "Note"
                }]);
                setAddOrderDetail([...addOrderDetail, createdOrderDetail.data.result]);
                setOrderDetail([...orderDetail, addOrderDetail]);
            } else {
                // Nếu đã tồn tại, tìm orderdetail của food này
                const existingFoodOrderDetail = orderDetail.find(
                    detail => detail.foodId === foodId
                );

                if (existingFoodOrderDetail) {
                    // Nếu food đã có trong orderdetail, tăng quantity
                    await updateOrderDetail(orderId, {
                        ...existingFoodOrderDetail,
                        quantity: existingFoodOrderDetail.quantity + 1
                    });
                    // Cập nhật lại orderDetail trong state
                    setOrderDetail(prevOrderDetail => 
                        prevOrderDetail.map(detail =>
                            detail.foodId === foodId
                                ? { ...detail, quantity: existingFoodOrderDetail.quantity + 1 } // Cập nhật số lượng
                                : detail // Giữ nguyên các món ăn khác
                        )
                    );
                } else {
                    await updateOrderDetail(orderId, [{
                        "foodId" : foodId,
                        "quantity": quantity,
                        "foodNote": "Note"
                    }]);
                    // Nếu food chưa có trong orderdetail, tạo mới               
                    setAddOrderDetail([...addOrderDetail, {
                        "foodId": foodId,
                        "quantity": quantity,
                        "foodNote" : "Note"}]);
                    setOrderDetail([...orderDetail, addOrderDetail]);
                }
            }

            // Gọi hàm onFoodClick để cập nhật state ở component cha
            onFoodClick({
                foodId, 
                foodName,
                quantity,
                foodPrice,
                foodNote: "note"
            });

            // Đóng modal
            setIsModalVisible(false);

        } catch (error) {
            console.error('Error confirming order:', error);
        }
    }

    const handleCancel = () => {
        // Đóng modal khi người dùng hủy
        setIsModalVisible(false);
    }

    return(
        <>
            <StyledCard available={available} onClick={handleClick}>
                <img src={imgUrl} alt={foodName} />
                <div className='price-tag w-16 flex justify-center'>{foodPrice/1000}K</div>
                <div className='food-name'>{foodName}</div>
            </StyledCard>

            <StyledModal
                title="Xác Nhận Đặt Món"
                open={isModalVisible}
                onOk={handleConfirm}
                onCancel={handleCancel}
                okText="Xác Nhận"
                cancelText="Hủy"
                centered
                width={400}
            >
                <div className="flex flex-col items-center">
                    <img 
                        src={imgUrl} 
                        alt={foodName} 
                        className="w-32 h-32 object-cover rounded-lg mb-4 shadow-md"
                    />
                    <h3 className="text-xl font-bold mb-2">{foodName}</h3>
                    <p className="text-gray-600 mb-4">Bạn có chắc chắn muốn đặt món này không?</p>
                    <div className="text-lg font-semibold text-blue-600">Giá: {foodPrice/1000}K</div>
                </div>
            </StyledModal>
        </>
    );
}

export default FoodDetail;
