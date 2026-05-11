



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { BASE_URL } from "../api";

// const Sales = () => {
//   const [products, setProducts] = useState([]);
//   const [sales, setSales] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [showAll, setShowAll] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [form, setForm] = useState({
//     customer: "",
//     productId: "",
//     quantity: 1,
//   });

//   // FETCH DATA
//   const fetchData = async () => {
//     try {
//       const p = await axios.get(`${BASE_URL}/products`);
//       const s = await axios.get(`${BASE_URL}/sales`);

//       setProducts(p.data);
//       setSales(s.data.reverse());
//     } catch (err) {
//       toast.error("Failed to load data ❌");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // HANDLE INPUT
//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // EDIT
//   const handleEdit = (item) => {
//     const matchedProduct = products.find(
//       (p) => p.name === item.productName
//     );

//     setForm({
//       customer: item.customer || "",
//       productId: matchedProduct ? matchedProduct.id : "",
//       quantity: item.quantity || 1,
//     });

//     setEditId(item.id);
//     setShowModal(true);
//   };

//   // ADD / UPDATE SALE
//   const handleSale = async (e) => {
//     e.preventDefault();

//     if (!form.productId || !form.quantity) {
//       toast.error("Fill all fields ❌");
//       return;
//     }

//     try {
//       const selectedProduct = products.find(
//         (p) => String(p.id) === String(form.productId)
//       );

//       if (!selectedProduct) {
//         toast.error("Product not found ❌");
//         return;
//       }

//       const quantity = Number(form.quantity);

//       if (
//         !editId &&
//         Number(selectedProduct.stock) < quantity
//       ) {
//         toast.error("Not enough stock ❌");
//         return;
//       }

//       const total = Number(selectedProduct.price) * quantity;

//       // UPDATE STOCK only for new sale
//       if (!editId) {
//         await axios.put(`${BASE_URL}/products/${selectedProduct.id}`, {
//           ...selectedProduct,
//           stock: Number(selectedProduct.stock) - quantity,
//         });
//       }

//       // UPDATE SALE
//       if (editId) {
//         await axios.put(`${BASE_URL}/sales/${editId}`, {
//           id: editId,
//           customer: form.customer || "-",
//           productId: selectedProduct.id,
//           productName: selectedProduct.name,
//           price: Number(selectedProduct.price),
//           quantity,
//           total,
//           date: new Date().toISOString(),
//         });

//         toast.success("Sale Updated Successfully ✅");
//       }

//       // ADD SALE
//       else {
//         await axios.post(`${BASE_URL}/sales`, {
//           customer: form.customer || "-",
//           productId: selectedProduct.id,
//           productName: selectedProduct.name,
//           price: Number(selectedProduct.price),
//           quantity,
//           total,
//           date: new Date().toISOString(),
//         });

//         toast.success("Sale completed 💰");
//       }

//       setForm({
//         customer: "",
//         productId: "",
//         quantity: 1,
//       });

//       setEditId(null);
//       setShowModal(false);
//       fetchData();
//     } catch (err) {
//       toast.error("Error completing sale ❌");
//     }
//   };

