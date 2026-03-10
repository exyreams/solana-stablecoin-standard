import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { authApi } from "../lib/api/auth";
import type { AuthCredentials } from "../lib/api/auth";

interface Admin {
  id: string;
  username: string;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (credentials: AuthCredentials) => {
    const data = await authApi.login(credentials);
    if (data.token) {
      localStorage.setItem("admin_token", data.token);
      setIsAuthenticated(true);
      setAdmin({ id: "", username: credentials.username });
    }
  };

  const register = async (credentials: AuthCredentials) => {
    await authApi.register(credentials);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
      setAdmin({ id: "", username: "Admin" });
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
