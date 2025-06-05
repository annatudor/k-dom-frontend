// src/pages/AdminModerationPage.tsx
import { Box, Container, Alert, AlertIcon } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ModerationDashboard } from "@/components/kdom/moderation/ModerationDashboard";

export default function AdminModerationPage() {
  const { user, isAuthenticated } = useAuth();

  // Debug info extins
  console.log("AdminModerationPage - Debug info:", {
    user,
    isAuthenticated,
    userRole: user?.role,
    userRoleType: typeof user?.role,
    isAdminCheck: user?.role === "admin",
    isModeratorCheck: user?.role === "moderator",
    allUserProps: user ? Object.keys(user) : null,
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin or moderator
  const isModeratorOrAdmin =
    user?.role === "admin" || user?.role === "moderator";

  if (!isModeratorOrAdmin) {
    return (
      <Box py={8}>
        <Container maxW="container.lg">
          <Alert status="error">
            <AlertIcon />
            You don't have permission to access the moderation dashboard. This
            area is restricted to administrators and moderators only.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Container maxW="container.xl">
        <ModerationDashboard />
      </Container>
    </Box>
  );
}