//   // DELETE
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/sales/${id}`);
//       toast.success("Deleted Successfully");
//       fetchData();
//     } catch (error) {
//       toast.error("Delete Failed ❌");
//     }
//   };

//   // TOTALS
//   const totalRevenue = sales.reduce(
//     (sum, item) => sum + Number(item.total || 0),
//     0
//   );

//   const totalTransactions = sales.length;

//   // SEE MORE
//   const visibleSales = showAll
//     ? sales
//     : sales.slice(0, 4);

//   return (
//     <div className="p-6 bg-[#f5f6fa] min-h-screen">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-4xl font-bold">Sales</h1>
//           <p className="text-gray-500">
//             {totalTransactions} transactions recorded
//           </p>
//         </div>

//         <button
//           onClick={() => {
//             setShowModal(true);
//             setEditId(null);
//             setForm({
//               customer: "",
//               productId: "",
//               quantity: 1,
//             });
//           }}
//           className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
//         >
//           + Add Sale
//         </button>
//       </div>

//       {/* TOP CARDS */}
//       <div className="grid md:grid-cols-2 gap-4 mb-6">
//         <div className="bg-white rounded-2xl shadow p-6 text-center">
//           <p className="text-sm text-gray-500">
//             Total Revenue
//           </p>
//           <h2 className="text-3xl font-bold text-green-600">
//             ₹{totalRevenue}
//           </h2>
//         </div>

//         <div className="bg-white rounded-2xl shadow p-6 text-center">
//           <p className="text-sm text-gray-500">
//             Total Transactions
//           </p>
//           <h2 className="text-3xl font-bold">
//             {totalTransactions}
//           </h2>
//         </div>
//       </div>

//       {/* SALES HISTORY */}
//       <div className="bg-white rounded-2xl shadow p-6">
//         <h2 className="text-xl font-bold mb-4">
//           Sales History
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left border-b">
//                 <th className="py-3">#</th>
//                 <th>Customer</th>
//                 <th>Product</th>
//                 <th>Price</th>
//                 <th>Qty</th>
//                 <th>Total</th>
//                 <th>Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {visibleSales.map((item, index) => (
//                 <tr key={item.id} className="border-b">
//                   <td className="py-4">{index + 1}</td>
//                   <td>{item.customer || "-"}</td>
//                   <td>{item.productName || "-"}</td>
//                   <td>₹{item.price}</td>
//                   <td>{item.quantity}</td>
//                   <td className="text-green-600 font-semibold">
//                     ₹{item.total}
//                   </td>
//                   <td>
//                     {new Date(item.date).toLocaleString()}
//                   </td>

//                   <td className="flex gap-2 py-3">
//                     <button
//                       onClick={() => handleEdit(item)}
//                       className="bg-yellow-400 px-4 py-2 rounded-lg"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => handleDelete(item.id)}
//                       className="bg-red-500 text-white px-4 py-2 rounded-lg"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* SEE MORE BUTTON */}
//         {sales.length > 4 && (
//           <div className="flex justify-center mt-6">
//             <button
//               onClick={() => setShowAll(!showAll)}
//               className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-medium"
//             >
//               {showAll ? "Show Less" : "See More"}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl w-[360px] shadow-2xl overflow-hidden">

//             {/* HEADER */}
//             <div className="bg-green-600 text-white p-5">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-xs opacity-80">
//                     New transaction
//                   </p>
//                   <h2 className="text-2xl font-bold">
//                     {editId ? "Edit Sale" : "New Sale"}
//                   </h2>
//                 </div>

//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             {/* FORM */}
//             <form
//               onSubmit={handleSale}
//               className="p-5 space-y-4"
//             >
//               <div>
//                 <label className="text-sm text-gray-500">
//                   Customer Name
//                 </label>

//                 <input
//                   type="text"
//                   name="customer"
//                   placeholder="Enter customer name"
//                   value={form.customer}
//                   onChange={handleChange}
//                   className="border p-3 rounded-lg w-full"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm text-gray-500">
//                   Product
//                 </label>

//                 <select
//                   name="productId"
//                   value={form.productId}
//                   onChange={handleChange}
//                   className="border p-3 rounded-lg w-full"
//                 >
//                   <option value="">
//                     Select Product
//                   </option>

//                   {products.map((product) => (
//                     <option
//                       key={product.id}
//                       value={product.id}
//                     >
//                       {product.name} (Stock: {product.stock})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="text-sm text-gray-500">
//                   Quantity
//                 </label>

//                 <input
//                   type="number"
//                   name="quantity"
//                   value={form.quantity}
//                   onChange={handleChange}
//                   className="border p-3 rounded-lg w-full"
//                 />
//               </div>

//               <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold">
//                 {editId ? "Update Sale" : "Complete Sale"}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setShowModal(false)}
//                 className="w-full bg-gray-100 py-3 rounded-xl"
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sales;

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../api";

// Generate next invoice number
const generateInvoiceNumber = (existingSales) => {
  const invoiceSales = existingSales.filter((s) => s.invoiceNo);
  if (invoiceSales.length === 0) return "INV-S-0001";
  const numbers = invoiceSales.map((s) => {
    const match = s.invoiceNo?.match(/INV-S-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  });
  const max = Math.max(...numbers);
  return `INV-S-${String(max + 1).padStart(4, "0")}`;
};

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [editId, setEditId] = useState(null);

  // Multi-product rows
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const [customer, setCustomer] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [currentInvoiceNo, setCurrentInvoiceNo] = useState("");

  // FETCH DATA
  const fetchData = async () => {
    try {
      const p = await axios.get(`${BASE_URL}/products`);
      const s = await axios.get(`${BASE_URL}/sales`);
      setProducts(p.data);
      setSales(s.data.reverse());
    } catch (err) {
      toast.error("Failed to load data ❌");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open modal for new sale
  const openNewSaleModal = () => {
    setEditId(null);
    setCustomer("");
    setItems([{ productId: "", quantity: 1 }]);
    setReceivedAmount("");
    // Invoice number generated when modal opens using latest sales
    axios.get(`${BASE_URL}/sales`).then((res) => {
      setCurrentInvoiceNo(generateInvoiceNumber(res.data));
    });
    setShowModal(true);
  };

  // Edit sale
  const handleEdit = (sale) => {
    setEditId(sale.id);
    setCustomer(sale.customer || "");
    setCurrentInvoiceNo(sale.invoiceNo || "");
    setReceivedAmount(sale.receivedAmount ?? sale.total ?? "");
    // Restore items from sale
    if (sale.items && sale.items.length > 0) {
      const restored = sale.items.map((item) => {
        const prod = products.find((p) => p.id === item.productId);
        return { productId: prod ? prod.id : "", quantity: item.quantity };
      });
      setItems(restored);
    } else {
      const prod = products.find((p) => p.name === sale.productName);
      setItems([{ productId: prod ? prod.id : "", quantity: sale.quantity || 1 }]);
    }
    setShowModal(true);
  };

  // Handle item row changes
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculate total from items
  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const prod = products.find((p) => String(p.id) === String(item.productId));
      if (!prod) return sum;
      return sum + Number(prod.price) * Number(item.quantity || 0);
    }, 0);
  };

  const total = calculateTotal();
  const received = Number(receivedAmount) || 0;
  const pending = total - received;

  // SUBMIT
  const handleSale = async (e) => {
    e.preventDefault();

    if (items.some((i) => !i.productId || !i.quantity)) {
      toast.error("Fill all product rows ❌");
      return;
    }

    try {
      // Validate stock for new sales
      for (const item of items) {
        const prod = products.find((p) => String(p.id) === String(item.productId));
        if (!prod) { toast.error("Product not found ❌"); return; }
        if (!editId && Number(prod.stock) < Number(item.quantity)) {
          toast.error(`Not enough stock for ${prod.name} ❌`);
          return;
        }
      }

      const saleItems = items.map((item) => {
        const prod = products.find((p) => String(p.id) === String(item.productId));
        return {
          productId: prod.id,
          productName: prod.name,
          price: Number(prod.price),
          quantity: Number(item.quantity),
          subtotal: Number(prod.price) * Number(item.quantity),
        };
      });

      const saleTotal = saleItems.reduce((s, i) => s + i.subtotal, 0);
      const rec = Number(receivedAmount) || saleTotal;
      const pend = saleTotal - rec;

      // Update stock for new sales only
      // if (!editId) {
      //   for (const item of saleItems) {
      //     const prod = products.find((p) => p.id === item.productId);
      //     await axios.put(`${BASE_URL}/products/${prod.id}`, {
      //       ...prod,
      //       stock: Number(prod.stock) - item.quantity,
      //     });
      //   }
      // }
      if (editId) {
  const oldSale = sales.find((s) => s.id === editId);

  if (oldSale?.items) {
    for (const oldItem of oldSale.items) {
      const prod = products.find(
        (p) => p.id === oldItem.productId
      );

      if (prod) {
        await axios.put(`${BASE_URL}/products/${prod.id}`, {
          ...prod,
          stock: Number(prod.stock) + Number(oldItem.quantity),
        });
      }
    }
  }
}

for (const item of saleItems) {
  const prod = products.find(
    (p) => p.id === item.productId
  );

  await axios.put(`${BASE_URL}/products/${prod.id}`, {
    ...prod,
    stock: Number(prod.stock) - item.quantity,
  });
}

      const salePayload = {
        invoiceNo: currentInvoiceNo,
        customer: customer || "-",
        items: saleItems,
        // For backward compat - use first item as main product
        productId: saleItems[0].productId,
        productName: saleItems.length === 1 ? saleItems[0].productName : `${saleItems.length} items`,
        price: saleItems[0].price,
        quantity: saleItems[0].quantity,
        total: saleTotal,
        receivedAmount: rec,
        pending: pend < 0 ? 0 : pend,
        status: pend <= 0 ? "Paid" : "Pending",
        date: new Date().toISOString(),
      };

      if (editId) {
        await axios.put(`${BASE_URL}/sales/${editId}`, { id: editId, ...salePayload });
        toast.success("Sale Updated ✅");
      } else {
        await axios.post(`${BASE_URL}/sales`, salePayload);
        toast.success("Sale completed 💰");
      }

      // setShowModal(false);
      // setEditId(null);
      // fetchData();
      setShowModal(false);
setEditId(null);

setCustomer("");

setItems([
  {
    productId: "",
    quantity: 1,
  },
]);

setReceivedAmount("");
setCurrentInvoiceNo("");

fetchData();
    } catch (err) {
      toast.error("Error completing sale ❌");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/sales/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Delete Failed ❌");
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total || 0), 0);
  const totalPending = sales.reduce((sum, s) => sum + Number(s.pending || 0), 0);
  const visibleSales = showAll ? sales : sales.slice(0, 5);

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Sales</h1>
          <p className="text-gray-500">{sales.length} transactions recorded</p>
        </div>
        <button
          onClick={openNewSaleModal}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
        >
          + New Sale
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold text-green-600">₹{totalRevenue}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <h2 className="text-3xl font-bold">{sales.length}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="text-3xl font-bold text-red-500">₹{totalPending}</h2>
        </div>
      </div>

      {/* SALES HISTORY */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Sales History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3">Invoice No</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Received</th>
                <th>Pending</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleSales.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4 font-mono text-blue-700 font-semibold">
                    {item.invoiceNo || "—"}
                  </td>
                  <td>{item.customer || "-"}</td>
                  <td>
                    {/* {item.items && item.items.length > 1
                      ? <span className="text-purple-600 font-medium">{item.items.length} items</span>
                      : item.productName || "-"} */}
                      {item.items
  ? item.items.map((i) => i.productName).join(", ")
  : item.productName || "-"}
                  </td>
                  <td>
                    {item.items && item.items.length > 1
                      ? item.items.reduce((s, i) => s + i.quantity, 0)
                      : item.quantity}
                  </td>
                  <td className="text-green-600 font-semibold">₹{item.total}</td>
                  <td>₹{item.receivedAmount ?? item.total}</td>
                  <td className={item.pending > 0 ? "text-red-500 font-semibold" : "text-gray-400"}>
                    ₹{item.pending || 0}
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.status === "Paid" || !item.pending
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {item.status || (item.pending > 0 ? "Pending" : "Paid")}
                    </span>
                  </td>
                  <td>{new Date(item.date).toLocaleString()}</td>
                  <td className="flex gap-2 py-3">
                    <button onClick={() => handleEdit(item)} className="bg-yellow-400 px-4 py-2 rounded-lg">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sales.length > 5 && (
          <div className="flex justify-center mt-6">
            <button onClick={() => setShowAll(!showAll)} className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-medium">
              {showAll ? "Show Less" : "See More"}
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 overflow-y-auto py-6">
          <div className="bg-white rounded-2xl w-[500px] shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="bg-green-600 text-white p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs opacity-80">New transaction</p>
                  <h2 className="text-2xl font-bold">{editId ? "Edit Sale" : "New Sale"}</h2>
                  <p className="text-sm font-mono opacity-90 mt-1">{currentInvoiceNo}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-2xl leading-none">×</button>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSale} className="p-5 space-y-4">
              {/* Customer */}
              <div>
                <label className="text-sm text-gray-500">Customer Name</label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="border p-3 rounded-lg w-full mt-1"
                />
              </div>

              {/* Product Rows */}
              <div>
                <label className="text-sm text-gray-500">Products</label>
                <div className="space-y-2 mt-1">
                  {items.map((item, index) => {
                    const prod = products.find((p) => String(p.id) === String(item.productId));
                    const subtotal = prod ? Number(prod.price) * Number(item.quantity || 0) : 0;
                    return (
                      <div key={index} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex gap-2">
                          <select
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                            className="border p-2 rounded-lg flex-1 bg-white"
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
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                            className="border p-2 rounded-lg w-20 text-center"
                          />
                          <button
                            type="button"
                            onClick={() => removeItemRow(index)}
                            className="bg-red-500 text-white px-3 rounded-lg font-bold"
                          >
                            ×
                          </button>
                        </div>
                        {subtotal > 0 && (
                          <div className="text-right text-sm text-green-700 font-semibold mt-1">
                            ₹{prod?.price} × {item.quantity} = ₹{subtotal}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="mt-2 text-sm text-blue-600 font-semibold hover:underline"
                >
                  + Add Product
                </button>
              </div>

              {/* Received Amount */}
              <div>
                <label className="text-sm text-gray-500">Received Amount</label>
                <input
                  type="number"
                  placeholder={`Max ₹${total}`}
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  className="border p-3 rounded-lg w-full mt-1"
                />
              </div>

              {/* Total / Pending Summary */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-500 font-semibold">
                  <span>Pending</span>
                  <span>₹{pending < 0 ? "0.00" : pending.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold">
                {editId ? "Update Sale" : "Complete Sale"}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-100 py-3 rounded-xl"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
