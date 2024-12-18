import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createOrder} from '../../../services/OrderService';
import {getOrderNotCompleteByTableId} from '../../../services/TableService';

const StyledCard = styled.div`
    width: 250px;
    height: 250px;
    border-radius: 10px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    background-color: ${props => {
        switch(props.status){
            case 'UNAVAILABLE':
                return '#3CD19D'
            case 'MAINTENANCE':
                return '#F46F5E'
            default:
                return '#FFFFFF'
        }
    }};

    color: ${props => {
        switch(props.status){
            case 'AVAILABLE':
                return '#000000'
            default:
                return '#FFFFFF'
        }
    }};
`;

function Table({tableId, name, status}){
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState();
    const [loading, setLoading] = useState(false);

    const fetchOrderId = async () => {
        try {
            setLoading(true); // Set loading to true while creating the order
            const response = await createOrder({
                "employeeId": "732a2d0a-a03b-4c23-b571-c52e7c638d2a",
                "note": "Note",
                "tableId": tableId,
                "discountCode": ""
            });
            setOrderId(response.data.result.orderId);
            //setOrderId là hàm bất động bộ => xử lý sau
            toast.success('Order created successfully!'); // Notify success
            return true; // Indicate that the order was created successfully
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Failed to create order. Please try again.'); // Notify error
            return false; // Indicate that the order creation failed
        } finally {
            setLoading(false); // Set loading to false after the operation
        }
    };

    //when orderId thay đổi mới cho chuyển hướng = setOrderId thành công
    useEffect(() => {
        if (orderId) {
          // Chuyển hướng ngay lập tức và truyền state
          navigate(`/table/${tableId}/orders/${orderId}`, { 
            state: { 
              showToast: true,
              tableName: name 
            } 
          });
        }
      }, [orderId]); // Theo dõi orderId


    const handleTableClick = async () => {
        switch(status) {
            case 'AVAILABLE':
                const result = await Swal.fire({
                    title: 'Xác nhận đặt bàn',
                    text: 'Bạn có xác nhận đặt bàn này không?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Có',
                    cancelButtonText: 'Không'
                });
            
                if (result.isConfirmed) {
                    await fetchOrderId(); // Sử dụng await ở đây
                    
                }
                break;               
            
            case 'MAINTENANCE':
                toast.error('Bàn đang bảo trì', {
                    icon: '🔧',
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                break;
            
            default:
                const unavailableResult = await Swal.fire({
                    title: 'Bạn muốn đặt thêm món?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Có',
                    cancelButtonText: 'Không'
                });
                if (unavailableResult.isConfirmed) {
                    const response = await getOrderNotCompleteByTableId(tableId);
                    // Chuyển hướng ngay lập tức và truyền state
                    navigate(`/table/${tableId}/orders/${response.data.result.orderId}`, { 
                        state: { 
                        showToast: true,
                        tableName: name 
                        } 
                    });
                }
                
                break;
        }
    };

    

    return(
        <StyledCard status={status} className='relative mb-4' onClick={handleTableClick}>
            <h2 className='text-center mt-4 font-semibold text-lg'>{name}</h2>
            {/* inset-0 used to div cover the whole card */}
            <div className='absolute inset-0 flex items-center justify-center '>
                <FontAwesomeIcon icon={faUtensils} size="2x" />
            </div>
        </StyledCard>
    );
};

export default Table;