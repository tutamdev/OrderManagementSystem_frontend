import React, { useEffect, useState } from 'react';
import {

    Button,
    Form,
    Input,
    notification,
    Select,
    Tag,
} from 'antd';
import { updateEmployee } from '../../../services/EmployeeService';
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    },
};
export const ModalActionEmployee = ({ setIsModalOpen, employeeDetail, fetchEmployees }) => {

    const [form] = Form.useForm();
    const options = [
        {
            value: "EMPLOYEE",
            label: <span style={{ color: "rgb(14 165 233)" }}>EMPLOYEE</span>
        }, {
            value: "ADMIN",
            label: <span style={{ color: "rgb(219 39 119)" }}>ADMIN</span>
        },
    ];
    const tagOptions = [
        {
            value: "ACTIVE",
            label: <Tag style={{ lineHeight: '28px' }} color={"green"} >Đã kích hoạt</Tag>
        }, {
            value: "INACTIVE",
            label: <Tag style={{ lineHeight: '28px' }} color={"red"} >Chưa kích hoạt</Tag>
        }, {
            value: "SUSPENDED",
            label: <Tag style={{ lineHeight: '28px' }} color={"gray"} >Không hoạt động</Tag>
        }
    ];

    const handleShowModal = () => {
        setIsModalOpen(false);
    }
    const handleOK = async () => {
        try {
            const employeeUpdate = await form.validateFields();
            const response = await updateEmployee(employeeUpdate);
            console.log(response);
            if (response.data.code === 200) {
                notification.success({
                    message: "Cập nhật thành công",
                    description: "Cập nhật thành công"
                });
            }
            fetchEmployees();
            setIsModalOpen(false);
        } catch (error) {
            notification.error({
                message: "Cập nhật thất bại",
                description: "Cập nhật không thành công"
            });
        }
    }
    // Sử dụng useEffect để cập nhật form khi employeeDetail thay đổi
    useEffect(() => {
        // Cập nhật giá trị ban đầu của form khi employeeDetail thay đổi
        form.setFieldsValue({
            id: employeeDetail?.id,
            username: employeeDetail.username,
            fullName: employeeDetail?.fullName,
            role: employeeDetail?.role,
            status: employeeDetail.status
        });
    }, [employeeDetail, form]);

    return (
        <Form
            {...formItemLayout}
            variant="filled"
            form={form}
            style={{
                maxWidth: 600,
            }}
        >
            <Form.Item
                label="Mã nhân viên"
                name="id"
            >
                <Input value={employeeDetail.id} readOnly disabled />
            </Form.Item>
            <Form.Item
                label="Mã nhân viên"
                name="username"

            >
                <Input
                    style={{ color: "#000" }}
                    variant='borderless'
                    value={employeeDetail.username} readOnly disabled />
            </Form.Item>

            <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <Input value={employeeDetail.fullName} />

            </Form.Item>

            <Form.Item
                label="Quyền"
                name="role"
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <Select
                    value={employeeDetail.role}
                    style={{
                        width: '50%'
                    }}
                    options={options} />
            </Form.Item>
            <Form.Item
                label="Trạng thái"
                name="status"
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <Select
                    value={employeeDetail.status}
                    variant='borderless'
                    style={{
                        width: '50%',
                    }}

                    options={tagOptions} />
            </Form.Item>
            <div className='flex gap-3 flex-row-reverse'>
                <Button onClick={handleOK} type='primary'>OK</Button>
                <Button onClick={handleShowModal}>Cancel</Button>
            </div>
        </Form>
    );
}
