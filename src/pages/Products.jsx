import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showAll, setShowAll] = useState(false);

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

  // SEE MORE LOGIC
  const visibleProducts = showAll
    ? products
    : products.slice(0, 4);

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Products
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your product inventory
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({
              name: "",
              price: "",
              stock: "",
              minStock: "",
              category: "",
            });
          }}
          className="bg-green-500 hover:bg-green-800 text-white px-7 py-3 rounded-xl font-semibold shadow"
        >
          + Add Product
        </button>
      </div>

      {/* POPUP FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[420px] rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-green-500 text-white p-5 flex justify-between items-center">
              <div>
                <p className="text-xs opacity-80">
                  New product entry
                </p>
                <h2 className="text-2xl font-bold">
                  {editId ? "Edit Product" : "Add Product"}
                </h2>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
                className="text-2xl"
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">

              <div>
                <p className="text-sm mb-1">Product Name</p>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div>
                <p className="text-sm mb-1">Price</p>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div>
                <p className="text-sm mb-1">Stock</p>
                <input
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div>
                <p className="text-sm mb-1">Min Stock</p>
                <input
                  name="minStock"
                  value={form.minStock}
                  onChange={handleChange}
                  placeholder="Min Stock"
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div>
                <p className="text-sm mb-1">Category</p>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Category"
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <button className="w-full bg-green-500 text-white p-3 rounded-xl font-semibold">
                {editId ? "Update Product" : "Add Product"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full bg-gray-100 p-3 rounded-xl"
              >
                Cancel
              </button>

            </form>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">
          Product List
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-4">#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {visibleProducts.map((p, index) => (
              <tr key={p.id} className="border-b">
                <td className="py-5">{index + 1}</td>

                <td>{p.name}</td>

                <td className="text-blue-600 font-medium">
                  ₹{p.price}
                </td>

                <td>
                  {p.stock}
                  {Number(p.stock) < Number(p.minStock) && (
                    <span className="text-red-500 ml-2 text-xs font-semibold">
                      Low Stock
                    </span>
                  )}
                </td>

                <td>{p.category}</td>

                <td className="flex gap-2 py-4">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-400 px-4 py-2 rounded-md text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* SEE MORE BUTTON */}
        {products.length > 4 && (
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
    </div>
  );
};

export default Products;