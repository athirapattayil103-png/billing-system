import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api";

const Suppliers = () => {
  const [purchase, setPurchase] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchPurchase();
  }, []);

  const fetchPurchase = async () => {
    const res = await axios.get(`${BASE_URL}/purchase`);
    setPurchase(res.data);
  };

  // UNIQUE SUPPLIERS
  const supplierMap = {};

  purchase.forEach((item) => {
    const name = item.supplier || "Unknown";

    if (!supplierMap[name]) {
      supplierMap[name] = {
        name,
        total: 0,
        paid: 0,
        balance: 0,
      };
    }

    supplierMap[name].total += Number(item.total || 0);
    supplierMap[name].paid += Number(item.paid || item.total || 0);
  });

  const suppliers = Object.values(supplierMap).map((s) => ({
    ...s,
    balance: s.total - s.paid,
  }));

  const visibleSuppliers = showAll
    ? suppliers
    : suppliers.slice(0, 5);

  const totalPurchase = suppliers.reduce(
    (sum, s) => sum + s.total,
    0
  );

  const totalPending = suppliers.reduce(
    (sum, s) => sum + s.balance,
    0
  );

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">
          Suppliers
        </h1>

        <button className="bg-green-600 text-white px-5 py-3 rounded-xl">
          Download PDF
        </button>
      </div>

      {/* TOP */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Suppliers</p>

          <h2 className="text-3xl font-bold">
            {suppliers.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Total Purchase</p>

          <h2 className="text-3xl font-bold text-green-600">
            ₹{totalPurchase}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Pending</p>

          <h2 className="text-3xl font-bold text-red-500">
            ₹{totalPending}
          </h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#0f172a] text-white">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left">Total</th>
              <th className="text-left">Paid</th>
              <th className="text-left">Balance</th>
            </tr>
          </thead>

          <tbody>
            {visibleSuppliers.map((s, index) => (
              <tr
                key={index}
                className="border-b"
              >
                <td className="p-4">{s.name}</td>

                <td>₹{s.total}</td>

                <td className="text-green-600">
                  ₹{s.paid}
                </td>

                <td className="text-red-500">
                  ₹{s.balance}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* SEE MORE */}
      {suppliers.length > 5 && (
        <div className="flex justify-center mt-5">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-gray-200 px-5 py-2 rounded-lg"
          >
            {showAll ? "Show Less" : "See More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Suppliers;