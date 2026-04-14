import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

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

  // 📊 GRAPH DATA
  const data = [
    { name: "Income", value: totalIncome },
    { name: "Purchase", value: totalPurchase },
    { name: "Expense", value: totalExpense },
  ];

  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 shadow rounded">
          <p>Total Stock</p>
          <h2 className="text-xl font-bold">{totalStock}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p>Income</p>
          <h2 className="text-xl font-bold">₹{totalIncome}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p>Expense</p>
          <h2 className="text-xl font-bold">₹{totalExpense}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p>Profit / Loss</p>
          <h2 className={`text-xl font-bold ${profit >= 0 ? "text-green-500" : "text-red-500"}`}>
            ₹{profit}
          </h2>
        </div>

      </div>

      {/* GRAPH */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="font-semibold mb-3">Analytics</h2>

        <BarChart width={400} height={300} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>

    </div>
  );
};

export default Dashboard;