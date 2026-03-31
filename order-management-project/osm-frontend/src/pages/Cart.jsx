import { useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Cart() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [message, setMessage] = useState("");

  const updateQty = (id, qty) => {
    const value = Math.max(1, Number(qty) || 1);
    const updated = cart.map((item) => (item.id === id ? { ...item, quantity: value } : item));
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const placeOrder = async () => {
    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      await API.post("/orders", orderData);
      localStorage.removeItem("cart");
      setCart([]);
      setMessage("Order placed");
    } catch {
      setMessage("Error placing order");
    }
  };

  return (
    <Layout>
      <h2>Cart</h2>
      {message && <p>{message}</p>}

      {cart.map((item) => (
        <div key={item.id}>
          {item.name} Rs {item.price}
          <input type="number" value={item.quantity} min="1" onChange={(e) => updateQty(item.id, e.target.value)} />
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}

      <button onClick={placeOrder}>Place Order</button>
    </Layout>
  );
}

export default Cart;
