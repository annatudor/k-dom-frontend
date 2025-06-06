// src/context/AuthContext.tsx - FIXED VERSION
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
  const [isLoading, setIsLoading] = useState(true); // ✅ Start with true
  const [isInitialized, setIsInitialized] = useState(false); // ✅ Track initialization

  // ✅ Initialize token from localStorage
  useEffect(() => {
    console.log("=== AuthProvider INITIALIZATION ===");

    const initializeAuth = () => {
      const storedToken = localStorage.getItem("token");
      console.log("📦 Stored token exists:", !!storedToken);

      if (storedToken) {
        console.log("🔄 Setting token from localStorage");
        setToken(storedToken);
      }

      console.log("✅ Auth initialization complete");
      setIsInitialized(true);
      setIsLoading(false);
    };

    // Small delay to ensure localStorage is ready
    const timer = setTimeout(initializeAuth, 10);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Calculate user from token
  const user = useMemo(() => {
    console.log("=== AuthContext useMemo User Calculation ===");
    console.log("🔍 isLoading:", isLoading);
    console.log("🔍 isInitialized:", isInitialized);
    console.log("🔍 token exists:", !!token);

    // ✅ Don't calculate user until initialization is complete
    if (!isInitialized || isLoading) {
      console.log("⏳ Still initializing, returning null user");
      return null;
    }

    if (!token) {
      console.log("❌ No token, returning null user");
      return null;
    }

    const decoded = decodeToken(token);
    console.log("🔍 Decoded token:", decoded);

    if (!decoded) {
      console.log("❌ Token decode failed, removing invalid token");
      localStorage.removeItem("token");
      setToken(null);
      return null;
    }

    // Check if token is expired
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      console.log("❌ Token expired, removing");
      localStorage.removeItem("token");
      setToken(null);
      return null;
    }

    const { sub, username, role, avatarUrl } = decoded;
    if (!sub || !username || !role) {
      console.log("❌ Missing required fields in token");
      return null;
    }

    const userObj = {
      id: parseInt(sub),
      username,
      role,
      avatarUrl,
    };

    console.log("✅ User calculated successfully:", userObj);
    return userObj;
  }, [token, isLoading, isInitialized]);

  // ✅ Calculate isAuthenticated more carefully
  const isAuthenticated = useMemo(() => {
    const authenticated = !isLoading && isInitialized && !!token && !!user;
    console.log("🔐 isAuthenticated calculation:");
    console.log("  - isLoading:", isLoading);
    console.log("  - isInitialized:", isInitialized);
    console.log("  - hasToken:", !!token);
    console.log("  - hasUser:", !!user);
    console.log("  - RESULT:", authenticated);
    return authenticated;
  }, [isLoading, isInitialized, token, user]);

  const login = (data: SignInResponse) => {
    console.log("🔑 Login called with data:", data);

    if (!data.token) {
      console.error("❌ No token in login data");
      return;
    }

    console.log("💾 Saving token to localStorage");
    localStorage.setItem("token", data.token);
    setToken(data.token);
    console.log("✅ Login complete");
  };

  const logout = () => {
    console.log("🚪 Logout called");
    localStorage.removeItem("token");
    setToken(null);
    setIsLoading(false);
    console.log("✅ Logout complete");
  };

  const contextValue = {
    token,
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
  };

  console.log("🎯 AuthContext final state:", {
    hasToken: !!token,
    hasUser: !!user,
    isAuthenticated,
    userRole: user?.role,
    isLoading,
    isInitialized,
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
