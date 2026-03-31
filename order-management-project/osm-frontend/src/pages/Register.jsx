import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }
    if (form.password.length < 4) {
      toast.error("Password should be at least 4 characters");
      return;
    }
    setLoading(true);
    try {
      await registerUser(form);
      toast.success("Registered successfully!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data;
      toast.error(typeof msg === "string" ? msg : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-purple-100 w-full max-w-md p-6 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-sm font-semibold">OMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-400 mt-1 text-sm">Join OMS today</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
            <input className="input" placeholder="Your full name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input className="input" placeholder="you@example.com" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <div className="relative">
              <input
                className="input pr-10"
                placeholder="********"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="btn w-full mt-2">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>

        <p className="text-sm text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <Link to="/" className="text-purple-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
