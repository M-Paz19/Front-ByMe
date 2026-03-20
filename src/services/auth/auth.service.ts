import api from "../api";
import type {
  AuthSession,
  LoginRequest,
  RegisterRequest,
} from "./auth.types";
import { decodeJwtPayload } from "./jwt";
import type { UpdateProfileRequest } from "./auth.types";

function extractToken(data: any): string | null {
  if (!data) return null;
  if (typeof data === "string") return data;

  // Common patterns
  return (
    data.token ||
    data.accessToken ||
    data.access_token ||
    data.jwt ||
    data.jwtToken ||
    data.idToken ||
    data.tokenJwt ||
    data?.data?.token ||
    data?.data?.accessToken ||
    data?.data?.access_token ||
    data?.data?.jwt ||
    data?.data?.jwtToken ||
    null
  );
}

function sanitize<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  ) as Partial<T>;
}

export class AuthService {
  /** POST /login */
  static async login(payload: LoginRequest): Promise<AuthSession> {
    const res = await api.post("/login", payload, {
      headers: { "Content-Type": "application/json" },
    });

    const token = extractToken(res.data);
    if (!token) {
      throw new Error(
        "Login exitoso, pero el backend no devolvió un token. Revisa la respuesta de /login."
      );
    }

    return {
      token,
      payload: decodeJwtPayload(token),
      raw: res.data,
    };
  }

  /** POST /register */
  static async register(payload: RegisterRequest): Promise<unknown> {
    const res = await api.post("/register", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  }

  /** POST /logout (requires Bearer token) */
  static async logout(): Promise<void> {
    await api.post("/logout");
  }

  
  static async updateProfile(
  request: UpdateProfileRequest,
  file?: File | null
): Promise<unknown> {
  const cleaned = sanitize({
    firstName: request.firstName,
    lastName: request.lastName,
    phone: request.phone,
    address: request.address,
    age: request.age,
  });

  const form = new FormData();


  form.append(
    "request",
    new Blob([JSON.stringify(cleaned)], { type: "application/json" })
  );

  if (file) {
    form.append("file", file, file.name);
  }

  const res = await api.put("/profile", form, {
    headers: { Accept: "application/json" },
  });

  return res.data;
}
}
