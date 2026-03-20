export type ApiToken = string;

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  age?: number;
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  age?: number;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface JwtUserPayload {
  id?: string;
  sub?: string; // usually email
  firstName?: string;
  lastName?: string;
  roles?: string[];
  exp?: number; // seconds
  iat?: number; // seconds
}

export interface AuthSession {
  token: ApiToken;
  payload?: JwtUserPayload;
  raw?: unknown;
}

