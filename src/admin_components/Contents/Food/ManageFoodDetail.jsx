import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, Button, Select, notification } from 'antd';
import { deleteFood, updateFood } from '../../../services/admin_services/FoodService';

const { TextArea } = Input;

export const ManageFoodDetail = ({ category, handleUpdateCancel, fetAllFoodByCategoryId, foodUpdate }) => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(''); // State để lưu link ảnh

    useEffect(() => {
        form.setFieldsValue({
            foodName: foodUpdate.foodName,
            foodPrice: foodUpdate.foodPrice,
            description: foodUpdate.description,
            imageUrl: foodUpdate.imageUrl,
            availability: foodUpdate.availability
        });
        setImageUrl(foodUpdate.imageUrl)
    }, [form, foodUpdate])

    const handleFinish = async (food) => {
        try {
            const response = await updateFood(foodUpdate.foodId, food);
            if (response.data.code === 200) {
                notification.success({ message: "Cập nhật món thành công!" })
            }
            fetAllFoodByCategoryId();
            handleUpdateCancel();
            form.resetFields();
            setImageUrl('');
        } catch (error) {
            notification.warning({ message: "Cập nhật món thất bại!" });
            console.log(error);
        }
    };
    const handleDeteteFood = async () => {
        try {
            const response = await deleteFood(foodUpdate.foodId);
            if (response.data.code === 200) {
                handleUpdateCancel();
                fetAllFoodByCategoryId();
                form.resetFields();
                notification.success({ message: "Xoá thành công!" });
            }
        } catch (error) {
            notification.warning({ message: "Xoá thất bại" });
            console.log(error);
        }
    }
    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
    };

    return (
        <div>
            <Form
                form={form}
                labelCol={{
                    span: 5,
                }}
                onFinish={handleFinish}
                className="space-y-4"
            >

                {/* Category */}
                <Form.Item
                    label="Thể loại"
                    name="category"
                    initialValue={category.name}
                >
                    <Input readOnly disabled />
                </Form.Item>

                <Form.Item
                    label="Tên món"
                    name="foodName"
                    rules={[{ required: true, message: 'Vui lòng nhập tên món' }]}
                >
                    <Input placeholder="Tên món" />
                </Form.Item>

                {/* Food Price */}
                <Form.Item
                    label="Giá thành"
                    name="foodPrice"
                    rules={[
                        { required: true, message: 'Vui lòng nhập giá' },
                        { type: 'number', min: 0, message: 'Giá phải lớn hơn 0' },
                    ]}
                >
                    <InputNumber
                        placeholder="Vui lòng nhập giá"
                        className="w-[30%]"
                        formatter={(value) =>
                            `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={(value) => value.replace(/[₫\s,]/g, '')}
                    />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                    <TextArea placeholder="Mô tả" rows={1} />
                </Form.Item>
                <Form.Item
                    label="Còn trong kho"
                    name="availability"
                    valuePropName="checked"

                >
                    <Switch
                        checkedChildren="Còn"
                        unCheckedChildren="Không còn"
                    />
                </Form.Item>
                <Form.Item
                    label="IMAGE URL"
                    name="imageUrl"
                    rules={[
                        { required: true, message: 'Image URL' },
                        { type: 'url', message: 'Vui lòng nhập địa chỉ hình ảnh zô' },
                    ]}
                >
                    <Input
                        placeholder="Enter image URL"
                        onChange={handleImageUrlChange}
                    />
                </Form.Item>

                {imageUrl && (
                    <div className="my-4">
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="max-w-full h-48 object-cover rounded shadow-md mx-auto"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=No+Image')}
                        />
                    </div>
                )}

                <div className='flex justify-between'>
                    <div>
                        <Button danger onClick={handleDeteteFood}>Xoá</Button>
                    </div>
                    <div className='flex gap-2'>
                        <Button onClick={handleUpdateCancel} type=''>Huỷ</Button>
                        <Button type="primary" htmlType='submit'>
                            Cập nhật
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};
