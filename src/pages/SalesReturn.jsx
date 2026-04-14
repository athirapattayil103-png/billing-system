import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const SalesReturn = () => {
  const [saleId, setSaleId] = useState("");

  const handleReturn = async () => {
    const res = await axios.get(`http://localhost:3000/sales/${saleId}`);
    const sale = res.data;

    if (!sale) {
      toast.error("Sale not found");
      return;
    }

    // 🔥 RETURN STOCK
    for (let item of sale.items) {
      const p = await axios.get(`http://localhost:3000/products/${item.id}`);

      await axios.put(`http://localhost:3000/products/${item.id}`, {
        ...p.data,
        stock: p.data.stock + item.qty,
      });
    }

    toast.success("Return completed");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Sales Return</h1>

      <input
        placeholder="Sale ID"
        value={saleId}
        onChange={(e) => setSaleId(e.target.value)}
        className="border p-2 mt-3"
      />

      <button onClick={handleReturn} className="bg-blue-500 text-white p-2 ml-2">
        Return
      </button>
    </div>
  );
};

export default SalesReturn;