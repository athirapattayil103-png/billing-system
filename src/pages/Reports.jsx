import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api";

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [totalSales, setTotalSales] = useState(0);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // 🔥 FETCH ALL DATA
  const fetchData = async () => {
    const s = await axios.get(`${BASE_URL}/sales`);
    const p = await axios.get(`${BASE_URL}/purchases`);
    const e = await axios.get(`${BASE_URL}/expenses`);

    setSales(s.data);
    setPurchases(p.data);
    setExpenses(e.data);

    // ✅ CALCULATIONS
    const salesTotal = s.data.reduce((sum, i) => sum + i.total, 0);
    const purchaseTotal = p.data.reduce((sum, i) => sum + i.total, 0);
    const expenseTotal = e.data.reduce((sum, i) => sum + i.amount, 0);

    setTotalSales(salesTotal);
    setTotalPurchase(purchaseTotal);
    setTotalExpenses(expenseTotal);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 PROFIT
  const profit = totalSales - totalPurchase - totalExpenses;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Reports 📊</h1>

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Total Sales</p>
          <h2 className="text-green-600 font-bold text-xl">
            ₹{totalSales}
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Total Purchase</p>
          <h2 className="text-blue-600 font-bold text-xl">
            ₹{totalPurchase}
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Total Expenses</p>
          <h2 className="text-red-600 font-bold text-xl">
            ₹{totalExpenses}
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Profit / Loss</p>
          <h2 className={`font-bold text-xl ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
            ₹{profit}
          </h2>
        </div>

      </div>

      {/* NET RESULT */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <p className="text-gray-500">Net Result</p>
        <h2 className="text-2xl font-bold text-green-600">
          ₹{profit}
        </h2>
        <p>{profit >= 0 ? "You are in profit ✅" : "You are in loss ❌"}</p>
      </div>

      {/* COUNT CARDS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Sales Count</p>
          <h2 className="font-bold text-xl">{sales.length}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Purchases Count</p>
          <h2 className="font-bold text-xl">{purchases.length}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Expenses Count</p>
          <h2 className="font-bold text-xl">{expenses.length}</h2>
        </div>

      </div>

    </div>
  );
};

export default Reports;