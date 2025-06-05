// context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { decodeToken } from "@/utils/decodeToken";
import type { SignInResponse } from "@/types/Auth";

export interface AuthUser {
  id: number;
  username: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextProps {
  token: string | null;
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (data: SignInResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("useEffect - stored token:", storedToken);
    setToken(storedToken);
  }, []);

  const user = useMemo(() => {
    console.log("=== AuthContext useMemo Debug ===");
    console.log("Token exists:", !!token);

    if (!token) {
      console.log("No token, returning null");
      return null;
    }

    const decoded = decodeToken(token);
    console.log("Decoded token:", decoded);

    if (!decoded) {
      console.log("Token decode failed, returning null");
      return null;
    }

    const { sub, username, role, avatarUrl } = decoded;
    console.log("Extracted values:", { sub, username, role, avatarUrl });

    const userObj = {
      id: parseInt(sub),
      username,
      role,
      avatarUrl,
    };

    console.log("Final user object:", userObj);
    console.log("=== End AuthContext Debug ===");

    return userObj;
  }, [token]);

  const login = (data: SignInResponse) => {
    console.log("Login called with data:", data);
    console.log("Setting token:", data.token);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    console.log("Token set in localStorage:", localStorage.getItem("token"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
