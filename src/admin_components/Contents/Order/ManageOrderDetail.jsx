import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Table, Card, Space, Typography } from 'antd';
import { format } from 'date-fns';
import { getOrderByOrderId, getAllOrderDetailByOrderId } from '../../../services/admin_services/OrderService';
import { useNavigate, useParams } from 'react-router-dom';


export const ManageOrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const navigate = useNavigate();

    const fetchOrder = async () => {
        try {
            const response = await getOrderByOrderId(orderId);
            if (response.data.code === 200) {
                setOrder(response.data.result)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchOrderDetail = async () => {
        try {
            const response = await getAllOrderDetailByOrderId(orderId);
            if (response.data.code === 200) {
                setOrderDetails(response.data.result)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const hanlePrintOrder = () => {
        console.log("Print Order");
    }

    useEffect(() => {
        document.title = "Quản lý chi tiết hoá đơn";
        fetchOrder();
        fetchOrderDetail();
    }, []);

    const columns = [
        {
            title: 'Tên món',
            dataIndex: 'foodName',
            key: 'foodName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'foodPrice',
            key: 'foodPrice',
            render: (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: 'Thành tiền (VND)',
            key: 'total',
            render: (_, record) => (record.foodPrice * record.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: 'Ghi chú món',
            dataIndex: 'foodNote',
            key: 'foodNote',
        },
    ];

    return (
        <div className="">
            <div className='flex justify-between border-b p-2'>
                <div className='flex items-center'>
                    <Button variant='filled' color='primary' onClick={() => { navigate(-1) }}>
                        Trở về
                    </Button>
                    <p className='text-2xl ml-2'>Quản lý khu vực</p>
                </div>
                <Button variant='filled' color='primary' onClick={hanlePrintOrder}>
                    In hoá đơn
                </Button>
            </div>
            <div className="flex space-x-3 p-2 bg-gray-50">
                <div className="w-[400px]">
                    <Card className="shadow-lg">
                        <Typography.Title level={4} className="mb-4">Thông tin đơn hàng</Typography.Title>
                        <div className="space-y-3">
                            <div>
                                <Typography.Text strong>Mã đơn hàng:</Typography.Text>
                                <p>{order?.orderId}</p>
                            </div>
                            <div>
                                <Typography.Text strong>Nhân viên tạo đơn:</Typography.Text>
                                <p>{order?.employeeName}</p>
                            </div>
                            <div className='flex justify-between'>
                                <div className='inline-flex gap-1'>
                                    <Typography.Text strong>Khu vực:</Typography.Text>
                                    <p>{order?.areaName || "Không xác định"}</p>
                                </div>
                                <div className='inline-flex gap-1'>
                                    <Typography.Text strong>Bàn:</Typography.Text>
                                    <p>{order?.tableName || "Không xác định"}</p>
                                </div>
                            </div>
                            <div>
                                <Typography.Text strong>Tổng giá trị:</Typography.Text>
                                <p>{(order?.totalPrice + 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            </div>
                            <div className='flex justify-between'>
                                <div className='inline-flex gap-1'>
                                    <Typography.Text strong>Mã giảm giá:</Typography.Text>
                                    <p>{order?.discountCode || 'Không áp dụng'}</p>
                                </div>
                                <div className='inline-flex gap-1'>
                                    <Typography.Text strong>Giảm giá:</Typography.Text>
                                    <p>{(order?.discountValue + 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                </div>
                            </div>

                            <div>
                                <Typography.Text strong>Thời gian tạo đơn:</Typography.Text>
                                <p>
                                    {order?.createdAt ? format(new Date(order?.createdAt), "dd-MM-yyyy HH:mm:ss") : "Không xác định"}
                                </p>
                            </div>
                            <div>
                                <Typography.Text strong>Thời gian kết thúc:</Typography.Text>
                                <p>
                                    {order?.endedAt ? format(new Date(order?.endedAt), "dd-MM-yyyy HH:mm:ss") : "Không xác định"}
                                </p>
                            </div>
                            <div>
                                <Typography.Text strong>Ghi chú đơn hàng:</Typography.Text>
                                <p>{order?.note}</p>
                            </div>
                            <div className='text-xl'>
                                <Typography.Text strong>Thành tiền:</Typography.Text>
                                <p className='font-bold text-red-700'>{(order?.totalPrice - order?.discountValue).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="flex-1">
                    <Card className="shadow-lg">
                        <Typography.Title level={4} className="mb-4">Chi tiết món ăn</Typography.Title>
                        <Table
                            dataSource={orderDetails}
                            columns={columns}
                            rowKey="foodId"
                            pagination={false}
                        />
                    </Card>
                </div>
            </div>

            {/* <div className="flex justify-center space-x-4 mt-6">
                <Button type="primary" className="bg-blue-500 hover:bg-blue-600">
                    In hóa đơn
                </Button>
                <Button className="bg-gray-300 hover:bg-gray-400">
                    Quay lại
                </Button>
            </div> */}
        </div>
    );
}
