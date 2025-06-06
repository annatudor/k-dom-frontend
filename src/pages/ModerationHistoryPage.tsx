// src/pages/ModerationHistoryPage.tsx
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AdminModerationHistory } from "@/components/moderation/AdminModerationHistory";
import { UserModerationHistory } from "@/components/moderation/UserModerationHistory";

export default function ModerationHistoryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
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
  return (
    <Box py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb fontSize="sm" color="gray.600">
            <BreadcrumbItem>
              <BreadcrumbLink
                as={RouterLink}
                to="/"
                _hover={{ color: "purple.500" }}
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            {isModeratorOrAdmin ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    as={RouterLink}
                    to="/admin/moderation"
                    _hover={{ color: "purple.500" }}
                  >
                    Moderation Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <Text color="gray.500">History</Text>
                </BreadcrumbItem>
              </>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    as={RouterLink}
                    to="/my-submissions"
                    _hover={{ color: "purple.500" }}
                  >
                    My Submissions
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <Text color="gray.500">History</Text>
                </BreadcrumbItem>
              </>
            )}
          </Breadcrumb>

          {/* Header */}
          <Box>
            <Heading size="xl" color="purple.600" mb={2}>
              {isModeratorOrAdmin
                ? "Moderation History"
                : "Your Submission History"}
            </Heading>
            <Text fontSize="lg" color="gray.600">
              {isModeratorOrAdmin
                ? "Complete history of all moderation actions and decisions"
                : "Detailed history of your K-DOM submissions and their review process"}
            </Text>
          </Box>

          {/* Content */}
          {isModeratorOrAdmin ? (
            <AdminModerationHistory
              limit={200}
              showFilters={true}
              showExport={true}
            />
          ) : (
            <UserModerationHistory />
          )}
        </VStack>
      </Container>
    </Box>
  );
}
