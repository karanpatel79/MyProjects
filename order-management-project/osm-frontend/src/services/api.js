import axios from "axios";

const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const normalizedBaseUrl = envBaseUrl
  ? envBaseUrl.replace(/\/+$/, "")
  : "http://localhost:8080/api";

const API = axios.create({
  baseURL: normalizedBaseUrl,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export const setAuth = (email, password) => {
  API.defaults.auth = { username: email, password };
  localStorage.setItem("auth", JSON.stringify({ email, password }));
};

export const clearAuth = () => {
  delete API.defaults.auth;
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("auth");
};

// Restore auth on page refresh
const savedAuth = localStorage.getItem("auth");
if (savedAuth) {
  try {
    const { email, password } = JSON.parse(savedAuth);
    API.defaults.auth = { username: email, password };
  } catch {
    clearAuth();
  }
}

// Remove auth header only for pure auth endpoints (register, send-otp, verify-otp, reset-password)
// BUT NOT for login since login needs no auth either
API.interceptors.request.use((config) => {
  const openEndpoints = [
    "/auth/register",
    "/auth/send-otp",
    "/auth/verify-otp",
    "/auth/reset-password",
    "/auth/login",
  ];
  const isOpen = openEndpoints.some(ep => config.url?.includes(ep));
  if (isOpen) {
    const newConfig = { ...config };
    delete newConfig.auth;
    return newConfig;
  }
  return config;
});

export default API;
