import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    minStock: "",
    category: "",
  });

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/products`);
      setProducts(res.data);

      const lowStock = res.data.filter(
        (p) => Number(p.stock) < Number(p.minStock)
      );

      if (lowStock.length > 0) {
        toast.error(`⚠️ ${lowStock.length} product(s) low in stock`);
      }
    } catch (err) {
      toast.error("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.price ||
      !form.stock ||
      !form.minStock ||
      !form.category
    ) {
      toast.error("Fill all fields");
      return;
    }

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        minStock: Number(form.minStock),
      };

      if (editId) {
        await axios.put(`${BASE_URL}/products/${editId}`, payload);
        toast.success("Product Updated");
      } else {
        await axios.post(`${BASE_URL}/products`, payload);
        toast.success("Product Added");
      }

      setForm({
        name: "",
        price: "",
        stock: "",
        minStock: "",
        category: "",
      });

      setEditId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      toast.error("Operation Failed");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/products/${id}`);
      toast.success("Deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  // EDIT
  const handleEdit = (product) => {
    setForm(product);
    setEditId(product.id);
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* TOP SECTION */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500">
            Manage your product inventory
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm({
              name: "",
              price: "",
              stock: "",
              minStock: "",
              category: "",
            });
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="border p-3 rounded"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-3 rounded"
            />

            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="border p-3 rounded"
            />

            <input
              name="minStock"
              value={form.minStock}
              onChange={handleChange}
              placeholder="Min Stock"
              className="border p-3 rounded"
            />

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="border p-3 rounded"
            />

            <button className="bg-blue-600 text-white p-3 rounded-lg">
              {editId ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Product List</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-600">
              <th className="py-3">#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, index) => (
              <tr key={p.id} className="border-b">
                <td className="py-4">{index + 1}</td>
                <td>{p.name}</td>
                <td className="text-blue-600">₹{p.price}</td>
                <td>
                  {p.stock}
                  {Number(p.stock) < Number(p.minStock) && (
                    <span className="text-red-500 ml-2 text-xs font-semibold">
                      Low Stock
                    </span>
                  )}
                </td>
                <td>{p.category}</td>

                <td className="flex gap-2 py-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-400 px-4 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;