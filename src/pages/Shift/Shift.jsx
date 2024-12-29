import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createShift, getActiveShift } from '../../services/ShiftService';
import { useNavigate } from 'react-router-dom';
import LocalStorageService from '../../services/LocalStorageService';

function Shift() {
    const navigate = useNavigate();
    const [enable, setEnable] = useState(false);
    const [currentShift, setCurrentShift] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = checkCurrentShift();
    }, []);

    const checkCurrentShift = async () => {
        try {        
            const response = await getActiveShift();
            setCurrentShift(response.data.result);
            // Check if there is no active shift and create a new one
            if (response.data.code === 1012) {
                setEnable(true);
                await createShift(); // Create a new shift if none exists
                toast.success('Mở ca làm việc thành công!'); // Notify success
            }
            else {
                // If there is an active shift, set enable to true
                setEnable(true);
            }          
        } catch (error) {
            console.error('Error checking shift:', error);
        } finally {
            setLoading(false);
        }
    };

    // Component màn hình mở ca
    const OpenShiftScreen = () => {
        const currentDate = new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        return (
            <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                        <div className="max-w-md mx-auto">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Mở Ca Làm Việc
                                </h1>
                                <p className="text-gray-600">
                                    {currentDate}
                                </p>
                            </div>

                            {/* Status Message */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            Hiện đang không có ca làm việc
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Open Shift Button */}
                            <div className="mt-8">
                                <button
                                    onClick={handleOpenShift}
                                    className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Mở Ca
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Component màn hình vào làm việc
    const WorkingScreen = () => (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                    <div className="max-w-md mx-auto text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Ca Làm Việc Đang Diễn Ra
                        </h2>
                        <div className="mb-6">
                            <p className="text-gray-600">Thời gian bắt đầu: {currentShift.startTime}</p>
                        </div>
                        <button
                            onClick={handleStartWorking}
                            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors w-full"
                        >
                            Vào Làm Việc
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleOpenShift = async () => {
        try {
            const response = await createShift();
            LocalStorageService.setItem("shiftId", response.data.result.shiftId);
            toast.success('Mở ca làm việc thành công!');
            // checkCurrentShift(); // Refresh shift status
            navigate("/");
        } catch (error) {
            toast.error('Có lỗi xảy ra khi mở ca!');
            console.error(error);
        }
    };

    const handleStartWorking = () => {
        toast.success('Bắt đầu làm việc!');
        navigate("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <>
            {enable ? <WorkingScreen /> : <OpenShiftScreen />}
        </>
    );
}

export default Shift;