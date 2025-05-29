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
    setToken(localStorage.getItem("token"));
  }, []);

  const user = useMemo(() => {
    if (!token) return null;
    const decoded = decodeToken(token);
    if (!decoded) return null;

    const { sub, username, role, avatarUrl } = decoded;
    return {
      id: parseInt(sub),
      username,
      role,
      avatarUrl,
    };
  }, [token]);

  const login = (data: SignInResponse) => {
    localStorage.setItem("token", data.token);
    setToken(data.token);
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
