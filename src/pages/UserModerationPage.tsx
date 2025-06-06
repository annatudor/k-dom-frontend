// src/pages/UserModerationPage.tsx - FIXED VERSION
import { Box, Container, Text, Spinner, VStack } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserModerationDashboard } from "@/components/moderation/UserModerationDashboard";

export default function UserModerationPage() {
  const { isAuthenticated, user, token, isLoading } = useAuth();

  console.log("🔍 UserModerationPage render:");
  console.log("  - isLoading:", isLoading);
  console.log("  - token exists:", !!token);
  console.log("  - user exists:", !!user);
  console.log("  - isAuthenticated:", isAuthenticated);

  if (isLoading) {
    console.log("⏳ Still loading auth, showing spinner");
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="gray.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" color="purple.500" />
          <Text fontSize="lg" color="gray.600">
            Loading authentication...
          </Text>
          <Text fontSize="sm" color="gray.500">
            Please wait while we verify your session
          </Text>
        </VStack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log(
      " Not authenticated after loading complete, redirecting to login"
    );
    console.log("Debug info:");
    console.log("  - Token in localStorage:", !!localStorage.getItem("token"));
    console.log("  - Current token state:", !!token);
    console.log("  - Current user state:", !!user);

    return <Navigate to="/login" replace />;
  }

  console.log("✅Authentication successful, rendering dashboard");
  return (
    <Box>
      <Container maxW="container.xl">
        <UserModerationDashboard />
      </Container>
    </Box>
  );
}
