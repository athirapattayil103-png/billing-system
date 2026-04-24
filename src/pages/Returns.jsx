// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { BASE_URL } from "../api";

// const Returns = () => {
//   const [products, setProducts] = useState([]);
//   const [returns, setReturns] = useState([]);
//   const [showModal, setShowModal] = useState(false);

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

//   // PROCESS RETURN
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
//       // stock update
//       let updatedStock =
//         form.type === "sale"
//           ? Number(product.stock) + qty
//           : Number(product.stock) - qty;

//       await axios.put(`${BASE_URL}/products/${product.id}`, {
//         ...product,
//         stock: updatedStock,
//       });

//       // save return
//       await axios.post(`${BASE_URL}/returns`, {
//         productName: product.name,
//         qty,
//         total,
//         type: form.type,
//         date: new Date().toISOString(),
//       });

//       toast.success("Return Processed");

//       setForm({
//         type: "sale",
//         productId: "",
//         qty: 1,
//       });

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
//           onClick={() => setShowModal(true)}
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
//             {returns.map((item, index) => (
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
//                 <td>{new Date(item.date).toLocaleString()}</td>

//                 <td>
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
//                     Process Return
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
//             <form onSubmit={handleSubmit} className="p-5 space-y-4">

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
//                   <option value="sale">Sales Return</option>
//                   <option value="purchase">Purchase Return</option>
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
//                   <option value="">Select Product</option>

//                   {products.map((p) => (
//                     <option key={p.id} value={p.id}>
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
//                 Process Return
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
  const [products, setProducts] = useState([]);
  const [returns, setReturns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [form, setForm] = useState({
    type: "sale",
    productId: "",
    qty: 1,
  });

  // FETCH DATA
  const fetchData = async () => {
    try {
      const productRes = await axios.get(`${BASE_URL}/products`);
      const returnRes = await axios.get(`${BASE_URL}/returns`);

      setProducts(productRes.data);
      setReturns(returnRes.data.reverse());
    } catch (error) {
      toast.error("Failed to load returns");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // PROCESS RETURN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId || !form.qty) {
      toast.error("Fill all fields");
      return;
    }

    const product = products.find(
      (p) => String(p.id) === String(form.productId)
    );

    if (!product) {
      toast.error("Product not found");
      return;
    }

    const qty = Number(form.qty);
    const total = Number(product.price) * qty;

    try {
      // STOCK UPDATE
      let updatedStock =
        form.type === "sale"
          ? Number(product.stock) + qty
          : Number(product.stock) - qty;

      await axios.put(`${BASE_URL}/products/${product.id}`, {
        ...product,
        stock: updatedStock,
      });

      // SAVE RETURN
      await axios.post(`${BASE_URL}/returns`, {
        productName: product.name,
        qty,
        total,
        type: form.type,
        date: new Date().toISOString(),
      });

      toast.success("Return Processed");

      setForm({
        type: "sale",
        productId: "",
        qty: 1,
      });

      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error("Operation Failed");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/returns/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Delete Failed");
    }
  };

  // CALCULATIONS
  const totalReturn = returns.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const salesReturn = returns
    .filter((r) => r.type === "sale")
    .reduce((sum, item) => sum + Number(item.total || 0), 0);

  const purchaseReturn = returns
    .filter((r) => r.type === "purchase")
    .reduce((sum, item) => sum + Number(item.total || 0), 0);

  // SEE MORE LOGIC
  const visibleReturns = showAll
    ? returns
    : returns.slice(0, 4);

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Returns</h1>
          <p className="text-gray-500">
            {returns.length} returns recorded
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
        >
          + Add Return
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-sm text-gray-500">Total</p>
          <h2 className="text-2xl font-bold text-red-500">
            ₹{totalReturn}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-sm text-gray-500">Sales</p>
          <h2 className="text-2xl font-bold text-orange-500">
            ₹{salesReturn}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-sm text-gray-500">Purchase</p>
          <h2 className="text-2xl font-bold text-blue-500">
            ₹{purchaseReturn}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-sm text-gray-500">Count</p>
          <h2 className="text-2xl font-bold">
            {returns.length}
          </h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Return History
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3">#</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Type</th>
              <th>Total</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {visibleReturns.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="py-4">{index + 1}</td>
                <td>{item.productName}</td>
                <td>{item.qty}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.type === "sale"
                        ? "bg-red-100 text-red-500"
                        : "bg-blue-100 text-blue-500"
                    }`}
                  >
                    {item.type}
                  </span>
                </td>

                <td>₹{item.total}</td>
                <td>
                  {new Date(item.date).toLocaleString()}
                </td>

                <td>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* SEE MORE BUTTON */}
        {returns.length > 4 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-medium"
            >
              {showAll ? "Show Less" : "See More"}
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-[360px] shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs opacity-80">
                    New return entry
                  </p>
                  <h2 className="text-2xl font-bold">
                    Process Return
                  </h2>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">

              <div>
                <label className="text-sm text-gray-500">
                  Return Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                >
                  <option value="sale">
                    Sales Return
                  </option>
                  <option value="purchase">
                    Purchase Return
                  </option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Product
                </label>

                <select
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                >
                  <option value="">Select Product</option>

                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Quantity
                </label>

                <input
                  type="number"
                  name="qty"
                  value={form.qty}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                />
              </div>

              <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold">
                Process Return
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

export default Returns;