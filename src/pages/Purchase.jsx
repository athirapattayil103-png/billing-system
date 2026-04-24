// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { BASE_URL } from "../api";

// const Purchase = () => {
//   const [products, setProducts] = useState([]);
//   const [purchases, setPurchases] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const [form, setForm] = useState({
//     productId: "",
//     quantity: 1,
//     cost: "",
//     supplier: "",
//   });

//   // FETCH DATA
//   const fetchData = async () => {
//     try {
//       const productRes = await axios.get(`${BASE_URL}/products`);
//       const purchaseRes = await axios.get(`${BASE_URL}/purchases`);

//       setProducts(productRes.data);
//       setPurchases(purchaseRes.data.reverse());
//     } catch (error) {
//       toast.error("Failed to fetch data ❌");
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

//   // ADD PURCHASE
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.productId || !form.quantity || !form.cost) {
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
//       const cost = Number(form.cost);
//       const total = quantity * cost;

//       // update stock
//       await axios.put(`${BASE_URL}/products/${selectedProduct.id}`, {
//         ...selectedProduct,
//         stock: Number(selectedProduct.stock) + quantity,
//       });

//       // save purchase
//       await axios.post(`${BASE_URL}/purchases`, {
//         customer: form.supplier || "-",
//         productName: selectedProduct.name,
//         quantity,
//         cost,
//         total,
//         date: new Date().toISOString(),
//       });

//       toast.success("Purchase Added Successfully ✅");

//       setForm({
//         productId: "",
//         quantity: 1,
//         cost: "",
//         supplier: "",
//       });

//       setShowModal(false);
//       fetchData();
//     } catch (error) {
//       toast.error("Error saving purchase ❌");
//     }
//   };

//   // DELETE
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/purchases/${id}`);
//       toast.success("Deleted Successfully");
//       fetchData();
//     } catch (error) {
//       toast.error("Delete Failed ❌");
//     }
//   };

//   // TOTALS
//   const totalPurchaseAmount = purchases.reduce(
//     (sum, item) => sum + Number(item.total || 0),
//     0
//   );

//   const totalPurchaseCount = purchases.length;

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-4xl font-bold">Purchases</h1>
//           <p className="text-gray-500">
//             {totalPurchaseCount} purchases recorded
//           </p>
//         </div>

//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-green-500 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
//         >
//           + Add Purchase
//         </button>
//       </div>

//       {/* TOP CARDS */}
//       <div className="grid md:grid-cols-2 gap-4 mb-6">
//         <div className="bg-white rounded-2xl shadow p-6 text-center">
//           <p className="text-sm text-gray-500">Total Purchase Cost</p>
//           <h2 className="text-3xl font-bold text-blue-600">
//             ₹{totalPurchaseAmount}
//           </h2>
//         </div>

//         <div className="bg-white rounded-2xl shadow p-6 text-center">
//           <p className="text-sm text-gray-500">Total Purchases</p>
//           <h2 className="text-3xl font-bold">{totalPurchaseCount}</h2>
//         </div>
//       </div>

//       {/* PURCHASE HISTORY */}
//       <div className="bg-white rounded-2xl shadow p-6">
//         <h2 className="text-xl font-bold mb-4">Purchase History</h2>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left border-b">
//                 <th className="py-3">#</th>
//                 <th>Customer</th>
//                 <th>Product</th>
//                 <th>Qty</th>
//                 <th>Cost</th>
//                 <th>Total</th>
//                 <th>Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {purchases.map((item, index) => (
//                 <tr key={item.id} className="border-b">
//                   <td className="py-4">{index + 1}</td>
//                   <td>{item.customer || "-"}</td>
//                   <td>{item.productName || "-"}</td>
//                   <td>{item.quantity}</td>
//                   <td>₹{item.cost}</td>
//                   <td className="text-blue-600 font-semibold">
//                     ₹{item.total}
//                   </td>
//                   <td>{new Date(item.date).toLocaleString()}</td>
//                   <td>
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
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl w-[360px] shadow-2xl overflow-hidden">
//             {/* TOP BLUE HEADER */}
//             <div className="bg-green-500 text-white p-5">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-xs opacity-80">New stock entry</p>
//                   <h2 className="text-2xl font-bold">New Purchase</h2>
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
//                 <label className="text-sm text-gray-500">Product</label>
//                 <select
//                   name="productId"
//                   value={form.productId}
//                   onChange={handleChange}
//                   className="border p-3 rounded-lg w-full"
//                 >
//                   <option value="">Select Product</option>
//                   {products.map((product) => (
//                     <option key={product.id} value={product.id}>
//                       {product.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="text-sm text-gray-500">Quantity</label>
//                 <input
//                   type="number"
//                   name="quantity"
//                   value={form.quantity}
//                   onChange={handleChange}
//                   className="border p-3 rounded-lg w-full"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm text-gray-500">Cost Price</label>
//                 <input
//                   type="number"
//                   name="cost"
//                   placeholder="Cost Price"
//                   value={form.cost}   
//                   onChange={handleChange}
//                   className="border p-3 rounded-lg w-full"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm text-gray-500">
//                   Supplier Name
//                 </label>
//                 <input
//                   type="text"
//                   name="supplier"
//                   placeholder="Supplier name (optional)"
//                   value={form.supplier}
//                   onChange={handleChange}
//                   className="border p-3 rounded-lg w-full"
//                 />
//               </div>

//               <button className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold">
//                 Add Stock
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

// export default Purchase;




import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../api";

const Purchase = () => {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [form, setForm] = useState({
    productId: "",
    quantity: 1,
    cost: "",
    supplier: "",
  });

  // FETCH DATA
  const fetchData = async () => {
    try {
      const productRes = await axios.get(`${BASE_URL}/products`);
      const purchaseRes = await axios.get(`${BASE_URL}/purchases`);

      setProducts(productRes.data);
      setPurchases(purchaseRes.data.reverse());
    } catch (error) {
      toast.error("Failed to fetch data ❌");
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

  // ADD PURCHASE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId || !form.quantity || !form.cost) {
      toast.error("Fill all fields ❌");
      return;
    }

    try {
      const selectedProduct = products.find(
        (p) => String(p.id) === String(form.productId)
      );

      if (!selectedProduct) {
        toast.error("Product not found ❌");
        return;
      }

      const quantity = Number(form.quantity);
      const cost = Number(form.cost);
      const total = quantity * cost;

      // UPDATE STOCK
      await axios.put(`${BASE_URL}/products/${selectedProduct.id}`, {
        ...selectedProduct,
        stock: Number(selectedProduct.stock) + quantity,
      });

      // SAVE PURCHASE
      await axios.post(`${BASE_URL}/purchases`, {
        customer: form.supplier || "-",
        productName: selectedProduct.name,
        quantity,
        cost,
        total,
        date: new Date().toISOString(),
      });

      toast.success("Purchase Added Successfully ✅");

      setForm({
        productId: "",
        quantity: 1,
        cost: "",
        supplier: "",
      });

      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error("Error saving purchase ❌");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/purchases/${id}`);
      toast.success("Deleted Successfully");
      fetchData();
    } catch (error) {
      toast.error("Delete Failed ❌");
    }
  };

  // TOTALS
  const totalPurchaseAmount = purchases.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const totalPurchaseCount = purchases.length;

  // SEE MORE LOGIC
  const visiblePurchases = showAll
    ? purchases
    : purchases.slice(0, 4);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Purchases</h1>
          <p className="text-gray-500">
            {totalPurchaseCount} purchases recorded
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          + Add Purchase
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-sm text-gray-500">
            Total Purchase Cost
          </p>
          <h2 className="text-3xl font-bold text-blue-600">
            ₹{totalPurchaseAmount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-sm text-gray-500">
            Total Purchases
          </p>
          <h2 className="text-3xl font-bold">
            {totalPurchaseCount}
          </h2>
        </div>
      </div>

      {/* PURCHASE HISTORY */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Purchase History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3">#</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Cost</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visiblePurchases.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4">{index + 1}</td>
                  <td>{item.customer || "-"}</td>
                  <td>{item.productName || "-"}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.cost}</td>
                  <td className="text-blue-600 font-semibold">
                    ₹{item.total}
                  </td>
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
        </div>

        {/* SEE MORE BUTTON */}
        {purchases.length > 4 && (
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
            <div className="bg-green-500 text-white p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs opacity-80">
                    New stock entry
                  </p>
                  <h2 className="text-2xl font-bold">
                    New Purchase
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
                  Product
                </label>

                <select
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                >
                  <option value="">Select Product</option>

                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name}
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
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Cost Price
                </label>

                <input
                  type="number"
                  name="cost"
                  placeholder="Cost Price"
                  value={form.cost}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Supplier Name
                </label>

                <input
                  type="text"
                  name="supplier"
                  placeholder="Supplier name (optional)"
                  value={form.supplier}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                />
              </div>

              <button className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold">
                Add Stock
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

export default Purchase;