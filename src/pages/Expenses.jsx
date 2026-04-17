import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Expenses = () => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [tab, setTab] = useState("entry");

  // 🔥 FETCH
  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:3000/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ➕ ADD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount) {
      toast.error("Fill all fields ❌");
      return;
    }

    await axios.post("http://localhost:3000/expenses", {
      ...form,
      amount: Number(form.amount),
      date: new Date().toISOString(),
    });

    toast.success("Expense added 💸");

    setForm({ title: "", amount: "" });
    fetchExpenses();
  };

  // 📊 CALCULATIONS
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Expenses 💸</h1>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("entry")}
          className={`px-4 py-2 rounded ${
            tab === "entry" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          Add Expense
        </button>

        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 rounded ${
            tab === "history" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          History
        </button>
      </div>

      {/* ENTRY */}
      {tab === "entry" && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* FORM */}
          <div className="bg-white p-5 rounded-xl shadow">

            <h2 className="font-semibold mb-3">Add Expense</h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                placeholder="Expense title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border p-2 w-full rounded"
              />

              <input
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="border p-2 w-full rounded"
              />

              <button className="bg-red-500 text-white w-full p-2 rounded">
                Add Expense
              </button>

            </form>
          </div>

          {/* RECENT */}
          <div className="bg-white p-5 rounded-xl shadow">

            <h2 className="font-semibold mb-3">Recent Expenses</h2>

            {expenses.slice(-5).reverse().map((e) => (
              <div key={e.id} className="flex justify-between border-b py-2 text-sm">
                <p>{e.title}</p>
                <p>₹{e.amount}</p>
              </div>
            ))}

          </div>

        </div>
      )}

      {/* HISTORY */}
      {tab === "history" && (
        <div className="bg-white p-5 rounded-xl shadow">

          {/* CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">

            <div className="bg-gray-100 p-3 rounded text-center">
              <p>Total Expense</p>
              <h2 className="font-bold">₹{total}</h2>
            </div>

            <div className="bg-gray-100 p-3 rounded text-center">
              <p>Count</p>
              <h2 className="font-bold">{expenses.length}</h2>
            </div>

          </div>

          {/* TABLE */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th>#</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((e, i) => (
                <tr key={e.id} className="border-b">
                  <td>{i + 1}</td>
                  <td>{e.title}</td>
                  <td>₹{e.amount}</td>
                  <td>{new Date(e.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

    </div>
  );
};

export default Expenses;