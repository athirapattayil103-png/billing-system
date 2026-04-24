import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../api";

const Purchase = () => {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    cost: "",
  });

  // FETCH DATA
  const fetchData = async () => {
    try {
      const productsRes = await axios.get(`${BASE_URL}/products`);
      const purchasesRes = await axios.get(`${BASE_URL}/purchases`);

      setProducts(productsRes.data);
      setPurchases(purchasesRes.data.reverse());
    } catch (error) {
      toast.error("Failed to fetch purchase data ❌");
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

      // update stock
      await axios.put(`${BASE_URL}/products/${selectedProduct.id}`, {
        ...selectedProduct,
        stock: Number(selectedProduct.stock) + quantity,
      });

      // save purchase
      await axios.post(`${BASE_URL}/purchases`, {
        productName: selectedProduct.name,
        quantity,
        cost,
        total,
        date: new Date().toISOString(),
      });

      toast.success("Purchase Added Successfully ✅");

      setForm({
        productId: "",
        quantity: "",
        cost: "",
      });

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
          onClick={() =>
            document
              .getElementById("purchaseForm")
              .scrollIntoView({ behavior: "smooth" })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          + Add Purchase
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-sm text-gray-500">Total Purchase Cost</p>
          <h2 className="text-3xl font-bold text-blue-600">
            ₹{totalPurchaseAmount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-sm text-gray-500">Total Purchases</p>
          <h2 className="text-3xl font-bold">
            {totalPurchaseCount}
          </h2>
        </div>
      </div>

      {/* PURCHASE FORM */}
      <div
        id="purchaseForm"
        className="bg-white rounded-2xl shadow p-6 mb-6"
      >
        <h2 className="text-xl font-bold mb-4">Add Purchase</h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-4 gap-4"
        >
          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="">Select Product</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Qty"
            value={form.quantity}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            name="cost"
            placeholder="Cost"
            value={form.cost}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <button className="bg-blue-600 text-white rounded-lg font-semibold">
            Add Purchase
          </button>
        </form>
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
                <th>Product</th>
                <th>Qty</th>
                <th>Cost</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {purchases.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4">{index + 1}</td>
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
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
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
    </div>
  );
};

export default Purchase;