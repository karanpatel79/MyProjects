import { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function CustomerOrder() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [message, setMessage] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch {
      setMessage("Error loading products");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const updateQuantity = (id, value) => {
    const qty = Math.max(0, Number(value) || 0);
    setCart({ ...cart, [id]: qty });
  };

  const placeOrder = async () => {
    const items = products
      .filter((p) => cart[p.id] > 0)
      .map((p) => ({
        productId: p.id,
        quantity: cart[p.id],
      }));

    if (items.length === 0) {
      setMessage("Select products first");
      return;
    }

    try {
      await API.post("/orders", { items });
      setMessage("Order placed");
      setCart({});
    } catch {
      setMessage("Error placing order");
    }
  };

  return (
    <Layout>
      <h2>Place Order</h2>
      {message && <p>{message}</p>}

      {products.map((p) => (
        <div key={p.id}>
          {p.name} Rs {p.price}
          <input type="number" min="0" value={cart[p.id] || ""} onChange={(e) => updateQuantity(p.id, e.target.value)} />
        </div>
      ))}

      <button onClick={placeOrder}>Place Order</button>
    </Layout>
  );
}

export default CustomerOrder;
