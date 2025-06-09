// src/pages/AuditLogPage.tsx - FIXED VERSION

import {
  Box,
  Container,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { AuditLogDashboard } from "@/components/audit-log/AuditLogDashboard";
import { useAuth } from "@/hooks/useAuth";

export default function AuditLogPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // Loading state
  if (isLoading) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="7xl">
          <VStack spacing={4} py={20}>
            <Spinner size="xl" thickness="4px" color="purple.500" />
            <Text fontSize="lg" color="gray.600">
              Loading...
            </Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Authentication check
  if (!isAuthenticated) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="7xl">
          <VStack spacing={6} py={20}>
            <Alert status="warning" maxW="md">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Authentication Required</Text>
                <Text>You must be logged in to view audit logs.</Text>
              </VStack>
            </Alert>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Permission check
  if (user?.role !== "admin" && user?.role !== "moderator") {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="7xl">
          <VStack spacing={6} py={20}>
            <Alert status="error" maxW="md">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Access Denied</Text>
                <Text>
                  You don't have permission to view audit logs. Only
                  administrators and moderators can access this page.
                </Text>
              </VStack>
            </Alert>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Render the dashboard
  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="7xl" p={0}>
        <AuditLogDashboard />
      </Container>
    </Box>
  );
}
