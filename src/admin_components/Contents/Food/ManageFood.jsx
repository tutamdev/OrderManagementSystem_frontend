import { Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ModalCreateFood } from './ModalCreateFood';
import { getAllFoodByCategoryId } from '../../../services/admin_services/FoodService';
import { ManageFoodDetail } from './ManageFoodDetail';

export const ManageFood = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const { category } = location.state || {};
    const [foodUpdate, setFoodUpdate] = useState();
    const [foodData, setFoodData] = useState([]);
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleUpdateCancel = () => {
        setIsModalUpdateOpen(false);
    };
    const hanldeCreateFood = () => {
        setIsModalOpen(true);
    }
    const handleViewDetail = (foodId) => {
        const foodSeleted = foodData.find((item) => item.foodId === foodId);
        setIsModalUpdateOpen(true);
        setFoodUpdate(foodSeleted);
    }
    const fetAllFoodByCategoryId = async () => {
        try {
            const response = await getAllFoodByCategoryId(categoryId);
            if (response.data.code === 200) {
                setFoodData(response.data.result);
            }
        } catch (error) {
            console.log(object);
        }
    }
    useEffect(() => {
        fetAllFoodByCategoryId();
    }, [])


    return (
        <div>
            <div className='flex border-b p-2 justify-between'>
                <Button
                    variant='filled'
                    color='primary'
                    onClick={() => { navigate(-1) }}
                >
                    Trở về
                </Button>
                {/* <h2>Trà sữa</h2> */}
                <Button
                    variant='filled'
                    color='primary'
                    onClick={hanldeCreateFood}
                >
                    Tạo món ăn mới
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 p-3">
                {
                    foodData.map((food) => (
                        <div key={food.foodId} className="border shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl">
                            <div className="relative">
                                <img
                                    src={food.imageUrl}
                                    alt="food-image"
                                    className="w-full h-36 object-cover"
                                />
                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-lg rounded">
                                    {food.foodPrice + " VNĐ"}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col space-y-2">
                                <h2 className="font-bold text-lg text-gray-800 truncate">
                                    {food.foodName}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {food.description}
                                </p>
                                <button onClick={() => handleViewDetail(food.foodId)} className="mt-auto bg-green-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-green-600 transition-colors">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
            <Modal title="Tạo món" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <ModalCreateFood category={category} handleCancel={handleCancel} fetAllFoodByCategoryId={fetAllFoodByCategoryId} />
            </Modal>
            <Modal title="Chi tiết món" open={isModalUpdateOpen} onCancel={handleUpdateCancel} footer={null}>
                <ManageFoodDetail category={category} handleUpdateCancel={handleUpdateCancel} fetAllFoodByCategoryId={fetAllFoodByCategoryId} foodUpdate={foodUpdate} />
            </Modal>
        </div>
    )

}
