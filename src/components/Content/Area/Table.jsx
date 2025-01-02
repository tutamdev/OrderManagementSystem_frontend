import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createOrder } from '../../../services/OrderService';
import { getOrderNotCompleteByTableId } from '../../../services/TableService';
import LocalStorageService from '../../../services/LocalStorageService';
import { format, differenceInSeconds, parseISO, addSeconds } from 'date-fns';
import { notification } from 'antd';

const StyledCard = styled.div`
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 10px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    background-color: ${props => {
        switch (props.status) {
            case 'UNAVAILABLE':
                return '#3CD19D'
            case 'MAINTENANCE':
                return '#F46F5E'
            default:
                return '#FFFFFF'
        }
    }};

    color: ${props => {
        switch (props.status) {
            case 'AVAILABLE':
                return '#000000'
            default:
                return '#FFFFFF'
        }
    }};

    .info {
        position: absolute;
        bottom: 10px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 22px;
        margin-bottom: 10px;
        color: ${props => props.status === 'AVAILABLE' ? '#000000' : '#FFFFFF'};
    }
`;

function Table({ tableId, name, status }) {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState();
    const [loading, setLoading] = useState(false);
    // const [timeCre, setTimeCre] = useState();

    const employee = LocalStorageService.getItem("userLogged");
    const fetchOrderId = async () => {
        try {
            setLoading(true); // Set loading to true while creating the order
            const response = await createOrder({
                "employeeId": employee.id,
                "note": "Note",
                "tableId": tableId,
                "discountCode": ""
            });
            setOrderId(response.data.result.orderId);
            //setOrderId là hàm bất động bộ => xử lý sau
            // toast.success('Order created successfully!'); // Notify success
            notification.success({ message: "Tạo đơn hàng thành công!", duration: 1 })
            return true; // Indicate that the order was created successfully
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Failed to create order. Please try again.'); // Notify error
            return false; // Indicate that the order creation failed
        } finally {
            setLoading(false); // Set loading to false after the operation
        }
    };

    async function fetchOrderNotCompleted(tableId, setCreatedAt) {
        try {
            const response = await getOrderNotCompleteByTableId(tableId);
            const timeCre = response?.data?.result?.createdAt; // Lấy thời gian tạo đơn hàng
            setCreatedAt(timeCre); // Lưu thời gian tạo vào state
        } catch (error) {
            console.log(error);
        }
    }

    function useLiveTimeUpdater(tableId) {
        const [createdAt, setCreatedAt] = useState(null); // Lưu thời gian tạo đơn hàng
        const [timeCre, setTimeCre] = useState('00:00:00'); // Lưu thời gian chênh lệch

        // Gọi API để lấy thời gian tạo đơn hàng khi component mount
        useEffect(() => {
            fetchOrderNotCompleted(tableId, setCreatedAt);
        }, [tableId]);

        // Cập nhật thời gian chênh lệch mỗi giây
        useEffect(() => {
            if (!createdAt) return; // Nếu chưa có createdAt, không làm gì

            const interval = setInterval(() => {
                const now = new Date(); // Thời gian hiện tại
                const createdAtDate = parseISO(createdAt); // Chuyển đổi createdAt thành Date object
                const diffInSeconds = differenceInSeconds(now, createdAtDate); // Tính khoảng thời gian chênh lệch

                // Chuyển đổi thành giờ, phút, giây
                const hours = Math.floor(diffInSeconds / 3600);
                const minutes = Math.floor((diffInSeconds % 3600) / 60);
                const seconds = diffInSeconds % 60;

                // Định dạng thành hh:mm:ss
                const formattedDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                setTimeCre(formattedDuration); // Cập nhật state
            }, 1000); // Cập nhật mỗi giây

            return () => clearInterval(interval); // Xóa interval khi component unmount
        }, [createdAt]);

        return timeCre; // Trả về thời gian chênh lệch
    }

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
    useEffect(() => {
        fetchOrderNotCompleted(tableId);
    }, []);

    const handleTableClick = async () => {
        switch (status) {
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

    const timeCre = useLiveTimeUpdater(tableId);

    return (

        <StyledCard status={status} className='relative mb-4' onClick={handleTableClick}>
            <h2 className='text-center mt-4 font-semibold text-lg' style={{ fontSize: '1.5vw' }}>{name}</h2>
            {/* inset-0 used to div cover the whole card */}
            <div className='absolute inset-0 flex items-center justify-center '>
                <FontAwesomeIcon icon={faUtensils} style={{ fontSize: '2vw' }} />
            </div>
            {timeCre !== '00:00:00' ?
                <div className="info">
                    <div>{timeCre}</div>
                </div>
                : null
            }

        </StyledCard>
    );
};

export default Table;