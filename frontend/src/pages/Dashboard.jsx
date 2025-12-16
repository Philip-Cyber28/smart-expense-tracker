import React, { useState, useEffect, useMemo } from "react";
import NavBar from "../components/NavBar";
import { FaDollarSign, FaReceipt, FaListUl } from "react-icons/fa";
import { Doughnut, Line } from "react-chartjs-2";
import API from "../services/api";
import MainCard from "../components/MainCard";
import { HiTrendingUp } from "react-icons/hi";
import { IoMdCash } from "react-icons/io";
import LoadingSpinner from "../components/LoadingSpinner";

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
    labels: Object.keys(summary.categories),
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

  const doughnutOptions = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const cat = tooltipItem.label;
            const value = tooltipItem.raw;
            const percent = ((value / summary.total) * 100).toFixed(2);
            return `${cat}: $${value} (${percent}%)`;
          },
        },
      },
    },
  };

  const lineData = useMemo(() => {
    const dates = [
      ...new Set(expenses.map((e) => new Date(e.date).toLocaleDateString())),
    ].sort();
    const categories = [...new Set(expenses.map((e) => e.category))];

    const datasets = categories.map((cat, idx) => {
      const data = dates.map((date) => {
        return expenses
          .filter(
            (e) =>
              new Date(e.date).toLocaleDateString() === date &&
              e.category === cat
          )
          .reduce((sum, e) => sum + e.amount, 0);
      });
      const colors = [
        "#3b82f6",
        "#ef4444",
        "#f59e0b",
        "#10b981",
        "#8b5cf6",
        "#ec4899",
        "#6b7280",
      ];
      return {
        label: cat,
        data,
        borderColor: colors[idx % colors.length],
        fill: false,
      };
    });
    return { labels: dates, datasets };
  }, [expenses]);

  if (loading) return <LoadingSpinner height="60vh" />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="p-2">
        <h1 className="text-3xl font-bold mt-2 mb-6 text-center">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MainCard
            title="Total Expenses"
            className="shadow-lg shadow-blue-500"
          >
            <div className="flex items-center justify-center gap-2">
              <IoMdCash className="text-4xl text-blue-500" />
              <span>${summary.total.toFixed(2)}</span>
            </div>
          </MainCard>

          <MainCard
            title="Number of Expenses"
            className="shadow-lg shadow-amber-500"
          >
            <div className="flex items-center justify-center gap-2">
              <FaReceipt className="text-4xl text-amber-500" />
              {expenses.length}
            </div>
          </MainCard>

          <MainCard title="Categories" className="shadow-lg shadow-purple-500">
            <div className="flex items-center justify-center gap-2">
              <FaListUl className="text-4xl text-purple-500 " />
              {Object.keys(summary.categories).length}
            </div>
          </MainCard>

          <MainCard
            title="Average per Transaction"
            className="shadow-lg shadow-green-500"
          >
            <div className="flex items-center justify-center gap-2">
              <HiTrendingUp className="text-4xl text-green-500 " />$
              {expenses.length > 0
                ? (summary.total / expenses.length).toFixed(2)
                : "0.00"}
            </div>
          </MainCard>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <MainCard
            title="Expense by Category"
            className="shadow-lg shadow-lime-600"
          >
            <div className="h-80">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </MainCard>

          <MainCard
            title="Expense Over Time"
            className="shadow-lg shadow-pink-500"
          >
            <div className="h-80">
              <Line data={lineData} />
            </div>
          </MainCard>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
