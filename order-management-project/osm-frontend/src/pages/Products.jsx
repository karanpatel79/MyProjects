import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { getRole } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ShoppingCart, MinusCircle, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});
  const role = getRole();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch {
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted!");
      fetchProducts();
    } catch {
      toast.error("Error deleting product");
    }
  };

  const updateQuantity = (productId, value, stock) => {
    const next = Math.max(0, Math.min(stock, value));
    setQuantities((prev) => ({ ...prev, [productId]: next }));
  };

  const increaseQty = (product) => {
    const current = quantities[product.id] || 0;
    updateQuantity(product.id, current + 1, product.stockQuantity);
  };

  const decreaseQty = (product) => {
    const current = quantities[product.id] || 0;
    updateQuantity(product.id, current - 1, product.stockQuantity);
  };

  const placeCombinedOrder = async () => {
    const items = products
      .filter((p) => (quantities[p.id] || 0) > 0)
      .map((p) => ({
        productId: p.id,
        quantity: quantities[p.id],
      }));

    if (items.length === 0) {
      toast.error("Select quantity for at least one product");
      return;
    }

    try {
      await API.post("/orders", { items });
      toast.success("Order placed for selected items!");
      setQuantities({});
      fetchProducts();
    } catch {
      toast.error("Error placing order");
    }
  };

  const filtered = products.filter((p) => p?.name?.toLowerCase().includes(search.toLowerCase()));

  const selectedSummary = useMemo(() => {
    const selectedProducts = products.filter((p) => (quantities[p.id] || 0) > 0);
    const totalDistinct = selectedProducts.length;
    const totalQty = selectedProducts.reduce((sum, p) => sum + (quantities[p.id] || 0), 0);
    return { totalDistinct, totalQty };
  }, [products, quantities]);

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-400 text-sm mt-1">{products.length} products available</p>
        </div>
        {role === "ADMIN" && (
          <button onClick={() => navigate("/add-product")} className="btn flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <input placeholder="Search products..." className="input w-full sm:max-w-sm" onChange={(e) => setSearch(e.target.value)} />
        {role === "CUSTOMER" && (
          <>
            <button
              onClick={placeCombinedOrder}
              disabled={selectedSummary.totalDistinct === 0}
              className="btn-success flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />
              Order Now
            </button>
            <span className="text-sm text-gray-500">
              Selected: {selectedSummary.totalDistinct} products, {selectedSummary.totalQty} qty
            </span>
          </>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-purple-400 font-medium">Loading products...</div>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="card p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{p.name}</p>
                    <span className="inline-block mt-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">{p.category}</span>
                  </div>
                  <p className="text-purple-700 font-bold">Rs {p.price}</p>
                </div>
                <div className="mb-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.stockQuantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {p.stockQuantity > 0 ? `${p.stockQuantity} in stock` : "Out of stock"}
                  </span>
                </div>
                {role === "CUSTOMER" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(p)}
                      disabled={(quantities[p.id] || 0) <= 0}
                      className="p-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-40"
                    >
                      <MinusCircle size={14} />
                    </button>
                    <input
                      type="number"
                      min="0"
                      max={p.stockQuantity}
                      value={quantities[p.id] || 0}
                      onChange={(e) => updateQuantity(p.id, Number(e.target.value || 0), p.stockQuantity)}
                      className="no-spinner w-16 border border-purple-200 p-1.5 rounded-lg text-sm text-center"
                    />
                    <button
                      onClick={() => increaseQty(p)}
                      disabled={(quantities[p.id] || 0) >= p.stockQuantity}
                      className="p-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-40"
                    >
                      <PlusCircle size={14} />
                    </button>
                  </div>
                )}
                {role === "ADMIN" && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => navigate(`/edit-product/${p.id}`)}
                      className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-100 transition"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="btn-danger flex items-center gap-1">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No products found</div>}
          </div>

          <div className="hidden md:block card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="table-head">Product</th>
                    <th className="table-head">Category</th>
                    <th className="table-head">Price</th>
                    <th className="table-head">Stock</th>
                    <th className="table-head">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="table-cell font-medium text-gray-800">{p.name}</td>
                      <td className="table-cell">
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">{p.category}</span>
                      </td>
                      <td className="table-cell font-semibold text-purple-700">Rs {p.price}</td>
                      <td className="table-cell">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            p.stockQuantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {p.stockQuantity > 0 ? `${p.stockQuantity} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          {role === "CUSTOMER" && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => decreaseQty(p)}
                                disabled={(quantities[p.id] || 0) <= 0}
                                className="p-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-40"
                              >
                                <MinusCircle size={14} />
                              </button>
                              <input
                                type="number"
                                min="0"
                                max={p.stockQuantity}
                                value={quantities[p.id] || 0}
                                onChange={(e) => updateQuantity(p.id, Number(e.target.value || 0), p.stockQuantity)}
                                className="no-spinner w-16 border border-purple-200 p-1.5 rounded-lg text-sm text-center"
                              />
                              <button
                                onClick={() => increaseQty(p)}
                                disabled={(quantities[p.id] || 0) >= p.stockQuantity}
                                className="p-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-40"
                              >
                                <PlusCircle size={14} />
                              </button>
                            </div>
                          )}
                          {role === "ADMIN" && (
                            <>
                              <button
                                onClick={() => navigate(`/edit-product/${p.id}`)}
                                className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-100 transition"
                              >
                                <Pencil size={14} /> Edit
                              </button>
                              <button onClick={() => handleDelete(p.id)} className="btn-danger flex items-center gap-1">
                                <Trash2 size={14} /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No products found</div>}
          </div>
        </>
      )}
    </Layout>
  );
}

export default Products;
