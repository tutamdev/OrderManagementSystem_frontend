function FoodPay({key, foodId, foodName, foodPrice, quantity, onQuantityChange}){
    const handleIncrease = () => {
        onQuantityChange(foodId, quantity + 1);
    };

    const handleDecrease = () => {
        onQuantityChange(foodId, quantity - 1);
    };

    return(
        <div className="flex items-center justify-start p-1 border-b border-gray-200 pt-4 pb-4">
            <div className="flex items-center">
                <div className="flex border border-gray-300">
                    <button 
                        onClick={handleDecrease}
                        className="w-5 h-5 flex items-center justify-center border-r border-gray-300 hover:bg-gray-100"
                    >
                        <span className="text-sm font-bold text-gray-500">-</span>
                    </button>
                    
                    <span className="w-6 h-5 flex items-center justify-center text-center font-semibold text-sm">
                        {quantity}
                    </span>
                    
                    <button 
                        onClick={handleIncrease}
                        className="w-5 h-5 flex items-center justify-center border-l border-gray-300 hover:bg-gray-100"
                    >
                        <span className="text-sm font-bold text-gray-500">+</span>
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between ml-2 w-full">
                <div className="font-semibold text-sm">{foodName}</div>
                <div className="text-gray-600 text-sm ">{foodPrice/1000}K</div>
            </div>
        </div>
    );
}

export default FoodPay;