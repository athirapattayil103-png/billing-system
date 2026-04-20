// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Purchase = () => {
//   const [products, setProducts] = useState([]);
//   const [purchases, setPurchases] = useState([]);
//   const [tab, setTab] = useState("purchase");

//   const [form, setForm] = useState({
//     productId: "",
//     quantity: "",
//     cost: "",
//   });

//   const fetchData = async () => {
//     const p = await axios.get("https://billing-system-zykh.onrender.com/products");
//     const pu = await axios.get("https://billing-system-zykh.onrender.com/purchases");

//     setProducts(p.data);
//     setPurchases(pu.data);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.productId || !form.quantity || !form.cost) {
//       toast.error("Fill all fields ❌");
//       return;
//     }

//     const product = products.find((p) => p.id === form.productId);

//     if (!product) {
//       toast.error("Product not found ❌");
//       return;
//     }

//     // 🔥 UPDATE STOCK
//     await axios.put(`https://billing-system-zykh.onrender.com/products/${product.id}`, {
//       ...product,
//       stock: product.stock + Number(form.quantity),
//     });

//     // 🔥 SAVE PURCHASE
//     await axios.post("https://billing-system-zykh.onrender.com/purchases", {
//       productId: form.productId,
//       productName: product.name,
//       quantity: Number(form.quantity),
//       cost: Number(form.cost),
//       total: Number(form.cost),
//       date: new Date().toISOString(),
//     });

//     toast.success("Stock Added + Purchase Saved ✅");

//     setForm({ productId: "", quantity: "", cost: "" });
//     fetchData();
//   };

//   // 📊 TOTAL
//   const totalPurchase = purchases.reduce((sum, p) => sum + (p.total || 0), 0);

//   return (
//     <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">

//       <h1 className="text-3xl font-bold mb-6">Purchase 📦</h1>

//       {/* TABS */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setTab("purchase")}
//           className={`px-4 py-2 rounded ${tab === "purchase" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//         >
//           Purchase
//         </button>

//         <button
//           onClick={() => setTab("history")}
//           className={`px-4 py-2 rounded ${tab === "history" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//         >
//           History
//         </button>
//       </div>

//       {/* PURCHASE FORM */}
//       {tab === "purchase" && (
//         <div className="grid md:grid-cols-2 gap-6">

//           {/* FORM */}
//           <div className="bg-white p-5 rounded-xl shadow">

//             <h2 className="font-semibold mb-3">New Purchase</h2>

//             <form onSubmit={handleSubmit} className="space-y-3">

//               <select
//                 name="productId"
//                 value={form.productId}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               >
//                 <option value="">Select Product</option>
//                 {products.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.name} (Stock: {p.stock})
//                   </option>
//                 ))}
//               </select>

//               <input
//                 name="quantity"
//                 value={form.quantity}
//                 onChange={handleChange}
//                 placeholder="Quantity"
//                 className="border p-2 w-full rounded"
//               />

//               <input
//                 name="cost"
//                 value={form.cost}
//                 onChange={handleChange}
//                 placeholder="Cost"
//                 className="border p-2 w-full rounded"
//               />

//               <button className="bg-blue-600 text-white w-full p-2 rounded">
//                 Add Stock
//               </button>

//             </form>

//           </div>

//           {/* RECENT */}
//           <div className="bg-white p-5 rounded-xl shadow">

//             <h2 className="font-semibold mb-3">Recent Purchases</h2>

//             {purchases.slice(-5).reverse().map((p) => (
//               <div key={p.id} className="flex justify-between border-b py-2 text-sm">
//                 <p>{p.productName || "Product"}</p>
//                 <p>₹{p.total}</p>
//               </div>
//             ))}

//           </div>

//         </div>
//       )}

//       {/* HISTORY */}
//       {tab === "history" && (
//         <div className="bg-white p-5 rounded-xl shadow">

//           <h2 className="font-semibold mb-3">Purchase History</h2>

//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left border-b">
//                 <th>#</th>
//                 <th>Product</th>
//                 <th>Qty</th>
//                 <th>Cost</th>
//                 <th>Total</th>
//                 <th>Date</th>
//               </tr>
//             </thead>

