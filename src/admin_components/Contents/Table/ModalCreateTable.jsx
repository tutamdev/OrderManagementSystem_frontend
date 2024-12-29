import React from 'react'
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { createTableByAreaId } from '../../../services/admin_services/TableService';
export const ModalCreateTable = ({ areaId, handleCancel, fetchTables }) => {
    const [form] = useForm();
    const { Option } = Select;
    const onFinish = async (table) => {
        console.log(table);
        try {
            const response = await createTableByAreaId(areaId, table);
            if (response.data.code === 200) {
                console.log("table", response.data.result);
                fetchTables();
                handleCancel();
                form.resetFields();
            }
        } catch (error) {

        }
        console.log('Success:', table);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
            <Form
                name="basic"
                labelCol={{
                    span: 4,
                }}
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Tên bàn"
                    name="tableName"
                    rules={[
                        {
                            required: true,
                            message: 'Tên bàn không được để trống!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="status"
                    initialValue="AVAILABLE"
                    hidden={true}
                >
                </Form.Item>
                <div className='flex gap-2 justify-end'>
                    <Button onClick={handleCancel} type=''>Huỷ</Button>
                    <Button type="primary" htmlType="submit">
                        Tạo bàn ăn mới
                    </Button>
                </div>
            </Form>
        </>
    )
}
