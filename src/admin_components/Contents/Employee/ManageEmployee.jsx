import React, { useEffect, useState } from 'react';
import { Button, Modal, Space, Table, Tag } from 'antd';
import { getAllEmployee } from '../../../services/EmployeeService';
import { ModalActionEmployee } from './ModalActionEmployee';

export const ManageEmployee = () => {
    useEffect(() => {
        document.title = "Quản lý nhân viên";
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();
    const [employeeDetail, setEmployeeDetail] = useState();
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const fetchEmployees = async () => {
        try {
            const response = await getAllEmployee();
            if (response.data.code === 200) {
                setData(response.data.result);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    };
    useEffect(() => {
        console.log("Mouted");
        fetchEmployees();
    }, []);


    const handleAction = (id) => {
        const selectedEmployee = data.find(e => e.id === id);
        setEmployeeDetail(selectedEmployee);
        showModal();
    }

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            align: 'center'
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            align: 'center'

        },
        {
            title: 'Quyền',
            dataIndex: 'role',
            key: 'role',
            align: 'center',
            render: (role) => {
                let color;
                switch (role) {
                    case 'ADMIN':
                        color = 'rgb(219 39 119)';
                        break;
                    case 'EMPLOYEE':
                        color = 'rgb(14 165 233)';
                        break;
                    default:
                        color = 'black';
                }
                return (
                    <span style={{ color }}>{role}</span>
                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => {
                let color;
                let text;
                switch (status) {
                    case "ACTIVE":
                        color = "green";
                        text = "Đã kích hoạt";
                        break;
                    case "INACTIVE":
                        color = "red";
                        text = "Chưa kích hoạt";
                        break;
                    default:
                        color = "gray";
                        text = "Không hoạt động";
                        break;
                };
                return (
                    <Tag color={color} key={status}>{text}</Tag>
                );
            }
        },
        {
            title: 'Hành động',
            key: 'id',
            dataIndex: 'id',
            align: 'center',
            render: (id) => {
                return (
                    <Button onClick={() => {
                        handleAction(id)
                    }
                    }>Chỉnh sửa</Button>
                );
            }
        }
    ];


    return (
        <div>
            <div className='p-2 border-b ml-2 text-2xl'>Quản lý nhân viên</div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id" loading={loading}
                pagination={
                    {
                        position: ['bottomCenter'],
                        pageSize: 8
                    }
                } />
            <Modal
                title="Thông tin nhân viên"
                open={isModalOpen}
                onCancel={handleCancel}
                width={600}
                footer={null}

            >
                <ModalActionEmployee
                    setIsModalOpen={setIsModalOpen}
                    employeeDetail={employeeDetail}
                    fetchEmployees={fetchEmployees}
                />

            </Modal>
        </div>
    )
}
