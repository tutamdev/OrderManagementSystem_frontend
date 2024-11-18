import React, { useEffect } from 'react';
import { Button, Form, Input, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { createCategory } from '../../../services/admin_services/CategoryService';

export const ModalCreateCategory = ({ handleCancel, fetchAllCategory }) => {
    const [form] = Form.useForm();

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = async (categoryName) => {
        try {
            const response = await createCategory(categoryName);
            if (response.data.code === 200) {
                notification.success({
                    message: "Tạo khu thể loại món thành công"
                });
                form.resetFields();
                handleCancel();
                fetchAllCategory();
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
                // name="basic"
                labelCol={{
                    span: 7,
                }}
                style={{
                    maxWidth: 600,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Tên thể loại món"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng điền tên thể loại món',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <div className='flex gap-2 justify-end'>
                    <Button onClick={handleClose} type=''>Huỷ</Button>
                    <Button type="primary" htmlType="submit">
                        Tạo mới
                    </Button>
                </div>
            </Form>
        </>
    );
};
