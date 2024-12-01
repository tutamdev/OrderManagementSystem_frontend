import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Table } from "antd";
import { format } from 'date-fns';
import { getAllOrderByShiftIdCompleted } from '../../../services/admin_services/OrderService';

export const ManageOrder = () => {
    const { shiftId } = useParams();
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);
    const columns = [
        {
            title: 'Mã hoá đơn',
            dataIndex: 'orderId',
            key: 'orderId',
            align: 'center',
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (time) => {
                return format(new Date(time), "dd-MM-yyyy HH:mm:ss");
            }
        },
        {
            title: 'Thời gian thanh toán',
            dataIndex: 'endedAt',
            key: 'endedAt',
            align: 'center',
            render: (time) => {
                return format(new Date(time), "dd-MM-yyyy HH:mm:ss");
            }
        },
        {
            title: 'Hoá đơn',
            dataIndex: 'totalPrice',
            key: 'price',
            align: 'center',
            render: (_, record) => {
                const finalPrice = record.totalPrice - record.discountValue;
                return finalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            }
        },
        {
            title: 'Chức năng',
            key: 'orderId',
            align: 'center',
            render: (_, record) => (
                <Link to={`${record.orderId}`}>
                    <Button variant='filled' >Xem chi tiết hoá đơn</Button>
                </Link>
            )
        },
    ];

    const fetchOrder = async () => {
        try {
            const response = await getAllOrderByShiftIdCompleted(shiftId);
            if (response.data.code === 200) {
                setDataSource(response.data.result);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        document.title = "Quản lý hoá đơn";
        fetchOrder();
    }, [])
    return (
        <div>
            <div className='flex border-b p-2'>
                <Button
                    variant='filled'
                    color='primary'
                    onClick={() => { navigate(-1) }}
                >
                    Trở về
                </Button>
                <p className='flex-grow ml-2 text-2xl'>Quản lý hoá đơn</p>
                {/* <Button
                        variant='filled'
                        color='primary'
                        onClick={handleCreateArea}
                    >
                        Tạo mới thể loại món
                    </Button> */}
            </div>
            <Table dataSource={dataSource} columns={columns} rowKey="orderId" pagination={{ position: ["bottomCenter"], pageSize: 8 }} />
        </div>
    )
}
