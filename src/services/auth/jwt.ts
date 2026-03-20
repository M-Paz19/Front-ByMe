import type { JwtUserPayload } from "./auth.types";

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

export function decodeJwtPayload(token: string): JwtUserPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const json = base64UrlDecode(parts[1]);
    return JSON.parse(json) as JwtUserPayload;
  } catch {
    return null;
  }
}

export function isJwtExpired(payload: JwtUserPayload | null): boolean {
  if (!payload?.exp) return false;
  // exp is in seconds
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSec;
}

export function mapRolesToAppRole(roles?: string[]): "usuario" | "profesional" | "admin" {
  const normalized = (roles || []).map((r) => r.toUpperCase());
  if (normalized.includes("ADMIN")) return "admin";
  if (normalized.includes("PROFESSIONAL") || normalized.includes("PRO") || normalized.includes("PROFESIONAL")) return "profesional";
  // backend sample uses USER
  return "usuario";
}
