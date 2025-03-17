import React from "react";
import { FaCalendarDay, FaDollarSign } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { MdArrowUpward, MdOutlineHome } from "react-icons/md";
import { PiHouseLine } from "react-icons/pi";
import { Bar } from "react-chartjs-2";
import LineChart from "./LineChart"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import OrderTable from "../../components/home/OrderTable";
import SalesLeaderBoard from "../../components/home/SalesLeaderBoard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
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
    ],
    datasets: [
      {
        label: "Subscriptions",
        data: [64, 27, 83, 90, 87, 85, 70, 40, 32, 74, 65, 70],
        backgroundColor: "#3FC7EE",
        borderColor: "#A1A1A1",
        borderWidth: 1,
        barThickness: 24,
        maxBarThickness: 24,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: "#A1A1A1",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
          suggestedMin: 0,
          suggestedMax: 100,
        },
        grid: {
          display: true,
          lineWidth: 2,
        },
      },
    },
  };

  return (
    <div className="">
      <div className="flex gap-10   rounded-lg">
        {/* Line Chart Section */}
        <div className=" flex-1 w-2/3 bg-gradient-to-r from-primary  to-secondary p-6 rounded-lg ">
          <h2 className="text-xl font-bold text-white mb-4">Total Revenue</h2>
          <LineChart />
        </div>
        {/* Card Section */}
        <div className="grid grid-cols-2 w-1/3 gap-6 h-[340px] bg-gradient-to-r from-primary  to-secondary p-6 rounded-lg">
          <div className="bg-white rounded-lg py-0 px-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-center text-xl font-bold mb-3">Total Sales</h2>
                <h3 className="text-primary text-3xl font-bold">$12100</h3>
              </div>
              <div className="w-16 h-16 rounded-full text-[#37C779] flex items-center justify-center">
                <MdArrowUpward color="" size={24} />
                <p>12%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg py-0 px-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-center text-xl font-bold mb-3">Total Order</h2>
                <h3 className="text-primary text-3xl font-bold">$12100</h3>
              </div>
              <div className="w-16 h-16 rounded-full text-[#37C779] flex items-center justify-center">
                <MdArrowUpward color="" size={24} />
                <p>12%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg py-0 px-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-center text-xl font-bold mb-3">Commission</h2>
                <h3 className="text-primary text-3xl font-bold">$12100</h3>
              </div>
              <div className="w-16 h-16 rounded-full text-[#37C779] flex items-center justify-center">
                <MdArrowUpward color="" size={24} />
                <p>12%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg py-0 px-2 flex items-center justify-between gap-4">
            <div className="flex items-center  gap-3">
              <div>
                <h2 className="text-center text-xl font-bold mb-3">Retailers</h2>
                <h3 className="text-primary text-3xl font-bold">$12100</h3>
              </div>
              <div className="w-16 h-16 rounded-full text-[#37C779] flex items-center justify-center">
                <MdArrowUpward color="" size={24} />
                <p>12%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-10 mt-16">
        <OrderTable />
        <SalesLeaderBoard />
      </div>
    </div>
  );
};

export default Home;
