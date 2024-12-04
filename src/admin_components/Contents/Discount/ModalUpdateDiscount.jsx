import React, { useEffect } from 'react';
import { Button, Form, Input, notification, Select, Switch } from 'antd';
import { updateDiscount } from '../../../services/admin_services/DiscountService';
export const ModalupdateDiscount = ({ handleCancel, fetchDiscount, discountUpdate }) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(() => {
        form.setFieldsValue({
            discountCode: discountUpdate.discountCode,
            discountType: discountUpdate.discountType,
            discountValue: discountUpdate.discountValue,
            status: discountUpdate.status
        })
    }, [discountUpdate, form])

    const onFinish = async (discount) => {
        try {
            const response = await updateDiscount(discount);
            if (response.data.code == 200) {
                handleCancel();
                form.resetFields();
                notification.success(({
                    message: "Cập nhật thành công!"
                }))
            }
            fetchDiscount();
        } catch (error) {
            notification.error(({
                message: "Cập nhật không công thành công!",
                description: "Discount không tồn tại!"
            }))
        }
    };

    return (
        <>
            <Form
                form={form}
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
                    label="Discount Code"
                    name="discountCode"
                    rules={[{ required: true, message: "Please enter discount code!" }]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Discount Type"
                    name="discountType"
                    initialValue="FIXED"
                    rules={[{ required: true, message: "Please select discount type!" }]}
                >
                    <Select>
                        <Select.Option value="PERCENT">Percent</Select.Option>
                        <Select.Option value="FIXED">Fixed</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Discount Value"
                    name="discountValue"
                    rules={[{ required: true, message: "Please enter discount value!" }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="status" label="Status" initialValue={true}>
                    <Switch />
                </Form.Item>
                <div className='flex gap-2 justify-end'>
                    <Button onClick={handleCancel} type=''>Huỷ</Button>
                    <Button type="primary" htmlType="submit">
                        Cập nhật
                    </Button>
                </div>
            </Form>
        </>
    )
}
