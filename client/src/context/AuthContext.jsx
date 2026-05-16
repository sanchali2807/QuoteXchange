import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

// decode once, return the fields we need
const decodeToken = (token) => {
  if (!token) return { role: null, userId: null };
  try {
    const decoded = jwtDecode(token);
    return { role: decoded.role, userId: decoded.id };
  } catch {
    return { role: null, userId: null };
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  // derived from token — no extra state needed
  const { role, userId } = decodeToken(token);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}