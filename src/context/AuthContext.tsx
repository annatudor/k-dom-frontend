// src/context/AuthContext.tsx
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
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("=== AuthProvider useEffect ===");

    const storedToken = localStorage.getItem("token");
    console.log("Stored token exists:", !!storedToken);

    if (storedToken) {
      console.log("Setting token from localStorage");
      setToken(storedToken);
    }

    setIsLoading(false);
    console.log("=== End AuthProvider useEffect ===");
  }, []);

  const user = useMemo(() => {
    console.log("=== AuthContext useMemo Debug ===");
    console.log("Token exists:", !!token);
    console.log("Is loading:", isLoading);

    if (!token || isLoading) {
      console.log("No token or still loading, returning null");
      return null;
    }

    const decoded = decodeToken(token);
    console.log("Decoded token:", decoded);

    if (!decoded) {
      console.log("Token decode failed, returning null");
      // Remove invalid token
      localStorage.removeItem("token");
      setToken(null);
      return null;
    }

    // Check if token is expired
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      console.log("Token expired, removing");
      localStorage.removeItem("token");
      setToken(null);
      return null;
    }

    const { sub, username, role, avatarUrl } = decoded;
    console.log("Extracted values:", { sub, username, role, avatarUrl });

    if (!sub || !username || !role) {
      console.log("Missing required fields in token");
      return null;
    }

    const userObj = {
      id: parseInt(sub),
      username,
      role,
      avatarUrl,
    };

    console.log("Final user object:", userObj);
    console.log("User role:", userObj.role);
    console.log("Is admin?", userObj.role === "admin");
    console.log("Is moderator?", userObj.role === "moderator");
    console.log("=== End AuthContext Debug ===");

    return userObj;
  }, [token, isLoading]);

  const login = (data: SignInResponse) => {
    console.log("Login called with data:", data);

    if (!data.token) {
      console.error("No token in login data");
      return;
    }

    console.log("Setting token:", data.token);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    console.log("Token set in localStorage");
  };

  const logout = () => {
    console.log("Logout called");
    localStorage.removeItem("token");
    setToken(null);
  };

  const contextValue = {
    token,
    isAuthenticated: !!token && !!user,
    user,
    login,
    logout,
    isLoading,
  };

  console.log("AuthContext providing:", {
    hasToken: !!token,
    hasUser: !!user,
    isAuthenticated: contextValue.isAuthenticated,
    userRole: user?.role,
    isLoading,
  });

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
