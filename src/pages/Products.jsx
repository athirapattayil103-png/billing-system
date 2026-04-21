import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("add");
  const [editId, setEditId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    minStock: "",
    category: "",
  });

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/products`);
      setProducts(res.data);

      // 🔥 LOW STOCK CHECK
      const lowStock = res.data.filter((p) => p.stock < p.minStock);

      // 🔔 SHOW ALERT
      if (lowStock.length > 0) {
        toast.error(`⚠️ ${lowStock.length} product(s) low in stock`);
      }

    } catch (err) {
      console.error(err);
      toast.error("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/products/${editId}`, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          minStock: Number(form.minStock),
        });
        toast.success("Updated");
        setEditId(null);
      } else {
        await axios.post(`${BASE_URL}/products`, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          minStock: Number(form.minStock),
        });
        toast.success("Product added");
      }

      setForm({ name: "", price: "", stock: "", minStock: "", category: "" });
      fetchProducts();

    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/products/${id}`);
      toast.success("Deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditId(p.id);
    setActiveTab("add");
  };

  const visibleProducts = showAll ? products : products.slice(0, 4);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Products 📦
      </h1>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "add"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Add Product
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "list"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Product List
        </button>
      </div>

      {/* ADD */}
      {activeTab === "add" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow grid gap-4"
        >
          <input name="name" value={form.name} placeholder="Name" onChange={handleChange} className="border p-2" />
          <input name="price" value={form.price} placeholder="Price" onChange={handleChange} className="border p-2" />
          <input name="stock" value={form.stock} placeholder="Stock" onChange={handleChange} className="border p-2" />
          <input name="minStock" value={form.minStock} placeholder="Min Stock" onChange={handleChange} className="border p-2" />
          <input name="category" value={form.category} placeholder="Category" onChange={handleChange} className="border p-2" />

          <button className="bg-blue-600 text-white p-2 rounded">
            {editId ? "Update" : "Add Product"}
          </button>
        </form>
      )}

      {/* LIST */}
      {activeTab === "list" && (
        <div className="bg-white p-6 rounded-2xl shadow">

          {visibleProducts.map((p) => (
            <div key={p.id} className="flex justify-between border-b py-3 items-center">

              {/* LEFT */}
              <div>
                <p className="font-medium">
                  {p.name} - ₹{p.price}
                </p>

                {/* 🔥 LOW STOCK BADGE */}
                {p.stock < p.minStock && (
                  <span className="text-red-500 text-sm font-semibold">
                    ⚠️ Low Stock
                  </span>
                )}
              </div>

              {/* RIGHT */}
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="bg-yellow-400 px-3 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>

            </div>
          ))}

          {products.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 text-blue-600"
            >
              {showAll ? "Show Less" : "See More"}
            </button>
          )}

        </div>
      )}

    </div>
  );
};

export default Products;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { BASE_URL } from "../api"; // ✅ important

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [activeTab, setActiveTab] = useState("add");
//   const [editId, setEditId] = useState(null);
//   const [showAll, setShowAll] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     price: "",
//     stock: "",
//     minStock: "",
//     category: "",
//   });

//   // ✅ FETCH PRODUCTS
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/products`);
//       setProducts(res.data);

//       const lowStock = res.data.filter((p) => p.stock < p.minStock);

//       // ✅ NOTIFICATION
//       lowStock.forEach(async (p) => {
//         await axios.post(`${BASE_URL}/notifications`, {
//           message: `${p.name} is low stock`,
//           date: new Date().toISOString(),
//         });
//       });

//     } catch (err) {
//       console.error(err);
//       toast.error("Error fetching products");
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ✅ ADD / UPDATE
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (editId) {
//         await axios.put(`${BASE_URL}/products/${editId}`, {
//           ...form,
//           price: Number(form.price),
//           stock: Number(form.stock),
//           minStock: Number(form.minStock),
//         });
//         toast.success("Updated");
//         setEditId(null);
//       } else {
//         await axios.post(`${BASE_URL}/products`, {
//           ...form,
//           price: Number(form.price),
//           stock: Number(form.stock),
//           minStock: Number(form.minStock),
//         });
//         toast.success("Product added");
//       }

//       setForm({ name: "", price: "", stock: "", minStock: "", category: "" });
//       fetchProducts();

//     } catch (err) {
//       console.error(err);
//       toast.error("Operation failed");
//     }
//   };

//   // ✅ DELETE
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/products/${id}`);
//       toast.success("Deleted");
//       fetchProducts();
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   const handleEdit = (p) => {
//     setForm(p);
//     setEditId(p.id);
//     setActiveTab("add");
//   };

//   const visibleProducts = showAll ? products : products.slice(0, 4);

//   return (
//     <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">

//       <h1 className="text-3xl font-bold mb-6 text-gray-800">
//         Products 📦
//       </h1>

//       {/* TABS */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setActiveTab("add")}
//           className={`px-4 py-2 rounded-lg ${
//             activeTab === "add"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200"
//           }`}
//         >
//           Add Product
//         </button>

//         <button
//           onClick={() => setActiveTab("list")}
//           className={`px-4 py-2 rounded-lg ${
//             activeTab === "list"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200"
//           }`}
//         >
//           Product List
//         </button>
//       </div>

//       {/* ADD */}
//       {activeTab === "add" && (
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-6 rounded-2xl shadow grid gap-4"
//         >
//           <input name="name" value={form.name} placeholder="Name" onChange={handleChange} className="border p-2" />
//           <input name="price" value={form.price} placeholder="Price" onChange={handleChange} className="border p-2" />
//           <input name="stock" value={form.stock} placeholder="Stock" onChange={handleChange} className="border p-2" />
//           <input name="minStock" value={form.minStock} placeholder="Min Stock" onChange={handleChange} className="border p-2" />
//           <input name="category" value={form.category} placeholder="Category" onChange={handleChange} className="border p-2" />

//           <button className="bg-blue-600 text-white p-2 rounded">
//             {editId ? "Update" : "Add Product"}
//           </button>
//         </form>
//       )}

//       {/* LIST */}
//       {activeTab === "list" && (
//         <div className="bg-white p-6 rounded-2xl shadow">

//           {visibleProducts.map((p) => (
//             <div key={p.id} className="flex justify-between border-b py-2">
//               <span>{p.name} - ₹{p.price}</span>

//               <div className="flex gap-2">
//                 <button onClick={() => handleEdit(p)} className="bg-yellow-400 px-2">Edit</button>
//                 <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2">Delete</button>
//               </div>
//             </div>
//           ))}

//           {products.length > 4 && (
//             <button
//               onClick={() => setShowAll(!showAll)}
//               className="mt-4 text-blue-600"
//             >
//               {showAll ? "Show Less" : "See More"}
//             </button>
//           )}

//         </div>
//       )}

//     </div>
//   );
// };

// export default Products;