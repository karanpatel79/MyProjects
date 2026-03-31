import { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";

function AdminOrders() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(`/orders/customer/${id}`);
      setOrders(res.data);
    } catch {
      showMsg("Error loading customer orders", "error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const showMsg = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const markDelivered = async (orderId) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status: "DELIVERED" });
      showMsg("Order marked as delivered!", "success");
      fetchOrders();
    } catch {
      showMsg("Error updating order status", "error");
    }
  };

  const resendInvoice = async (orderId) => {
    try {
      await API.post(`/orders/${orderId}/resend-invoice`);
      showMsg("Invoice sent successfully", "success");
    } catch {
      showMsg("Error sending invoice", "error");
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-1 text-purple-600 hover:underline text-sm mb-4"
        >
          <ArrowLeft size={16} /> Back to Customers
        </button>
        <h2 className="text-3xl font-bold text-gray-800">Customer Orders</h2>
        <p className="text-gray-400 text-sm mt-1">{orders.length} orders found</p>
      </div>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded-xl text-sm font-medium border ${
            message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-purple-400">Loading...</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 font-bold text-sm">
                    #{o.id}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Order #{o.id}</p>
                    <p className="text-xs text-gray-400">{o.orderDate ? new Date(o.orderDate).toLocaleString() : "-"}</p>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                  {o.status === "PENDING" ? (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      <Clock size={12} /> PENDING
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle size={12} /> DELIVERED
                    </span>
                  )}
                  <span className="font-bold text-purple-700">Rs {o.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1.5 mb-3">
                {o.items?.map((i) => (
                  <div key={i.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm text-gray-600">
                    <span>{i.product?.name}</span>
                    <span>Rs {((i.price || 0) / (i.quantity || 1)).toFixed(2)} x {i.quantity} = Rs {i.price?.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {o.status === "PENDING" && (
                  <button
                    onClick={() => markDelivered(o.id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition shadow-sm"
                  >
                    <CheckCircle size={16} />
                    Mark as Delivered
                  </button>
                )}
                <button
                  onClick={() => resendInvoice(o.id)}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-100 transition"
                >
                  Resend Invoice
                </button>
              </div>

              {o.status === "DELIVERED" && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle size={16} />
                  This order has been delivered
                </div>
              )}
            </div>
          ))}

          {orders.length === 0 && <div className="text-center py-16 text-gray-400">No orders for this customer</div>}
        </div>
      )}
    </Layout>
  );
}

export default AdminOrders;
