// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// const PurchaseReturn = () => {
//   const [products, setProducts] = useState([]);
//   const [returns, setReturns] = useState([]);
//   const [tab, setTab] = useState("entry");

//   const [form, setForm] = useState({
//     productId: "",
//     qty: "",
//   });

//   // 🔥 FETCH
//   const fetchData = async () => {
//     const p = await axios.get("https://billing-system-zykh.onrender.com/products");
//     const r = await axios.get("https://billing-system-zykh.onrender.com/returns");

//     setProducts(p.data);
//     setReturns(r.data);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // 🔁 HANDLE RETURN
//   const handleReturn = async (e) => {
//     e.preventDefault();

//     if (!form.productId || !form.qty) {
//       toast.error("Fill all fields ❌");
//       return;
//     }

//     const product = products.find(p => p.id === form.productId);

//     if (!product) {
//       toast.error("Product not found ❌");
//       return;
//     }

//     if (product.stock < form.qty) {
//       toast.error("Not enough stock ❌");
//       return;
//     }

//     const amount = product.price * form.qty;

//     // 🔥 REDUCE STOCK
//     await axios.put(`https://billing-system-zykh.onrender.com/products/${product.id}`, {
//       ...product,
//       stock: product.stock - Number(form.qty),
//     });

//     // 🔥 SAVE RETURN
//     await axios.post("https://billing-system-zykh.onrender.com/returns", {
//       type: "purchase",
//       productId: product.id,
//       productName: product.name,
//       qty: Number(form.qty),
//       amount,
//       date: new Date().toISOString(),
//     });

//     toast.success("Purchase Return Done 🔄");

//     setForm({ productId: "", qty: "" });
//     fetchData();
//   };

//   // 📊 CALCULATION
//   const purchaseReturnTotal = returns
//     .filter(r => r.type === "purchase")
//     .reduce((sum, r) => sum + r.amount, 0);

//   return (
//     <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">

//       <h1 className="text-3xl font-bold mb-6">Purchase Return 🔁</h1>

//       {/* TABS */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setTab("entry")}
//           className={`px-4 py-2 rounded ${
//             tab === "entry" ? "bg-purple-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Return Entry
//         </button>

//         <button
//           onClick={() => setTab("history")}
//           className={`px-4 py-2 rounded ${
//             tab === "history" ? "bg-purple-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           History
//         </button>
//       </div>

//       {/* ENTRY */}
//       {tab === "entry" && (
//         <div className="grid md:grid-cols-2 gap-6">

//           {/* FORM */}
//           <div className="bg-white p-5 rounded-xl shadow">

//             <h2 className="font-semibold mb-3">Process Purchase Return</h2>

//             <form onSubmit={handleReturn} className="space-y-3">

//               <select
//                 value={form.productId}
//                 onChange={(e) => setForm({ ...form, productId: e.target.value })}
//                 className="border p-2 w-full rounded"
//               >
//                 <option value="">Select Product</option>
//                 {products.map(p => (
//                   <option key={p.id} value={p.id}>
//                     {p.name} (Stock: {p.stock})
//                   </option>
//                 ))}
//               </select>

//               <input
//                 placeholder="Quantity"
//                 value={form.qty}
//                 onChange={(e) => setForm({ ...form, qty: e.target.value })}
//                 className="border p-2 w-full rounded"
//               />

//               <button className="bg-purple-600 text-white w-full p-2 rounded">
//                 Process Return
//               </button>

//             </form>
//           </div>

//           {/* RECENT */}
//           <div className="bg-white p-5 rounded-xl shadow">

//             <h2 className="font-semibold mb-3">Recent Returns</h2>

//             {returns
//               .filter(r => r.type === "purchase")
//               .slice(-5)
//               .reverse()
//               .map(r => (
//                 <div key={r.id} className="flex justify-between border-b py-2 text-sm">
//                   <p>{r.productName}</p>
//                   <p>₹{r.amount}</p>
//                 </div>
//               ))}

//           </div>

//         </div>
//       )}

//       {/* HISTORY */}
//       {tab === "history" && (
//         <div className="bg-white p-5 rounded-xl shadow">

//           {/* CARD */}
//           <div className="mb-4 bg-gray-100 p-3 rounded text-center">
//             <p>Total Purchase Return</p>
//             <h2 className="font-bold">₹{purchaseReturnTotal}</h2>
//           </div>

//           {/* TABLE */}
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b text-left">
//                 <th>#</th>
//                 <th>Product</th>
//                 <th>Qty</th>
//                 <th>Amount</th>
//                 <th>Date</th>
//               </tr>
//             </thead>

//             <tbody>
//               {returns
//                 .filter(r => r.type === "purchase")
//                 .map((r, i) => (
//                   <tr key={r.id} className="border-b">
//                     <td>{i + 1}</td>
//                     <td>{r.productName}</td>
//                     <td>{r.qty}</td>
//                     <td>₹{r.amount}</td>
//                     <td>{new Date(r.date).toLocaleString()}</td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>

//         </div>
//       )}

//     </div>
//   );
// };

// export default PurchaseReturn;