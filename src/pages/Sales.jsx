import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [sales, setSales] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const [activeTab, setActiveTab] = useState("sales");

  // 🔥 FETCH
  const fetchData = async () => {
    const p = await axios.get("http://https://billing-system-zykh.onrender.com/products");
    const s = await axios.get("http://https://billing-system-zykh.onrender.com/sales");

    setProducts(p.data);
    setSales(s.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 ADD TO CART
  const addToCart = () => {
    if (!selectedProduct || !quantity) {
      toast.error("Select product and quantity ❌");
      return;
    }

    const product = products.find((p) => p.id == selectedProduct);

    if (product.stock < quantity) {
      toast.error("Not enough stock ❌");
      return;
    }

    const item = {
      ...product,
      qty: Number(quantity),
      total: product.price * quantity,
    };

    setCart([...cart, item]);
    setSelectedProduct("");
    setQuantity("");
  };

  // 🔥 TOTAL
  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  // 🔥 COMPLETE SALE
  const handleSale = async () => {
    if (cart.length === 0) {
      toast.error("Cart empty ❌");
      return;
    }

    for (let item of cart) {
      const product = products.find((p) => p.id === item.id);

      await axios.put(`http://https://billing-system-zykh.onrender.com/products/${product.id}`, {
        ...product,
        stock: product.stock - item.qty,
      });
    }

    await axios.post("http://https://billing-system-zykh.onrender.com/sales", {
      items: cart,
      total: totalAmount,
      date: new Date().toISOString(),
    });

    toast.success("Sale completed 💰");

    setCart([]);
    fetchData();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Sales 🧾</h1>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("sales")}
          className={`px-4 py-2 rounded ${
            activeTab === "sales" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Sales
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded ${
            activeTab === "history" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          History
        </button>
      </div>

      {/* SALES TAB */}
      {activeTab === "sales" && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT - BILL */}
          <div className="bg-white p-5 rounded-xl shadow">

            <h2 className="font-semibold mb-3">New Sale</h2>

            <div className="flex gap-2 mb-4">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.stock})
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Qty"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border p-2 rounded w-24"
              />

              <button
                onClick={addToCart}
                className="bg-blue-600 text-white px-4 rounded"
              >
                Add
              </button>
            </div>

            {/* CART */}
            <div className="space-y-2 mb-4">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between border-b pb-1">
                  <p>{item.name} x {item.qty}</p>
                  <p>₹{item.total}</p>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-bold mb-3">
              Total: ₹{totalAmount}
            </h2>

            <button
              onClick={handleSale}
              className="bg-green-600 text-white w-full py-2 rounded"
            >
              Complete Sale
            </button>

          </div>

          {/* RIGHT - RECENT SALES */}
          <div className="bg-white p-5 rounded-xl shadow">

            <h2 className="font-semibold mb-3">Recent Sales</h2>

            {sales.slice(-5).reverse().map((s, i) => (
              <div key={i} className="border-b py-2 text-sm">
                <p>₹{s.total}</p>
                <p className="text-gray-400">
                  {new Date(s.date).toLocaleString()}
                </p>
              </div>
            ))}

          </div>

        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === "history" && (
        <div className="bg-white p-5 rounded-xl shadow">

          <h2 className="font-semibold mb-3">Sales History</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Total</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="p-2">₹{s.total}</td>
                  <td className="p-2">
                    {new Date(s.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

    </div>
  );
};

export default Sales;