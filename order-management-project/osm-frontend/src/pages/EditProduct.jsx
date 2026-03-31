import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: "", category: "", price: "", stockQuantity: "", description: "" });

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Error loading product"));
  }, [id]);

  const handleUpdate = async () => {
    if (!product.name || !product.category || !product.price || product.stockQuantity === "") {
      toast.error("Please fill all fields");
      return;
    }
    if (Number(product.price) <= 0 || Number(product.stockQuantity) < 0) {
      toast.error("Price must be > 0 and stock must be >= 0");
      return;
    }
    try {
      await API.put(`/products/${id}`, {
        ...product,
        price: Number(product.price),
        stockQuantity: Number(product.stockQuantity),
      });
      toast.success("Product updated successfully!");
      navigate("/products");
    } catch {
      toast.error("Error updating product");
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Edit Product</h2>
        <p className="text-gray-400 text-sm mt-1">Update product details</p>
      </div>

      <div className="card max-w-lg w-full">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Product Name *</label>
            <input className="input" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
            <input className="input" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Price (Rs) *</label>
              <input type="number" className="input" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Stock *</label>
              <input type="number" className="input" value={product.stockQuantity} onChange={(e) => setProduct({ ...product, stockQuantity: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <textarea className="input resize-none" rows={3} value={product.description || ""} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button onClick={handleUpdate} className="btn flex-1">
              Update Product
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

export default EditProduct;