//             <tbody>
//               {purchases.map((p, i) => (
//                 <tr key={p.id} className="border-b">
//                   <td>{i + 1}</td>
//                   <td>{p.productName || "-"}</td>
//                   <td>{p.quantity}</td>
//                   <td>₹{p.cost}</td>
//                   <td>₹{p.total}</td>
//                   <td>{new Date(p.date).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//         </div>
//       )}

//       {/* TOTAL */}
//       <div className="mt-6 bg-white p-4 rounded-xl shadow text-center">
//         <p className="text-gray-500">Total Purchase</p>
//         <h2 className="text-xl font-bold">₹{totalPurchase}</h2>
//       </div>

//     </div>
//   );
// };

// export default Purchase;


import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../api"; // ✅ IMPORTANT

const Purchase = () => {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [tab, setTab] = useState("purchase");

  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    cost: "",
  });

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const p = await axios.get(`${BASE_URL}/products`);
      const pu = await axios.get(`${BASE_URL}/purchases`);

      setProducts(p.data);
      setPurchases(pu.data);
    } catch (err) {
      toast.error("Failed to fetch data ❌");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId || !form.quantity || !form.cost) {
      toast.error("Fill all fields ❌");
      return;
    }

    try {
      const product = products.find((p) => p.id === form.productId);

      if (!product) {
        toast.error("Product not found ❌");
        return;
      }

      // ✅ UPDATE STOCK
      await axios.put(`${BASE_URL}/products/${product.id}`, {
        ...product,
        stock: product.stock + Number(form.quantity),
      });

      // ✅ SAVE PURCHASE
      await axios.post(`${BASE_URL}/purchases`, {
        productId: form.productId,
        productName: product.name,
        quantity: Number(form.quantity),
        cost: Number(form.cost),
        total: Number(form.cost), // (optional: quantity * cost)
        date: new Date().toISOString(),
      });

      toast.success("Stock Added + Purchase Saved ✅");

      setForm({ productId: "", quantity: "", cost: "" });
      fetchData();

    } catch (err) {
      toast.error("Error saving purchase ❌");
    }
  };

  // 📊 TOTAL
  const totalPurchase = purchases.reduce(
    (sum, p) => sum + (p.total || 0),
    0
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Purchase 📦</h1>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("purchase")}
          className={`px-4 py-2 rounded ${
            tab === "purchase"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Purchase
        </button>

        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 rounded ${
            tab === "history"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          History
        </button>
      </div>

      {/* FORM */}
      {tab === "purchase" && (
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-3">New Purchase</h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <select
                name="productId"
                value={form.productId}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.stock})
                  </option>
                ))}
              </select>

              <input
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className="border p-2 w-full rounded"
              />

              <input
                name="cost"
                value={form.cost}
                onChange={handleChange}
                placeholder="Cost"
                className="border p-2 w-full rounded"
              />

              <button className="bg-blue-600 text-white w-full p-2 rounded">
                Add Stock
              </button>

            </form>
          </div>

          {/* RECENT */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Recent Purchases</h2>

            {purchases.slice(-5).reverse().map((p) => (
              <div
                key={p.id}
                className="flex justify-between border-b py-2 text-sm"
              >
                <p>{p.productName || "Product"}</p>
                <p>₹{p.total}</p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* HISTORY */}
      {tab === "history" && (
        <div className="bg-white p-5 rounded-xl shadow">

          <h2 className="font-semibold mb-3">Purchase History</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Cost</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {purchases.map((p, i) => (
                <tr key={p.id} className="border-b">
                  <td>{i + 1}</td>
                  <td>{p.productName || "-"}</td>
                  <td>{p.quantity}</td>
                  <td>₹{p.cost}</td>
                  <td>₹{p.total}</td>
                  <td>{new Date(p.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

      {/* TOTAL */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow text-center">
        <p className="text-gray-500">Total Purchase</p>
        <h2 className="text-xl font-bold">₹{totalPurchase}</h2>
      </div>

    </div>
  );
};

export default Purchase;