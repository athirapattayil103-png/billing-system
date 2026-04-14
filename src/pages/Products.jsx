// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Products = () => {
//   const [products, setProducts] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     price: "",
//     stock: "",
//     minStock: "",
//   });

//   const fetchProducts = async () => {
//     const res = await axios.get("http://localhost:3000/products");
//     setProducts(res.data);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name || !form.price) {
//       toast.error("Fill all fields");
//       return;
//     }

//     await axios.post("http://localhost:3000/products", {
//       ...form,
//       price: Number(form.price),
//       stock: Number(form.stock),
//       minStock: Number(form.minStock),
//     });

//     toast.success("Product added");

//     setForm({ name: "", price: "", stock: "", minStock: "" });

//     fetchProducts();
//   };

//   const handleDelete = async (id) => {
//     await axios.delete(`http://localhost:3000/products/${id}`);
//     toast.success("Deleted");
//     fetchProducts();
//   };

//   return (
//     <div className="p-4">

//       <h1 className="text-2xl font-bold mb-4">Products</h1>

//       {/* FORM */}
//       <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-6">

//         <input name="name" placeholder="Name" onChange={handleChange} className="border p-2" />
//         <input name="price" placeholder="Price" onChange={handleChange} className="border p-2" />
//         <input name="stock" placeholder="Stock" onChange={handleChange} className="border p-2" />
//         <input name="minStock" placeholder="Min Stock" onChange={handleChange} className="border p-2" />

//         <button className="bg-blue-500 text-white col-span-2 p-2">
//           Add Product
//         </button>

//       </form>

//       {/* LIST */}
//       {products.map((p) => (
//         <div key={p.id} className="bg-white p-3 mb-2 shadow flex justify-between">

//           <div>
//             <h2>{p.name}</h2>
//             <p>₹{p.price}</p>
//             <p>Stock: {p.stock}</p>

//             {p.stock < p.minStock && (
//               <p className="text-red-500 text-sm">Low Stock ⚠️</p>
//             )}
//           </div>

//           <button onClick={() => handleDelete(p.id)} className="text-red-500">
//             Delete
//           </button>
          


//         </div>
//       ))}

//     </div>
//   );
// };

// export default Products;

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    minStock: "",
  });

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3000/products");
    setProducts(res.data);

    // 🔔 LOW STOCK NOTIFICATION
    const lowStock = res.data.filter(p => p.stock < p.minStock);

    lowStock.forEach(async (p) => {
      await axios.post("http://localhost:3000/notifications", {
        message: `${p.name} is low stock`,
        date: new Date().toISOString(),
      });
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:3000/products", {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      minStock: Number(form.minStock),
    });

    toast.success("Product added");
    setForm({ name: "", price: "", stock: "", minStock: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/products/${id}`);
    toast.success("Deleted");
    fetchProducts();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-6">
        <input name="name" placeholder="Name" onChange={handleChange} className="border p-2" />
        <input name="price" placeholder="Price" onChange={handleChange} className="border p-2" />
        <input name="stock" placeholder="Stock" onChange={handleChange} className="border p-2" />
        <input name="minStock" placeholder="Min Stock" onChange={handleChange} className="border p-2" />

        <button className="bg-blue-500 text-white col-span-2 p-2">
          Add Product
        </button>
      </form>

      {products.map((p) => (
        <div key={p.id} className="bg-white p-3 mb-2 shadow flex justify-between">
          <div>
            <h2>{p.name}</h2>
            <p>₹{p.price}</p>
            <p>Stock: {p.stock}</p>

            {p.stock < p.minStock && (
              <p className="text-red-500 text-sm">Low Stock ⚠️</p>
            )}
          </div>

          <button onClick={() => handleDelete(p.id)} className="text-red-500">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Products;