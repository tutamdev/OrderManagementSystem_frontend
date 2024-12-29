import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các component cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueByShift = ({ data }) => {
    const getRevenueByShift = (shiftData) => {
        return shiftData.map((shift) => {
            const firstOrder = shift.orders[0];
            const lastOrder = shift.orders[shift.orders.length - 1];

            const totalRevenue = shift.orders.reduce((total, order) => total + order.totalPrice, 0);

            return {
                shiftId: shift.shiftId,
                totalRevenue,
                startTime: firstOrder ? firstOrder.createdAt : '',
                endTime: lastOrder ? lastOrder.endedAt : ''
            };
        });
    };

    if (!data || data.length === 0) {
        return <div>Loading...</div>;
    }

    const revenueData = getRevenueByShift(data);

    const chartData = {
        labels: revenueData.map((shift) => {
            // Chuyển đổi thời gian thành ngày và giờ
            const startDate = shift.startTime ? new Date(shift.startTime) : null;
            const endDate = shift.endTime ? new Date(shift.endTime) : null;

            return startDate && endDate
                ? `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`
                : 'N/A';
        }),
        datasets: [
            {
                label: 'Doanh thu theo ca làm việc',
                data: revenueData.map((shift) => shift.totalRevenue),
                backgroundColor: 'rgba(75, 192, 192, 0.7)', // Màu nền cho các cột
                borderColor: 'rgb(75, 192, 192)', // Màu viền của các cột
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Thời gian ca làm việc',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Doanh thu (VND)',
                },
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const revenue = context.raw; // Doanh thu
                        const index = context.dataIndex; // Index của cột đang hover

                        // Hiển thị thêm ngày tháng và doanh thu
                        const dateLabel = revenueData[index] ? revenueData[index].startTime : '';
                        const formattedDate = dateLabel ? new Date(dateLabel).toLocaleDateString() : '';

                        return `${label}: ${revenue.toLocaleString()} VND (${formattedDate})`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <h2>Doanh thu theo ca làm việc</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default RevenueByShift;
