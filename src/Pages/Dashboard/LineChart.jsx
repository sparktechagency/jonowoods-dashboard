// LineChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
);

const LineChart = () => {
  // Data for the line chart
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ], // Months
    datasets: [
      {
        label: "Total Revenue",
        data: [150, 120, 145, 160, 180, 387, 225, 210, 230, 126, 250, 300],
        fill: false, 
        borderColor: "#ffffff",
        backgroundColor: "transparent", 
        tension: 0.4, 
        borderWidth: 2, 
        pointBorderColor: "#ffffff", 
        pointBackgroundColor: "#ffffff", 
        pointRadius: 4, 
      },
    ],
  };

  // Options for the chart
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      labels: {
        color: "#ffffff",
      },
    },
    tooltip: {
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      borderColor: "#ffffff",
      borderWidth: 2,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 15, 
      cornerRadius: 8,
      displayColors: false,
      bodyFont: {
        size: 16, 
      },
      boxPadding: 10, 
      callbacks: {
        label: (context) => `$${context.raw.toLocaleString()}`.padEnd(15, " "), // ✅ Add spaces to expand width
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
        color: "rgba(255, 255, 255, 0.2)", 
      },
      ticks: {
        color: "#ffffff", 
      },
    },
    y: {
      grid: {
        display: false,
      },
      beginAtZero: false,
      ticks: {
        color: "#ffffff", 
        padding: 32, 
        callback: function (value) {
          return `$${value.toLocaleString()}`;
        },
      },
    },
  },
};



  return (
    <div style={{ width: "100%", height: "250px" }} className="text-white">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
