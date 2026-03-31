import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { getUser, getRole } from "../utils/auth";
import { ShoppingBag, Package, Users } from "lucide-react";
import { toast } from "react-toastify";

function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, products: 0, customers: 0 });
  const user = getUser();
  const role = getRole();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const products = await API.get("/products");
        if (role === "ADMIN") {
          const orders = await API.get("/orders");
          const users = await API.get("/admin/users");
          setStats({
            orders: orders.data.length,
            products: products.data.length,
            customers: users.data.length,
          });
        } else {
          if (!user?.id) return;
          const orders = await API.get(`/orders/customer/${user.id}`);
          setStats({
            orders: orders.data.length,
            products: products.data.length,
            customers: 0,
          });
        }
      } catch {
        toast.error("Unable to load dashboard stats");
      }
    };

    fetchStats();
  }, [role, user?.id]);

  const cards =
    role === "ADMIN"
      ? [
          { label: "Total Orders", value: stats.orders, icon: <ShoppingBag size={22} />, color: "bg-purple-500" },
          { label: "Products", value: stats.products, icon: <Package size={22} />, color: "bg-blue-500" },
          { label: "Customers", value: stats.customers, icon: <Users size={22} />, color: "bg-green-500" },
        ]
      : [
          { label: "My Orders", value: stats.orders, icon: <ShoppingBag size={22} />, color: "bg-purple-500" },
          { label: "Products Available", value: stats.products, icon: <Package size={22} />, color: "bg-blue-500" },
        ];

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Hello, {user?.name}</h2>
        <p className="text-gray-400 mt-1">Here is what is happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="card flex items-center gap-5 hover:shadow-lg transition-shadow">
            <div className={`${c.color} text-white p-4 rounded-2xl shadow-md`}>{c.icon}</div>
            <div>
              <p className="text-gray-400 text-sm">{c.label}</p>
              <h3 className="text-3xl font-bold text-gray-800">{c.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Dashboard;
