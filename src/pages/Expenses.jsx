import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Expenses = () => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:3000/expenses", {
      ...form,
      amount: Number(form.amount),
      date: new Date().toISOString(),
    });

    toast.success("Expense added");

    setForm({ title: "", amount: "" });
  };

  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold mb-4">Expenses</h1>

      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">

        <input
          placeholder="Expense Name"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border p-2 w-full"
        />

        <button className="bg-red-500 text-white p-2 w-full">
          Add Expense
        </button>

      </form>

    </div>
  );
};

export default Expenses;