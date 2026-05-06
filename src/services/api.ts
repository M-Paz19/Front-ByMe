import axios from "axios";
import { getToken } from "./auth/storage";

/**
 * Instancia axios para endpoints de auth.
 *
 * baseURL fija a "/auth" — NO leer de variables de entorno para evitar
 * que valores mal configurados en Vercel rompan la app.
 *
 * NOTA sobre las URLs en auth.service.ts:
 * Esos servicios usan rutas absolutas como `api.post("/auth/login")`.
 * Cuando una URL es absoluta (empieza con "/"), axios IGNORA el baseURL
 * y usa la ruta tal cual. Por eso `api.post("/auth/login")` siempre
 * llega a "/auth/login" sin importar qué tenga la baseURL.
 *
 * "/auth/login" es interceptado por:
 *  - Desarrollo: proxy de Vite (vite.config.ts → '/auth')
 *  - Producción (Vercel): rewrites de vercel.json
 *
 * Ambos redirigen a https://dz5rvnxq1a.execute-api.us-east-2.amazonaws.com/auth/login.
 */
const api = axios.create({
  baseURL: "/auth",
  headers: { Accept: "application/json" },
});

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/health",
  "/api/health",
];

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