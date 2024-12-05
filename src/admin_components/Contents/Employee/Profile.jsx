import React, { useEffect, useState } from "react";
import { Button, Form, Input, notification, Select, Tag } from "antd";
import { getMyInfor, updateInformation } from "../../../services/EmployeeService";

export const Profile = () => {
    const [user, setUser] = useState();
    const [form] = Form.useForm();

    useEffect(() => {
        document.title = "Thông tin cá nhân";
        fetchUserInfor();
    }, []);

    const fetchUserInfor = async () => {
        try {
            const response = await getMyInfor();
            if (response.data.code === 200) {
                const userData = response.data.result;
                setUser(userData);
                form.setFieldsValue(userData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateInfo = async () => {
        const user = await form.validateFields();
        try {
            const response = await updateInformation(user);
            if (response.data.code === 200) {
                notification.success({
                    message: "Cập nhật thành công!"
                })
            }
        } catch (error) {
            console.log(error);
            notification.error({
                message: error.response.data.message
            })
        }
    }

    const roleOptions = [
        {
            value: "EMPLOYEE",
            label: <span style={{ color: "rgb(14 165 233)" }}>EMPLOYEE</span>,
        },
        {
            value: "ADMIN",
            label: <span style={{ color: "rgb(219 39 119)" }}>ADMIN</span>,
        },
    ];

    const statusOptions = [
        {
            value: "ACTIVE",
            label: <Tag style={{ lineHeight: "28px" }} color={"green"}>
                Đã kích hoạt
            </Tag>,
        },
        {
            value: "INACTIVE",
            label: <Tag style={{ lineHeight: "28px" }} color={"red"}>
                Chưa kích hoạt
            </Tag>,
        },
        {
            value: "SUSPENDED",
            label: <Tag style={{ lineHeight: "28px" }} color={"gray"}>
                Không hoạt động
            </Tag>,
        },
    ];

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    return (
        <div>
            <div className='flex border-b p-2'>
                <p className='flex-grow ml-2 text-2xl'>Quản lý thông tin cá nhân</p>
            </div>
            <div className="h-[calc(100vh-105px)] bg-gray-100 flex items-center justify-center">
                <div className="p-6 min-w-96 bg-white shadow-md rounded-md max-w-md mx-auto">
                    <Form
                        form={form}
                        {...formItemLayout}
                        initialValues={{
                            username: user?.username,
                            fullName: user?.fullName,
                            role: user?.role,
                            status: user?.status,
                        }}
                    >
                        <Form.Item label="Tên đăng nhập" name="username">
                            <Input readOnly disabled />
                        </Form.Item>

                        <Form.Item label="Họ và tên" name="fullName">
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu cũ"
                            name="oldPassword"
                            rules={[
                                {
                                    required: true,
                                    message: "Mật khẩu không được để trống!",
                                }
                            ]}
                        >
                            <Input.Password
                                placeholder="Enter password"
                                autoComplete="current-password"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[
                                {
                                    required: true,
                                    message: "Mật khẩu không được để trống!",
                                },
                                {
                                    min: 6,
                                    message: "Mật khẩu cần tối thiểu 6 ký tự!",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Enter password"
                                autoComplete="current-password"
                            />
                        </Form.Item>

                        {/* Role */}
                        <Form.Item label="Quyền" name="role">
                            <Select options={roleOptions} />
                        </Form.Item>

                        {/* Status */}
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[{ required: true, message: 'Please input!' }]}
                        >
                            <Select
                                variant='borderless'
                                options={statusOptions} />
                        </Form.Item>
                    </Form>
                    <div className="flex justify-center">
                        <Button onClick={handleUpdateInfo} type="dashed">Cập nhật thông tin</Button>
                    </div>
                </div>
            </div>
        </div>

    );
};
