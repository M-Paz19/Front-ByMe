import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/auth",
  headers: { Accept: "application/json" },
});

const PUBLIC_ENDPOINTS = ["/login", "/register", "/health", "/api/health"];

api.interceptors.request.use((config) => {
  const url = config.url ?? "";

  // No adjuntar token en endpoints públicos
  const isPublic = PUBLIC_ENDPOINTS.some((p) => url.startsWith(p));
  if (isPublic) return config;

  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;