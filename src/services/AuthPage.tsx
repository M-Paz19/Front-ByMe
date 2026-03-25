import { useState } from "react";
import { login } from "../services/Authservice";

export function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login(email, password);

      console.log("LOGIN OK:", res.data);

      localStorage.setItem("token", res.data.token);

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="correo"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}