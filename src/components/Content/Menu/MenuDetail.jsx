import Food from './Food';
import Pay from './Pay';
import { useState, useEffect } from 'react';


function MenuDetail(){
    const [cartItems, setCartItems] = useState([]);

    const handleAddToCart = (food) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.foodId === food.foodId);
            
            if(existingItem){
                return prevItems.map(item => 
                    item.foodId === food.foodId 
                        ? {...item, quantity: item.quantity + 1} 
                        : item
                );
            }
            
            return [...prevItems, {...food, quantity: 1}];
        });
    };

    const handleQuantityChange = (foodId, newQuantity) => {
        if (newQuantity === 0) {
            setCartItems(prevItems => 
                prevItems.filter(item => item.foodId !== foodId)
            );
        } else {
            setCartItems(prevItems => 
                prevItems.map(item => 
                    item.foodId === foodId 
                        ? {...item, quantity: newQuantity} 
                        : item
                )
            );
        }
    };
    

    return(
        <>
            <div className='flex'> 
                {/* when fooddetail component is clicked, call handleAddToCart */}
                <Food onAddToCart={handleAddToCart}/>
                {/* cartItems is the array of items in the cart, onQuantityChange is the function to handle quantity change */}
                <Pay cartItems={cartItems} onQuantityChange={handleQuantityChange}/>
            </div>
        </>
    );
};

export default MenuDetail;
