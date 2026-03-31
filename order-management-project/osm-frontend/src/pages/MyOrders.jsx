import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { getUser } from "../utils/auth";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const user = getUser();
  const [loading, setLoading] = useState(Boolean(user?.id));

  useEffect(() => {
    if (!user?.id) return;

    API.get(`/orders/customer/${user.id}`)
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const resendInvoice = async (orderId) => {
    try {
      await API.post(`/orders/${orderId}/resend-invoice`);
      toast.success("Invoice sent to your email");
    } catch {
      toast.error("Failed to resend invoice");
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
        <p className="text-gray-400 text-sm mt-1">{orders.length} orders placed</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-purple-400">Loading...</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card p-0 overflow-hidden">
              <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 cursor-pointer hover:bg-purple-50/40 transition"
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              >
                <div className="flex items-center flex-wrap gap-2 sm:gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 font-bold text-sm">
                    #{o.id}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Order #{o.id}</p>
                    <p className="text-xs text-gray-400">{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      o.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {o.status}
                  </span>
                  <span className="font-bold text-purple-700">Rs {o.totalAmount?.toFixed(2)}</span>
                  {expanded === o.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </div>

              {expanded === o.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</p>
                  <div className="space-y-2">
                    {o.items?.map((i) => (
                      <div key={i.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm">
                        <span className="text-gray-700">{i.product?.name}</span>
                        <span className="text-gray-500">
                          Rs {((i.price || 0) / (i.quantity || 1)).toFixed(2)} x {i.quantity} = Rs {i.price?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => resendInvoice(o.id)}
                      className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-100 transition"
                    >
                      Resend Invoice
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {orders.length === 0 && <div className="text-center py-16 text-gray-400">No orders placed yet</div>}
        </div>
      )}
    </Layout>
  );
}

export default MyOrders;
