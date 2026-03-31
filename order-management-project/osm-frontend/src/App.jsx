import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import ForgotPassword from "./pages/ForgotPassword";
import MyOrders from "./pages/MyOrders";
import { isLoggedIn, getRole } from "./utils/auth";

const PrivateRoute = ({ children }) =>
  isLoggedIn() ? children : <Navigate to="/" />;

const AdminRoute = ({ children }) =>
  isLoggedIn() && getRole() === "ADMIN" ? children : <Navigate to="/dashboard" />;

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
        <Route path="/orders" element={<AdminRoute><Orders /></AdminRoute>} />
        <Route path="/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="/edit-product/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;