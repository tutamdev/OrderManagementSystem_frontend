import React, { useEffect } from 'react';
import { Button, Form, Input, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useForm } from 'antd/es/form/Form';
import { updateCategory } from '../../../services/admin_services/CategoryService';

export const ModalUpdateCategory = ({ categoryUpdate, handleUpdateCancel, fetchAllCategory }) => {
    const [form] = useForm();
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(() => {
        // console.log(categoryUpdate);
        form.setFieldsValue({
            categoryId: categoryUpdate.categoryId,
            name: categoryUpdate.name
        })
    }, [categoryUpdate, form])

    const onFinish = async (categoryUpdate) => {
        // console.log(categoryUpdate);
        try {
            const response = await updateCategory(categoryUpdate);
            if (response.data.code === 200) {
                notification.success({
                    message: "Cập nhật thể loại món thành công",
                    description: "Cập nhật thể loại món thành công"
                });
                form.resetFields();
                handleUpdateCancel();
                fetchAllCategory();
            }
        } catch (error) {
            notification.error({
                message: "Cập nhật không thành công",
                description: "Thể loại đã tồn tại!"
            });
            // console.log(error);
        }
    };

    const handleClose = () => {
        handleUpdateCancel();
    };
    return (
        <div>
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
                    name="categoryId"
                    hidden
                >
                    <Input />
                </Form.Item>
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
                        Cập nhật
                    </Button>
                </div>
            </Form>
        </div>
    )
}
