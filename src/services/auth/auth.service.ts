import api from "../api";
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  UserProfileResponse,
} from "./auth.types";
import { decodeJwtPayload } from "./jwt";

type LoginSession = {
  token: string;
  payload: any;
};

function extractToken(data: any): string | null {
  if (!data) return null;

  if (typeof data === "string") return data;
  if (typeof data.token === "string") return data.token;
  if (typeof data.accessToken === "string") return data.accessToken;
  if (typeof data.access_token === "string") return data.access_token;
  if (typeof data.jwt === "string") return data.jwt;
  if (typeof data.jwtToken === "string") return data.jwtToken;

  if (typeof data.data?.token === "string") return data.data.token;
  if (typeof data.data?.accessToken === "string") return data.data.accessToken;

  return null;
}

function sanitize<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as Partial<T>;
}

export class AuthService {
  static async register(data: RegisterRequest): Promise<void> {
    await api.post("/register", data);
  }

  static async login(data: LoginRequest): Promise<LoginSession> {
    const res = await api.post("/login", data, {
      headers: { "Content-Type": "application/json" },
    });

    const token = extractToken(res.data);
    if (!token) {
      throw new Error("No se encontró token en la respuesta de /login.");
    }

    const payload = decodeJwtPayload(token);
    return { token, payload };
  }

  static async logout(): Promise<void> {
    await api.post("/logout");
  }

  static async getProfile() {
  const res = await api.get("/profile");
  return res.data;
}

static async updateProfile(
  request: UpdateProfileRequest,
  file?: File | null
): Promise<UserProfileResponse> {
  const cleaned = sanitize({
    firstName: request.firstName,
    lastName: request.lastName,
    phone: request.phone,
    address: request.address,
    age: request.age,
  });

  const form = new FormData();

  const jsonFile = new File(
    [JSON.stringify(cleaned)],
    "request.json",
    { type: "application/json" }
  );
  form.append("request", jsonFile);

  if (file) {
    form.append("file", file, file.name);
  }

  const res = await api.put("/update-profile", form, {
    headers: { Accept: "application/json" },
  });

  return res.data as UserProfileResponse;
}

  

}