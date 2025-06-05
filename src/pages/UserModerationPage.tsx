// src/pages/UserModerationPage.tsx
import { Box, Container } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserModerationDashboard } from "@/components/kdom/moderation/UserModerationDashboard";

export default function UserModerationPage() {
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box>
      <Container maxW="container.xl">
        <UserModerationDashboard />
      </Container>
    </Box>
  );
}
