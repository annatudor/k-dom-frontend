// src/pages/AdminModerationPage.tsx
import {
  Box,
  Container,
  Alert,
  AlertIcon,
  Spinner,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ModerationDashboard } from "@/components/kdom/moderation/ModerationDashboard";

export default function AdminModerationPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Comprehensive debug info
  console.log("=== AdminModerationPage Debug ===");
  console.log("isLoading:", isLoading);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("user:", user);
  console.log("user?.role:", user?.role);
  console.log("typeof user?.role:", typeof user?.role);
  console.log("user?.role === 'admin':", user?.role === "admin");
  console.log("user?.role === 'moderator':", user?.role === "moderator");
  console.log("localStorage token:", localStorage.getItem("token"));
  console.log("=== End AdminModerationPage Debug ===");

  // Show loading spinner while auth is initializing
  if (isLoading) {
    return (
      <Box py={8}>
        <Container maxW="container.lg">
          <VStack spacing={4}>
            <Spinner size="xl" thickness="4px" color="purple.500" />
            <Text>Loading authentication...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin or moderator
  const isModeratorOrAdmin =
    user?.role === "admin" || user?.role === "moderator";

  console.log("isModeratorOrAdmin:", isModeratorOrAdmin);

  if (!isModeratorOrAdmin) {
    return (
      <Box py={8}>
        <Container maxW="container.lg">
          <Alert status="error">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">Access Denied</Text>
              <Text>
                You don't have permission to access the moderation dashboard.
                This area is restricted to administrators and moderators only.
              </Text>
              <Text fontSize="sm" color="gray.600">
                Your current role: {user?.role || "unknown"}
              </Text>
            </VStack>
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
