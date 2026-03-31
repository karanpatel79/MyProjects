import { useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddProduct() {
  const [product, setProduct] = useState({ name: "", category: "", price: "", stockQuantity: "", description: "" });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!product.name || !product.category || !product.price || !product.stockQuantity) {
      toast.error("Please fill all required fields");
      return;
    }
    if (Number(product.price) <= 0 || Number(product.stockQuantity) < 0) {
      toast.error("Price must be > 0 and stock must be >= 0");
      return;
    }
    try {
      await API.post("/products", {
        ...product,
        price: Number(product.price),
        stockQuantity: Number(product.stockQuantity),
      });
      toast.success("Product added successfully!");
      navigate("/products");
    } catch {
      toast.error("Error adding product");
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Add Product</h2>
        <p className="text-gray-400 text-sm mt-1">Fill in the details to add a new product</p>
      </div>

      <div className="card max-w-lg w-full">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Product Name *</label>
            <input className="input" placeholder="Wireless Keyboard" onChange={(e) => setProduct({ ...product, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
            <input className="input" placeholder="Electronics" onChange={(e) => setProduct({ ...product, category: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Price (Rs) *</label>
              <input type="number" className="input" placeholder="0.00" onChange={(e) => setProduct({ ...product, price: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Stock *</label>
              <input type="number" className="input" placeholder="0" onChange={(e) => setProduct({ ...product, stockQuantity: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Product description..." onChange={(e) => setProduct({ ...product, description: e.target.value })} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button onClick={handleSubmit} className="btn flex-1">
              Add Product
            </button>
            <button onClick={() => navigate("/products")} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddProduct;
