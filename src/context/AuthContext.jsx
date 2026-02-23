import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "aurenza_token";
const ROLE_KEY = "aurenza_role";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY));

  const login = ({ token: nextToken, role: nextRole }) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(ROLE_KEY, nextRole);
    setToken(nextToken);
    setRole(nextRole);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    setToken(null);
    setRole(null);
  };

  const value = useMemo(
    () => ({
      token,
      role,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [token, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
