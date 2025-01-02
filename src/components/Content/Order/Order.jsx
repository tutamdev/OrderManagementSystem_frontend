import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Food from '../Menu/Food';
import Pay from '../Menu/Pay';
import Nav from '../../Nav/Nav';
import { Layout } from "antd";
const { Content} = Layout;
import { getOrderDetailsByOrderId, updateOrderDetail } from '../../../services/OrderDetailService';

function Order(){
    const [cartItems, setCartItems] = useState([]);
    const {orderId} = useParams();
    const {tableId} = useParams();

    // useEffect để fetch order details khi orderId thay đổi
    useEffect(() => {
        fetchOrderDetail(orderId);
    }, [orderId]); // Chỉ theo dõi orderId

    const fetchOrderDetail = async (orderId) =>{
        try {
            const response = await getOrderDetailsByOrderId(orderId);
            const fetchedItems = response.data.result;
            // Cập nhật cartItems bằng cách thêm tất cả các món ăn từ fetchedItems
            setCartItems(prevCartItems => [
                ...prevCartItems,
                ...fetchedItems.map(item => ({
                    ...item,
                    foodId: item.foodId,
                    foodName: item.foodName,
                    quantity: item.quantity,
                    
                     // Giữ nguyên số lượng từ fetchedItems
                }))
            ]);
        } catch (error) {
            console.error('Error checking order detail:', error);
        }
    }

    const handleAddToCart = (food) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.foodId === food.foodId);
            
            if(existingItem){
                return prevItems.map(item => 
                    item.foodId === food.foodId 
                        ? {...item, quantity: item.quantity + 1} 
                        : item
                );
            }
            
            return [...prevItems, {...food, quantity: 1}];
        });
    };

    const handleQuantityChange = async (foodId, newQuantity) => {
        // Tìm orderdetail của food này
        const response = await getOrderDetailsByOrderId(orderId); // Giả sử bạn có hàm này
        const existingOrderDetails = response.data.result;

        const existingFoodOrderDetail = existingOrderDetails.find(
            detail => detail.foodId === foodId
        );
        if (newQuantity === 0) {
            setCartItems(prevItems => 
                prevItems.filter(item => item.foodId !== foodId)
            );
            // Nếu food đã có trong orderdetail, tăng quantity
            await updateOrderDetail(orderId, [{
                ...existingFoodOrderDetail,
                quantity: 0 // Cập nhật số lượng mới
            }]);
        } else {
            setCartItems(prevItems => 
                prevItems.map(item => 
                    item.foodId === foodId 
                        ? {...item, quantity: newQuantity} 
                        : item
                )
            );
            // Nếu food đã có trong orderdetail, tăng quantity
            await updateOrderDetail(orderId, [{
                ...existingFoodOrderDetail,
                quantity: newQuantity // Cập nhật số lượng mới
            }]);
        }
    };

    return(
        <>  
            <Layout>
            <Nav /> {/* Thanh điều hướng trên cùng */}
            <Layout>
                <Layout>
                    <Content>
                    <div className='flex'> 
                        {/* when fooddetail component is clicked, call handleAddToCart */}
                        <Food onAddToCart={handleAddToCart} orderId = {orderId}/>
                        {/* cartItems is the array of items in the cart, onQuantityChange is the function to handle quantity change */}
                        <Pay cartItems={cartItems} tableId={tableId} orderId={orderId} onQuantityChange={handleQuantityChange} />
                    </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
            
        </>
    );
};

export default Order;
