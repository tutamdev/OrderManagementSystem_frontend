import React, { useEffect } from 'react';
import { Button, Form, Input, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { createArea } from '../../../services/admin_services/AreaService';

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export const ModalCreateArea = ({ handleCancel, fetchAllArea }) => {
    const [form] = Form.useForm();

    const onFinish = async (value) => {
        try {
            const response = await createArea(value);
            if (response.data.code === 200) {
                notification.success({
                    message: "Tạo khu vực thành công",
                    description: "OK"
                });
                form.resetFields();
                handleCancel();
                fetchAllArea();
            }
        } catch (error) {
            notification.error({
                message: "Tạo khu vực không thành công",
                description: "Khu vực đã tồn tại!"
            });
        }
    };

    const handleClose = () => {
        handleCancel();
    };

    return (
        <>
            <Form
                form={form} // Đảm bảo form được truyền vào đây
                name="basic"
                labelCol={{
                    span: 5,
                }}
                style={{
                    maxWidth: 600,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Tên khu vực"
                    name="areaName"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng điền tên khu vực',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <TextArea />
                </Form.Item>
                <div className='flex gap-2 justify-end'>
                    <Button onClick={handleClose} type=''>Huỷ</Button>
                    <Button type="primary" htmlType="submit">
                        Tạo khu vực mới
                    </Button>
                </div>
            </Form>
        </>
    );
};
