import React, { useState, useEffect, useMemo } from "react";
import NavBar from "../components/NavBar";
import { FaDollarSign, FaReceipt, FaListUl } from "react-icons/fa";
import { Doughnut, Line } from "react-chartjs-2";
import API from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const res = await API.get("/expenses");
        setExpenses(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
        setError("Failed to load expenses");
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const summary = useMemo(() => {
    let total = 0;
    const categories = {};
    expenses.forEach((exp) => {
      total += exp.amount;
      const cat = exp.category || "Other";
      categories[cat] = (categories[cat] || 0) + exp.amount;
    });
    return { total, categories };
  }, [expenses]);

  const doughnutData = {
    label: Object.keys(summary.categories),
    datasets: [
      {
        data: Object.values(summary.categories),
        backgroundColor: [
          "#3b82f6",
          "#ef4444",
          "#f59e0b",
          "#10b981",
          "#8b5cf6",
          "#ec4899",
          "#6b7280",
        ],
      },
    ],
  };

  const lineData = {
    label: expenses.map((e) => new Date(e.date).toLocaleDateString()),
    datasets: [
      {
        label: "Expense Amount",
        data: expenses.map((e) => e.amount),
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  if (loading) return <div className="p-8">Loading Expenses....</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow flex items-center gap-4">
            <FaDollarSign className="text-4xl text-blue-500" />
            <div>
              <p className="text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold">${summary.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow flex items-center gap-4">
            <FaReceipt className="text-4xl text-green-500" />
            <div>
              <p className="text-gray-500">Number of Expenses</p>
              <p className="text-2xl font-bold">{expenses.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow flex items-center gap-4">
            <FaListUl className="text-4xl text-purple-500 " />
            <div>
              <p className="text-gray-500">Categories Used</p>
              <p className="text-2xl font-bold">
                {Object.keys(summary.categories).length}
              </p>
            </div>
          </div>
        </div>
        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Expense by Category</h2>
            <Doughnut data={doughnutData} />
          </div>
          <div className="bg-white rounded p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Expense Over Time</h2>
            <Line data={lineData} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-500 text-white p-6 rounded shadow text-center cursor-pointer hover:bg-blue-700">
            <a href="">View Expense</a>
          </div>
          <div className="bg-blue-500 text-white p-6 rounded shadow text-center cursor-pointer hover:bg-blue-700">
            <a href="">Add Expense</a>
          </div>
          <div className="bg-blue-500 text-white p-6 rounded shadow text-center cursor-pointer hover:bg-blue-700">
            <a href="">Upload Receipt</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
