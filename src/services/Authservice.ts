import api from "./api";

// 🟢 LOGIN
export const login = (email: string, password: string) => {
  return api.post("/login", { email, password });
};

// 🟢 REGISTER
export const register = (data: {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  return api.post("/register", data);
};

// 🔐 LOGOUT
export const logout = () => {
  return api.post("/logout");
};