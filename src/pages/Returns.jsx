



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { BASE_URL } from "../api";

// const Returns = () => {
//   const [products, setProducts] = useState([]);
//   const [returns, setReturns] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [showAll, setShowAll] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [form, setForm] = useState({
//     type: "sale",
//     productId: "",
//     qty: 1,
//   });

//   // FETCH DATA
//   const fetchData = async () => {
//     try {
//       const productRes = await axios.get(`${BASE_URL}/products`);
//       const returnRes = await axios.get(`${BASE_URL}/returns`);

//       setProducts(productRes.data);
//       setReturns(returnRes.data.reverse());
//     } catch (error) {
//       toast.error("Failed to load returns");
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
//       type: item.type || "sale",
//       productId: matchedProduct ? matchedProduct.id : "",
//       qty: item.qty || 1,
//     });

//     setEditId(item.id);
//     setShowModal(true);
//   };

//   // ADD / UPDATE RETURN
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.productId || !form.qty) {
//       toast.error("Fill all fields");
//       return;
//     }

//     const product = products.find(
//       (p) => String(p.id) === String(form.productId)
//     );

//     if (!product) {
//       toast.error("Product not found");
//       return;
//     }

//     const qty = Number(form.qty);
//     const total = Number(product.price) * qty;

//     try {
//       // only for new return → stock update
//       if (!editId) {
//         let updatedStock =
//           form.type === "sale"
//             ? Number(product.stock) + qty
//             : Number(product.stock) - qty;

//         await axios.put(`${BASE_URL}/products/${product.id}`, {
//           ...product,
//           stock: updatedStock,
//         });
//       }

//       // UPDATE RETURN
//       if (editId) {
//         await axios.put(`${BASE_URL}/returns/${editId}`, {
//           id: editId,
//           productName: product.name,
//           qty,
//           total,
//           type: form.type,
//           date: new Date().toISOString(),
//         });

//         toast.success("Return Updated ✅");
//       }

//       // ADD RETURN
//       else {
//         await axios.post(`${BASE_URL}/returns`, {
//           productName: product.name,
//           qty,
//           total,
//           type: form.type,
//           date: new Date().toISOString(),
//         });

//         toast.success("Return Processed ✅");
//       }

//       setForm({
//         type: "sale",
//         productId: "",
//         qty: 1,
//       });

//       setEditId(null);
//       setShowModal(false);
//       fetchData();
//     } catch (error) {
//       toast.error("Operation Failed");
//     }
//   };

//   // DELETE
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/returns/${id}`);
//       toast.success("Deleted");
//       fetchData();
//     } catch {
//       toast.error("Delete Failed");
//     }
//   };

//   // CALCULATIONS
//   const totalReturn = returns.reduce(
//     (sum, item) => sum + Number(item.total || 0),
//     0
//   );

//   const salesReturn = returns
//     .filter((r) => r.type === "sale")
//     .reduce((sum, item) => sum + Number(item.total || 0), 0);

//   const purchaseReturn = returns
//     .filter((r) => r.type === "purchase")
//     .reduce((sum, item) => sum + Number(item.total || 0), 0);

//   // SEE MORE
//   const visibleReturns = showAll
//     ? returns
//     : returns.slice(0, 4);

//   return (
//     <div className="p-6 bg-[#f5f6fa] min-h-screen">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-4xl font-bold">Returns</h1>
//           <p className="text-gray-500">
//             {returns.length} returns recorded
//           </p>
//         </div>

//         <button
//           onClick={() => {
//             setShowModal(true);
//             setEditId(null);
//             setForm({
//               type: "sale",
//               productId: "",
//               qty: 1,
//             });
//           }}
//           className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
//         >
//           + Add Return
//         </button>
//       </div>

//       {/* TOP CARDS */}
//       <div className="grid grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl shadow p-5 text-center">
//           <p className="text-sm text-gray-500">Total</p>
//           <h2 className="text-2xl font-bold text-red-500">
//             ₹{totalReturn}
//           </h2>
//         </div>

//         <div className="bg-white rounded-xl shadow p-5 text-center">
//           <p className="text-sm text-gray-500">Sales</p>
//           <h2 className="text-2xl font-bold text-orange-500">
//             ₹{salesReturn}
//           </h2>
//         </div>

//         <div className="bg-white rounded-xl shadow p-5 text-center">
//           <p className="text-sm text-gray-500">Purchase</p>
//           <h2 className="text-2xl font-bold text-blue-500">
//             ₹{purchaseReturn}
//           </h2>
//         </div>

//         <div className="bg-white rounded-xl shadow p-5 text-center">
//           <p className="text-sm text-gray-500">Count</p>
//           <h2 className="text-2xl font-bold">
//             {returns.length}
//           </h2>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-2xl shadow p-6">
//         <h2 className="text-xl font-bold mb-4">
//           Return History
//         </h2>

//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b text-left">
//               <th className="py-3">#</th>
//               <th>Product</th>
//               <th>Qty</th>
//               <th>Type</th>
//               <th>Total</th>
//               <th>Date</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {visibleReturns.map((item, index) => (
//               <tr key={item.id} className="border-b">
//                 <td className="py-4">{index + 1}</td>
//                 <td>{item.productName}</td>
//                 <td>{item.qty}</td>

//                 <td>
//                   <span
//                     className={`px-2 py-1 rounded text-xs ${
//                       item.type === "sale"
//                         ? "bg-red-100 text-red-500"
//                         : "bg-blue-100 text-blue-500"
//                     }`}
//                   >
//                     {item.type}
//                   </span>
//                 </td>

//                 <td>₹{item.total}</td>

//                 <td>
//                   {new Date(item.date).toLocaleString()}
//                 </td>

//                 <td className="flex gap-2 py-3">
//                   <button
//                     onClick={() => handleEdit(item)}
//                     className="bg-yellow-400 px-4 py-2 rounded-lg"
//                   >
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => handleDelete(item.id)}
//                     className="bg-red-500 text-white px-4 py-2 rounded-lg"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* SEE MORE BUTTON */}
//         {returns.length > 4 && (
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
//             <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-5">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-xs opacity-80">
//                     New return entry
//                   </p>

//                   <h2 className="text-2xl font-bold">
//                     {editId ? "Edit Return" : "Process Return"}
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
//               onSubmit={handleSubmit}
//               className="p-5 space-y-4"
//             >
//               <div>
//                 <label className="text-sm text-gray-500">
//                   Return Type
//                 </label>

//                 <select
//                   name="type"
//                   value={form.type}
//                   onChange={handleChange}
//                   className="border p-3 rounded-lg w-full"
//                 >
//                   <option value="sale">
//                     Sales Return
//                   </option>
//                   <option value="purchase">
//                     Purchase Return
//                   </option>
//                 </select>
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

//                   {products.map((p) => (
//                     <option
//                       key={p.id}
//                       value={p.id}
//                     >
//                       {p.name}
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
//                   name="qty"
//                   value={form.qty}
//                   onChange={handleChange}
//                   className="border p-3 rounded-lg w-full"
//                 />
//               </div>

//               <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold">
//                 {editId ? "Update Return" : "Process Return"}
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

// export default Returns;


import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../api";

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Invoice search
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [foundSale, setFoundSale] = useState(null);
  const [searchError, setSearchError] = useState("");

  const [returnType, setReturnType] = useState("sale"); // "sale" | "purchase"
  const [form, setForm] = useState({
    productId: "",
    qty: "",
    reason: "",
    // for purchase returns
    purchaseProductId: "",
    purchaseQty: "",
  });

  const fetchData = async () => {
    try {
      const [r, s, p] = await Promise.all([
        axios.get(`${BASE_URL}/returns`),
        axios.get(`${BASE_URL}/sales`),
        axios.get(`${BASE_URL}/products`),
      ]);
      setReturns(r.data.reverse());
      setSales(s.data);
      setProducts(p.data);
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search by invoice number
  const handleInvoiceSearch = () => {
    if (!invoiceSearch.trim()) {
      setSearchError("Enter an invoice number");
      return;
    }
    const sale = sales.find(
      (s) => s.invoiceNo?.toLowerCase() === invoiceSearch.trim().toLowerCase()
    );
    if (sale) {
      setFoundSale(sale);
      setSearchError("");
      // Pre-fill product if single item
      if (sale.items && sale.items.length === 1) {
        setForm((f) => ({ ...f, productId: sale.items[0].productId, qty: "" }));
      } else if (sale.productId) {
        setForm((f) => ({ ...f, productId: sale.productId, qty: "" }));
      }
    } else {
      setFoundSale(null);
      setSearchError("No sale found with this invoice number");
    }
  };

  const openModal = () => {
    setReturnType("sale");
    setInvoiceSearch("");
    setFoundSale(null);
    setSearchError("");
    setForm({ productId: "", qty: "", reason: "", purchaseProductId: "", purchaseQty: "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (returnType === "sale") {
        if (!foundSale) { toast.error("Search and select a valid invoice ❌"); return; }
        const returnQty = Number(form.qty);
        if (!form.productId || !returnQty) { toast.error("Fill all fields ❌"); return; }

        // Find the sale item being returned
        const saleItem = foundSale.items
          ? foundSale.items.find((i) => String(i.productId) === String(form.productId))
          : { productId: foundSale.productId, price: foundSale.price, quantity: foundSale.quantity };

        if (!saleItem) { toast.error("Product not in this sale ❌"); return; }
        if (returnQty > saleItem.quantity) { toast.error("Return qty exceeds sold qty ❌"); return; }

        const returnAmount = Number(saleItem.price) * returnQty;

        // Restore stock
        const prod = products.find((p) => String(p.id) === String(form.productId));
        if (prod) {
          await axios.put(`${BASE_URL}/products/${prod.id}`, {
            ...prod,
            stock: Number(prod.stock) + returnQty,
          });
        }

        await axios.post(`${BASE_URL}/returns`, {
          type: "sale",
          invoiceNo: foundSale.invoiceNo || "",
          saleId: foundSale.id,
          customer: foundSale.customer,
          productId: form.productId,
          productName: prod?.name || saleItem.productName,
          qty: returnQty,
          amount: returnAmount,
          reason: form.reason || "-",
          date: new Date().toISOString(),
        });

        toast.success("Sale return recorded ✅");

      } else {
        // Purchase return
        if (!form.purchaseProductId || !form.purchaseQty) { toast.error("Fill all fields ❌"); return; }
        const qty = Number(form.purchaseQty);
        const prod = products.find((p) => String(p.id) === String(form.purchaseProductId));
        if (!prod) { toast.error("Product not found ❌"); return; }

        // Reduce stock
        await axios.put(`${BASE_URL}/products/${prod.id}`, {
          ...prod,
          stock: Math.max(0, Number(prod.stock) - qty),
        });

        const amount = Number(prod.price) * qty;

        await axios.post(`${BASE_URL}/returns`, {
          type: "purchase",
          productId: prod.id,
          productName: prod.name,
          qty,
          amount,
          reason: form.reason || "-",
          date: new Date().toISOString(),
        });

        toast.success("Purchase return recorded ✅");
      }

      setShowModal(false);
      fetchData();
    } catch {
      toast.error("Return failed ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/returns/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Delete Failed");
    }
  };

  const totalSaleReturns = returns.filter((r) => r.type === "sale").reduce((s, r) => s + Number(r.amount || r.total || 0), 0);
  const totalPurchaseReturns = returns.filter((r) => r.type === "purchase").reduce((s, r) => s + Number(r.amount || r.total || 0), 0);

  const visibleReturns = showAll ? returns : returns.slice(0, 5);

  // Products in found sale
  const saleProducts = foundSale?.items
    ? foundSale.items.map((i) => ({ id: i.productId, name: i.productName, quantity: i.quantity }))
    : foundSale
    ? [{ id: foundSale.productId, name: foundSale.productName, quantity: foundSale.quantity }]
    : [];

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Returns</h1>
          <p className="text-gray-500">{returns.length} returns recorded</p>
        </div>
        <button
          onClick={openModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow"
        >
          + Add Return
        </button>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-sm text-gray-500">Sale Returns</p>
          <h2 className="text-3xl font-bold text-orange-500">₹{totalSaleReturns}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-sm text-gray-500">Purchase Returns</p>
          <h2 className="text-3xl font-bold text-red-500">₹{totalPurchaseReturns}</h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Return History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3">#</th>
                <th>Type</th>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleReturns.map((r, i) => (
                <tr key={r.id} className="border-b">
                  <td className="py-4">{i + 1}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      r.type === "sale" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="font-mono text-blue-700">{r.invoiceNo || "—"}</td>
                  <td>{r.customer || "—"}</td>
                  <td>{r.productName || "—"}</td>
                  <td>{r.qty || "—"}</td>
                  <td className="text-red-500 font-semibold">₹{r.amount || r.total || 0}</td>
                  <td>{r.reason || "—"}</td>
                  <td>{new Date(r.date).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleDelete(r.id)} className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {returns.length > 5 && (
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
          <div className="bg-white rounded-2xl w-[460px] shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="bg-orange-500 text-white p-5 flex justify-between items-start">
              <div>
                <p className="text-xs opacity-80">Return Entry</p>
                <h2 className="text-2xl font-bold">New Return</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-2xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Return Type Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReturnType("sale")}
                  className={`flex-1 py-2 rounded-lg font-semibold border-2 transition-colors ${
                    returnType === "sale" ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-500"
                  }`}
                >
                  Sale Return
                </button>
                <button
                  type="button"
                  onClick={() => setReturnType("purchase")}
                  className={`flex-1 py-2 rounded-lg font-semibold border-2 transition-colors ${
                    returnType === "purchase" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-500"
                  }`}
                >
                  Purchase Return
                </button>
              </div>

              {returnType === "sale" ? (
                <>
                  {/* Invoice Search */}
                  <div>
                    <label className="text-sm text-gray-500">Search by Invoice Number</label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        placeholder="e.g. INV-S-0001"
                        value={invoiceSearch}
                        onChange={(e) => {
                          setInvoiceSearch(e.target.value);
                          setFoundSale(null);
                          setSearchError("");
                        }}
                        className="border p-3 rounded-lg flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleInvoiceSearch}
                        className="bg-blue-600 text-white px-4 rounded-lg font-semibold"
                      >
                        Search
                      </button>
                    </div>
                    {searchError && <p className="text-red-500 text-xs mt-1">{searchError}</p>}
                  </div>

                  {/* Found sale info */}
                  {foundSale && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
                      <p className="font-semibold text-green-700">✅ Found: {foundSale.invoiceNo}</p>
                      <p className="text-gray-600">Customer: {foundSale.customer}</p>
                      <p className="text-gray-600">Total: ₹{foundSale.total}</p>
                      <p className="text-gray-600">
                        Products: {foundSale.items
                          ? foundSale.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")
                          : `${foundSale.productName} ×${foundSale.quantity}`}
                      </p>
                    </div>
                  )}

                  {/* Product to return */}
                  {foundSale && (
                    <div>
                      <label className="text-sm text-gray-500">Product to Return</label>
                      <select
                        value={form.productId}
                        onChange={(e) => setForm({ ...form, productId: e.target.value })}
                        className="border p-3 rounded-lg w-full mt-1"
                      >
                        <option value="">Select Product</option>
                        {saleProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (sold: {p.quantity})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {foundSale && (
                    <div>
                      <label className="text-sm text-gray-500">Return Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={form.qty}
                        onChange={(e) => setForm({ ...form, qty: e.target.value })}
                        className="border p-3 rounded-lg w-full mt-1"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm text-gray-500">Product</label>
                    <select
                      value={form.purchaseProductId}
                      onChange={(e) => setForm({ ...form, purchaseProductId: e.target.value })}
                      className="border p-3 rounded-lg w-full mt-1"
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Return Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={form.purchaseQty}
                      onChange={(e) => setForm({ ...form, purchaseQty: e.target.value })}
                      className="border p-3 rounded-lg w-full mt-1"
                    />
                  </div>
                </>
              )}

              {/* Reason */}
              <div>
                <label className="text-sm text-gray-500">Reason (optional)</label>
                <input
                  type="text"
                  placeholder="Reason for return"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="border p-3 rounded-lg w-full mt-1"
                />
              </div>

              <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold">
                Submit Return
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="w-full bg-gray-100 py-3 rounded-xl">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Returns;
