import { useState, useEffect, useRef } from 'react';
import { getAllFoodsByCategoryId } from '../../../services/FoodService';
import FoodDetail from './FoodDetail';
import '../../../assets/Menu/Menu.css';
import { getAllCategories } from '../../../services/CategoryService';
import SideMenu from '../../Side/SideMenu';

function Food({onAddToCart, orderId}){
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [foods, setFoods] = useState([]); // State để lưu trữ món ăn
    const categoryRefs = useRef({});

    //convert data to print addorder
    // const [addOrderDetail, setAddOrderDetail] = useState([]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories(response.data.result); // Giả sử response.data.result chứa danh sách categories
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Hàm để lấy món ăn theo categoryId
    const fetchFoodsByCategory = async (categoryId) => {
        try {
            const response = await getAllFoodsByCategoryId(categoryId); // Gọi API để lấy món ăn theo categoryId
            return response.data.result; // Giả sử response.data.result chứa danh sách món ăn
        } catch (error) {
            console.error('Error fetching foods:', error);
            return []; // Trả về mảng rỗng nếu có lỗi
        }
    };

    // Gọi hàm fetchFoodsByCategory cho từng category
    useEffect(() => {
        const loadFoods = async () => {
            const allFoods = [];
            for (const category of categories) {
                const foodsForCategory = await fetchFoodsByCategory(category.categoryId);
                allFoods.push(...foodsForCategory); // Thêm món ăn vào mảng allFoods
            }
            setFoods(allFoods); // Cập nhật state foods
        };

        if (categories.length > 0) {
            loadFoods(); // Gọi hàm loadFoods khi categories đã được lấy
        }
    }, [categories]);

    // scroll food when click category
    const scrollToCategory = (categoryId) => {
        if (categoryRefs.current[categoryId]) {
            categoryRefs.current[categoryId].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };

    return (
        <div>
            <SideMenu onCategoryClick={scrollToCategory} />
            
            <div className="fixed-container">
                {categories.map(category => (
                    <div 
                        key={category.categoryId}
                        ref={(el) => categoryRefs.current[category.categoryId] = el}
                    >
                        <h2 className='text-2xl font-bold text-white bg-orange-500 border-b-2 border-gray-200 p-2'>
                            {category.name}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 ">
                            {foods
                                .filter(food => food.category.categoryId === category.categoryId)
                                .map(food => (
                                    <FoodDetail
                                        key={food.foodId}
                                        foodId={food.foodId}
                                        foodName={food.foodName}
                                        foodPrice={food.foodPrice}
                                        imgUrl={food.imageUrl}
                                        available={food.available}
                                        quantity={1}
                                        onFoodClick={onAddToCart}
                                        orderId={orderId}
                                    />
                                ))
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Food;
