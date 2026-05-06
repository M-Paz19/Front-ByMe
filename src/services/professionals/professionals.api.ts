import axios from "axios";
import { getToken } from "../auth/storage";

export const professionalsApi = axios.create({
  baseURL: "/api/v1",
  headers: { Accept: "application/json" },
});

professionalsApi.interceptors.request.use((config) => {
  const token = (getToken() || "").replace(/^Bearer\s+/i, "");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

professionalsApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("PRO API ERROR:", err?.response?.data || err?.message);
    return Promise.reject(err);
  }
);