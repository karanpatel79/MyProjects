import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/send-otp", { email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch {
      toast.error("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified!");
      setStep(3);
    } catch {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!password) {
      toast.error("Please enter new password");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/reset-password", { email, otp, password });
      toast.success("Password reset successful!");
      setTimeout(() => (window.location.href = "/"), 1200);
    } catch {
      toast.error("Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-purple-100 w-full max-w-md p-6 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Step {step} of 3 - {step === 1 ? "Enter Email" : step === 2 ? "Verify OTP" : "New Password"}
          </p>
          <div className="flex gap-2 justify-center mt-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 w-12 rounded-full transition-all ${s <= step ? "bg-purple-600" : "bg-gray-200"}`} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                <input type="email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button onClick={sendOtp} disabled={loading} className="btn w-full">
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Enter OTP</label>
                <input
                  type="text"
                  className="input text-center tracking-widest text-lg"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button onClick={verifyOtp} disabled={loading} className="btn w-full">
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button onClick={() => { setStep(1); setOtp(""); }} className="w-full text-sm text-purple-600 hover:underline">
                Back
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
                <input type="password" className="input" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button onClick={resetPassword} disabled={loading} className="btn w-full">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </div>

        <p className="text-sm text-center mt-6">
          <Link to="/" className="text-purple-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
