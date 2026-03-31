import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRole, getUser } from "../utils/auth";
import { clearAuth } from "../services/api";
import { LayoutDashboard, Package, ShoppingCart, Users, ClipboardList, LogOut, Menu, X } from "lucide-react";

function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const role = getRole();
  const user = getUser();

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
      location.pathname === path ? "bg-purple-600 text-white shadow-md" : "text-gray-500 hover:bg-purple-50 hover:text-purple-700"
    }`;

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const handleNav = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-purple-100 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-purple-700">OMS</h1>
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="p-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/30 z-20" onClick={() => setMobileMenuOpen(false)} />}

      <aside
        className={`fixed lg:static top-0 left-0 z-30 h-full w-72 bg-white border-r border-purple-100 p-5 flex flex-col justify-between shadow-sm transform transition-transform duration-200 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          <div className="mb-8 mt-2 lg:mt-0">
            <h1 className="text-2xl font-bold text-purple-700 tracking-tight">OMS</h1>
            <p className="text-xs text-gray-400 mt-1">Order Management System</p>
          </div>

          <nav className="flex flex-col gap-1.5">
            <Link to="/dashboard" className={linkClass("/dashboard")} onClick={handleNav}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/products" className={linkClass("/products")} onClick={handleNav}>
              <Package size={18} /> Products
            </Link>

            {role === "CUSTOMER" && (
              <Link to="/my-orders" className={linkClass("/my-orders")} onClick={handleNav}>
                <ShoppingCart size={18} /> My Orders
              </Link>
            )}

            {role === "ADMIN" && (
              <>
                <Link to="/orders" className={linkClass("/orders")} onClick={handleNav}>
                  <ClipboardList size={18} /> All Orders
                </Link>
                <Link to="/admin/users" className={linkClass("/admin/users")} onClick={handleNav}>
                  <Users size={18} /> Customers
                </Link>
              </>
            )}
          </nav>
        </div>

        <div>
          <div className="mb-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
            <p className="text-sm font-semibold text-purple-800">{user?.name || "Guest"}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
            <span className="inline-block mt-1 text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">{role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 py-2 rounded-xl hover:bg-red-100 transition text-sm font-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}

export default Layout;
