import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const SalesReturn = () => {
  const [saleId, setSaleId] = useState("");
  const [sale, setSale] = useState(null);
  const [returns, setReturns] = useState([]);
  const [tab, setTab] = useState("entry");

  // 🔥 FETCH RETURNS
  const fetchReturns = async () => {
    try {
      const res = await axios.get("http://https://billing-system-zykh.onrender.com/returns");
      setReturns(res.data);
    } catch {
      toast.error("Failed to load returns ❌");
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  // 🔍 SEARCH SALE
  const fetchSale = async () => {
    if (!saleId) {
      toast.error("Enter Sale ID ❌");
      return;
    }

    try {
      const res = await axios.get(`http://https://billing-system-zykh.onrender.com/sales/${saleId}`);
      setSale(res.data);
    } catch {
      toast.error("Sale not found ❌");
      setSale(null);
    }
  };

  // 🔁 RETURN PROCESS
  const handleReturn = async () => {
    if (!sale) {
      toast.error("No sale selected ❌");
      return;
    }

    if (sale.returned) {
      toast.error("Already returned ⚠️");
      return;
    }

    try {
      // 🔥 UPDATE STOCK
      for (let item of sale.items) {
        const p = await axios.get(`http://https://billing-system-zykh.onrender.com/products/${item.id}`);

        await axios.put(`http://https://billing-system-zykh.onrender.com/products/${item.id}`, {
          ...p.data,
          stock: p.data.stock + item.qty,
        });
      }

      // 🔥 MARK SALE RETURNED
      await axios.put(`http://https://billing-system-zykh.onrender.com/sales/${sale.id}`, {
        ...sale,
        returned: true,
      });

      // 🔥 SAVE RETURN
      await axios.post("http://https://billing-system-zykh.onrender.com/returns", {
        saleId: sale.id,
        amount: sale.total,
        type: "sale", // ✅ VERY IMPORTANT
        date: new Date().toISOString(),
      });

      toast.success("Return completed 🔄");

      setSale(null);
      setSaleId("");
      fetchReturns();

    } catch {
      toast.error("Something went wrong ❌");
    }
  };

  // 📊 CALCULATIONS
  const total = returns.reduce((sum, r) => sum + (r.amount || 0), 0);

  const salesReturn = returns
    .filter((r) => r.type === "sale")
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Returns 🔄</h1>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("entry")}
          className={`px-4 py-2 rounded ${
            tab === "entry" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Return Entry
        </button>

        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 rounded ${
            tab === "history" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          History
        </button>
      </div>

      {/* ENTRY */}
      {tab === "entry" && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="bg-white p-5 rounded-xl shadow">

            <h2 className="font-semibold mb-3">Process Return</h2>

            <input
              placeholder="Enter Sale ID"
              value={saleId}
              onChange={(e) => setSaleId(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />

            <button
              onClick={fetchSale}
              className="bg-blue-600 text-white w-full p-2 rounded mb-4"
            >
              Search
            </button>

            {sale && (
              <>
                {sale.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm border-b py-1">
                    <p>{item.name} x {item.qty}</p>
                    <p>₹{item.total}</p>
                  </div>
                ))}

                <h3 className="font-bold mt-3">Total: ₹{sale.total}</h3>

                <button
                  onClick={handleReturn}
                  className="bg-purple-600 text-white w-full p-2 rounded mt-4"
                >
                  Process Return
                </button>
              </>
            )}

          </div>

          {/* RIGHT */}
          <div className="bg-white p-5 rounded-xl shadow">

            <h2 className="font-semibold mb-3">Recent Returns</h2>

            {returns.slice(-5).reverse().map((r) => (
              <div key={r.id} className="flex justify-between border-b py-2 text-sm">
                <p>{r.type || "sale"}</p>
                <p>₹{r.amount}</p>
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
              <p>Total</p>
              <h2 className="font-bold">₹{total}</h2>
            </div>

            <div className="bg-gray-100 p-3 rounded text-center">
              <p>Sales Return</p>
              <h2 className="font-bold">₹{salesReturn}</h2>
            </div>

            <div className="bg-gray-100 p-3 rounded text-center">
              <p>Count</p>
              <h2 className="font-bold">{returns.length}</h2>
            </div>

          </div>

          {/* TABLE */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th>#</th>
                <th>Sale ID</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {returns.map((r, i) => (
                <tr key={r.id} className="border-b">
                  <td>{i + 1}</td>
                  <td>{r.saleId || "-"}</td>
                  <td>₹{r.amount}</td>
                  <td>{r.type}</td>
                  <td>{new Date(r.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

    </div>
  );
};

export default SalesReturn;