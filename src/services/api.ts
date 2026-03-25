import axios from "axios";
import { getToken } from "./auth/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: "application/json" },
});

const PUBLIC_ENDPOINTS = ["/login", "/register", "/health", "/api/health"];

api.interceptors.request.use((config) => {
  const url = config.url ?? "";
  const isPublic = PUBLIC_ENDPOINTS.some((p) => url.startsWith(p));
  if (isPublic) return config;

  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err?.response?.data || err?.message);
    return Promise.reject(err);
  }
);

export default api;