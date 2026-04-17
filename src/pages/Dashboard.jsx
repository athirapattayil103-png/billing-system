import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const p = await axios.get("http://localhost:3000/products");
    const s = await axios.get("http://localhost:3000/sales");
    const pu = await axios.get("http://localhost:3000/purchases");
    const e = await axios.get("http://localhost:3000/expenses");

    setProducts(p.data);
    setSales(s.data);
    setPurchases(pu.data);
    setExpenses(e.data);
  };

  // 🔥 CALCULATIONS
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalIncome = sales.reduce((sum, s) => sum + s.total, 0);
  const totalPurchase = purchases.reduce((sum, p) => sum + p.cost, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalIncome - totalPurchase - totalExpense;

  const data = [
    { name: "Income", value: totalIncome },
    { name: "Purchase", value: totalPurchase },
    { name: "Expense", value: totalExpense },
  ];

  const colors = ["#3b82f6", "#60a5fa", "#93c5fd"];

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard 📊
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Stock</p>
          <h2 className="text-2xl font-bold text-blue-600">{totalStock}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Income</p>
          <h2 className="text-2xl font-bold text-green-600">₹{totalIncome}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Expense</p>
          <h2 className="text-2xl font-bold text-red-500">₹{totalExpense}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Profit / Loss</p>
          <h2
            className={`text-2xl font-bold ${
              profit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹{profit}
          </h2>
        </div>

      </div>

      {/* GRAPH */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Business Analytics 📈
        </h2>

        <ResponsiveContainer width="100%" height={300}>
  <BarChart data={data} barCategoryGap="30%">
    
    <XAxis dataKey="name" stroke="#6b7280" />
    <YAxis stroke="#6b7280" />
    <Tooltip />

    <Bar dataKey="value" barSize={90} radius={[10, 10, 0, 0]}>
      {data.map((entry, index) => (
        <Cell key={index} fill={colors[index]} />
      ))}
    </Bar>

  </BarChart>
</ResponsiveContainer>

      </div>

    </div>
  );
};

export default Dashboard;