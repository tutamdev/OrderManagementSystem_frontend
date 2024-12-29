import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueHorizontalBarChart = ({ data }) => {
    const labels = data.map((shift) => `Ca ${shift.shiftId.slice(0, 8)}`);
    const revenues = data.map((shift) =>
        shift.orders.reduce((sum, order) => sum + order.totalPrice, 0)
    );

    const chartData = {
        labels,
        datasets: [
            {
                label: "Doanh thu",
                data: revenues,
                backgroundColor: ["#4CAF50", "#FFC107", "#2196F3"],
                borderColor: ["#4CAF50", "#FFC107", "#2196F3"],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: "y",
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "So sánh doanh thu giữa các ca" },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default RevenueHorizontalBarChart;
