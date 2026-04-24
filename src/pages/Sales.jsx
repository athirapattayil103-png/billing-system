// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { BASE_URL } from "../api";

// const Sales = () => {
//   const [products, setProducts] = useState([]);
//   const [sales, setSales] = useState([]);
//   const [showModal, setShowModal] = useState(false);

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

//   // COMPLETE SALE
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

//       if (Number(selectedProduct.stock) < quantity) {
//         toast.error("Not enough stock ❌");
//         return;
//       }

//       const total = Number(selectedProduct.price) * quantity;

//       // UPDATE STOCK
//       await axios.put(`${BASE_URL}/products/${selectedProduct.id}`, {
//         ...selectedProduct,
//         stock: Number(selectedProduct.stock) - quantity,
//       });

//       // SAVE SALE
//       await axios.post(`${BASE_URL}/sales`, {
//         customer: form.customer || "-",
//         productName: selectedProduct.name,
//         price: Number(selectedProduct.price),
//         quantity,
//         total,
//         date: new Date().toISOString(),
//       });

//       toast.success("Sale completed 💰");

//       setForm({
//         customer: "",
//         productId: "",
//         quantity: 1,
//       });

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
//           onClick={() => setShowModal(true)}
//           className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
//         >
//           + Add Sale
//         </button>
//       </div>

//       {/* TOP CARDS */}
//       <div className="grid md:grid-cols-2 gap-4 mb-6">
//         <div className="bg-white rounded-2xl shadow p-6 text-center">
//           <p className="text-sm text-gray-500">Total Revenue</p>
//           <h2 className="text-3xl font-bold text-green-600">
//             ₹{totalRevenue}
//           </h2>
//         </div>

//         <div className="bg-white rounded-2xl shadow p-6 text-center">
//           <p className="text-sm text-gray-500">Total Transactions</p>
//           <h2 className="text-3xl font-bold">{totalTransactions}</h2>
//         </div>
//       </div>

//       {/* SALES HISTORY */}
//       <div className="bg-white rounded-2xl shadow p-6">
//         <h2 className="text-xl font-bold mb-4">Sales History</h2>

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
//               {sales.map((item, index) => (
//                 <tr key={item.id} className="border-b">
//                   <td className="py-4">{index + 1}</td>
//                   <td>{item.customer || "-"}</td>
//                   <td>{item.productName || "-"}</td>
//                   <td>₹{item.price}</td>
//                   <td>{item.quantity}</td>
//                   <td className="text-green-600 font-semibold">
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
            
//             {/* GREEN HEADER */}
//             <div className="bg-green-600 text-white p-5">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-xs opacity-80">
//                     New transaction
//                   </p>
//                   <h2 className="text-2xl font-bold">
//                     New Sale
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
//             <form onSubmit={handleSale} className="p-5 space-y-4">
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
//                   <option value="">Select Product</option>

//                   {products.map((product) => (
//                     <option key={product.id} value={product.id}>
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
//                 Complete Sale
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

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [form, setForm] = useState({
    customer: "",
    productId: "",
    quantity: 1,
  });

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

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // COMPLETE SALE
  const handleSale = async (e) => {
    e.preventDefault();

    if (!form.productId || !form.quantity) {
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

      if (Number(selectedProduct.stock) < quantity) {
        toast.error("Not enough stock ❌");
        return;
      }

      const total = Number(selectedProduct.price) * quantity;

      // UPDATE STOCK
      await axios.put(`${BASE_URL}/products/${selectedProduct.id}`, {
        ...selectedProduct,
        stock: Number(selectedProduct.stock) - quantity,
      });

      // SAVE SALE
      await axios.post(`${BASE_URL}/sales`, {
        customer: form.customer || "-",
        productName: selectedProduct.name,
        price: Number(selectedProduct.price),
        quantity,
        total,
        date: new Date().toISOString(),
      });

      toast.success("Sale completed 💰");

      setForm({
        customer: "",
        productId: "",
        quantity: 1,
      });

      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error("Error completing sale ❌");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/sales/${id}`);
      toast.success("Deleted Successfully");
      fetchData();
    } catch (error) {
      toast.error("Delete Failed ❌");
    }
  };

  // TOTALS
  const totalRevenue = sales.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const totalTransactions = sales.length;

  // SEE MORE LOGIC
  const visibleSales = showAll
    ? sales
    : sales.slice(0, 4);

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Sales</h1>
          <p className="text-gray-500">
            {totalTransactions} transactions recorded
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
        >
          + Add Sale
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold text-green-600">
            ₹{totalRevenue}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <h2 className="text-3xl font-bold">
            {totalTransactions}
          </h2>
        </div>
      </div>

      {/* SALES HISTORY */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Sales History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3">#</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleSales.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4">{index + 1}</td>
                  <td>{item.customer || "-"}</td>
                  <td>{item.productName || "-"}</td>
                  <td>₹{item.price}</td>
                  <td>{item.quantity}</td>
                  <td className="text-green-600 font-semibold">
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
        {sales.length > 4 && (
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

            {/* GREEN HEADER */}
            <div className="bg-green-600 text-white p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs opacity-80">
                    New transaction
                  </p>
                  <h2 className="text-2xl font-bold">
                    New Sale
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
            <form onSubmit={handleSale} className="p-5 space-y-4">
              <div>
                <label className="text-sm text-gray-500">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer"
                  placeholder="Enter customer name"
                  value={form.customer}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                />
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

                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Stock: {product.stock})
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

              <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold">
                Complete Sale
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