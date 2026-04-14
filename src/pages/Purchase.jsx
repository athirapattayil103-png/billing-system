import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Purchase = () => {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    cost: "",
  });

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3000/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId || !form.quantity) {
      toast.error("Fill all fields ❌");
      return;
    }

    const product = products.find(
      (p) => p.id === form.productId
    );

    if (!product) {
      toast.error("Product not found ❌");
      return;
    }

    // 🔥 UPDATE STOCK
    const updatedProduct = {
      ...product,
      stock: product.stock + Number(form.quantity),
    };

    await axios.put(
      `http://localhost:3000/products/${product.id}`,
      updatedProduct
    );

    // 🔥 SAVE PURCHASE
    await axios.post("http://localhost:3000/purchases", {
      productId: form.productId,
      quantity: Number(form.quantity),
      cost: Number(form.cost),
      date: new Date().toISOString(),
    });

    toast.success("Stock Updated + Purchase Saved 🔥");

    setForm({
      productId: "",
      quantity: "",
      cost: "",
    });

    fetchProducts();
  };

  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold mb-4">Purchase</h1>

      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">

        <select
          name="productId"
          value={form.productId}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stock: {p.stock})
            </option>
          ))}
        </select>

        <input
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="border p-2 w-full"
        />

        <input
          name="cost"
          value={form.cost}
          onChange={handleChange}
          placeholder="Total Cost"
          className="border p-2 w-full"
        />

        <button className="bg-green-500 text-white p-2 w-full rounded">
          Add Purchase
        </button>

      </form>

    </div>
  );
};

export default Purchase;