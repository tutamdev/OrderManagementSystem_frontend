
import React, { useEffect } from 'react';
import { Button, Form, Input, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { updateArea } from '../../../services/admin_services/AreaService';

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export const ModalUpdateArea = ({ handleUpdateCancel, fetchAllArea, areaUpdate }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            areaId: areaUpdate.areaId,
            areaName: areaUpdate.areaName,
            description: areaUpdate.description
        })
    }, [areaUpdate, form])

    const onFinish = async (areaUpdate) => {
        try {
            const response = await updateArea(areaUpdate);
            if (response.data.code === 200) {
                notification.success({
                    message: "Cập nhật khu vực thành công",
                    description: "Cập nhật khu vực thành công"
                });
                form.resetFields();
                handleUpdateCancel();
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
        handleUpdateCancel();
    };

    return (
        <>
            <Form
                form={form}
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
                    name="areaId"
                    hidden
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Tên khu vực"
                    name="areaName"
                >
                    <Input readOnly />
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
                        Submit
                    </Button>
                </div>
            </Form>
        </>
    );
};
