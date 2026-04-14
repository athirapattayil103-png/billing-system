import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  // 🔥 FETCH PRODUCTS
  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3000/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 ADD TO CART
  const addToCart = () => {
    if (!selectedProduct || !quantity) {
      toast.error("Select product and quantity ❌");
      return;
    }

    const product = products.find((p) => p.id === selectedProduct);

    if (product.stock < quantity) {
      toast.error("Not enough stock ❌");
      return;
    }

    const item = {
      ...product,
      qty: Number(quantity),
      total: product.price * quantity,
    };

    setCart([...cart, item]);

    setSelectedProduct("");
    setQuantity("");
  };

  // 🔥 TOTAL
  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  // 🔥 FINAL SALE
  const handleSale = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty ❌");
      return;
    }

    // 🔥 UPDATE STOCK
    for (let item of cart) {
      const product = products.find((p) => p.id === item.id);

      await axios.put(`http://localhost:3000/products/${product.id}`, {
        ...product,
        stock: product.stock - item.qty,
      });
    }

    // 🔥 SAVE SALE
    await axios.post("http://localhost:3000/sales", {
      items: cart,
      total: totalAmount,
      date: new Date().toISOString(),
    });

    toast.success("Sale completed 💰");

    setCart([]);
    fetchProducts();
  };

  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold mb-4">Sales</h1>

      {/* ADD PRODUCT */}
      <div className="flex gap-2 mb-4">

        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border p-2"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stock: {p.stock})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 w-24"
        />

        <button
          onClick={addToCart}
          className="bg-blue-500 text-white px-4"
        >
          Add
        </button>

      </div>

      {/* CART */}
      <div className="space-y-2 mb-4">
        {cart.map((item, i) => (
          <div key={i} className="bg-white p-2 shadow flex justify-between">
            <p>{item.name} x {item.qty}</p>
            <p>₹{item.total}</p>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <h2 className="text-xl font-bold mb-3">
        Total: ₹{totalAmount}
      </h2>

      {/* FINAL BUTTON */}
      <button
        onClick={handleSale}
        className="bg-green-500 text-white px-6 py-2"
      >
        Complete Sale
      </button>

    </div>
  );
};

export default Sales;