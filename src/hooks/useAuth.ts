import { useContext, createContext } from "react";

interface User {
  id: string;
  username: string;
  avatar: string;
  role: "user" | "moderator" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: {
    id: "123",
    username: "TestUser",
    avatar: "https://ui-avatars.com/api/?name=Test+User",
    role: "user",
  },
  isAuthenticated: true,
});

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   isAuthenticated: false,
// });

export const useAuth = () => useContext(AuthContext);
