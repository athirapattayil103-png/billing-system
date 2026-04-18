
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("add");
  const [editId, setEditId] = useState(null);
  const [showAll, setShowAll] = useState(false); // 🔥 SEE MORE

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    minStock: "",
    category: "",
  });

  const fetchProducts = async () => {
    const res = await axios.get("http://https://billing-system-zykh.onrender.com/products");
    setProducts(res.data);

    const lowStock = res.data.filter(p => p.stock < p.minStock);

    lowStock.forEach(async (p) => {
      await axios.post("http://https://billing-system-zykh.onrender.com/notifications", {
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

    if (editId) {
      await axios.put(`http://https://billing-system-zykh.onrender.com/products/${editId}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        minStock: Number(form.minStock),
      });
      toast.success("Updated");
      setEditId(null);
    } else {
      await axios.post("http://https://billing-system-zykh.onrender.com/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        minStock: Number(form.minStock),
      });
      toast.success("Product added");
    }

    setForm({ name: "", price: "", stock: "", minStock: "", category: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://https://billing-system-zykh.onrender.com/products/${id}`);
    toast.success("Deleted");
    fetchProducts();
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditId(p.id);
    setActiveTab("add");
  };

  // 🔥 SEE MORE LOGIC
  const visibleProducts = showAll ? products : products.slice(0, 4);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Products 📦
      </h1>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "add"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200"
          }`}
        >
          Add Product
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "list"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200"
          }`}
        >
          Product List
        </button>
      </div>

      {/* ADD PRODUCT */}
      {activeTab === "add" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input name="name" value={form.name} placeholder="Product Name" onChange={handleChange} className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
          <input name="price" value={form.price} placeholder="Price" onChange={handleChange} className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
          <input name="stock" value={form.stock} placeholder="Stock" onChange={handleChange} className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
          <input name="minStock" value={form.minStock} placeholder="Min Stock" onChange={handleChange} className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
          <input name="category" value={form.category} placeholder="Category" onChange={handleChange} className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none md:col-span-2" />

          <button className="bg-blue-600 text-white p-3 rounded-lg md:col-span-2 hover:bg-blue-700 transition">
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}

      {/* PRODUCT LIST */}
      {activeTab === "list" && (
        <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">

          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Category</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleProducts.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-green-600">₹{p.price}</td>

                  <td className="p-3">
                    {p.stock}
                    {p.stock < p.minStock && (
                      <span className="ml-2 text-xs text-red-500 bg-red-100 px-2 py-1 rounded">
                        Low
                      </span>
                    )}
                  </td>

                  <td className="p-3">{p.category}</td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-400 px-3 py-1 rounded text-sm hover:bg-yellow-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🔥 SEE MORE BUTTON */}
          {products.length > 4 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="bg-blue-100 text-blue-600 px-4 py-1 rounded hover:bg-blue-200"
              >
                {showAll ? "Show Less" : "See More"}
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Products;