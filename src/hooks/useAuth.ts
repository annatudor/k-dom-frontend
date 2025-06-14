// src/hooks/useAuth.ts - FIXED VERSION
import { useAuth as useAuthContext } from "@/context/AuthContext";

// ✅ EXPORT useAuth hook pentru utilizare în alte componente
export const useAuth = () => {
  return useAuthContext();
};

// Helper functions pentru verificarea rolurilor
export const useUserRole = () => {
  const { user } = useAuth();

  return {
    isAdmin: user?.role === "admin",
    isModerator: user?.role === "moderator",
    isModeratorOrAdmin: user?.role === "admin" || user?.role === "moderator",
    isUser: user?.role === "user",
    hasRole: (role: string) => user?.role === role,
    canModerate: user?.role === "admin" || user?.role === "moderator",
  };
};

// Hook pentru verificarea permisiunilor de moderare
export const useModerationAccess = () => {
  const { user, isAuthenticated } = useAuth();

  return {
    canAccessAdminDashboard:
      isAuthenticated && (user?.role === "admin" || user?.role === "moderator"),
    canAccessUserDashboard: isAuthenticated,
    canModerateKDoms:
      isAuthenticated && (user?.role === "admin" || user?.role === "moderator"),
    canForceDelete: isAuthenticated && user?.role === "admin",
    canViewStats:
      isAuthenticated && (user?.role === "admin" || user?.role === "moderator"),
  };
};
