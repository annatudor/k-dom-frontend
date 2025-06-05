// src/pages/ModerationHistoryPage.tsx
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AdminModerationHistory } from "@/components/kdom/moderation/AdminModerationHistory";
import { UserModerationHistory } from "@/components/kdom/moderation/UserModerationHistory";

export default function ModerationHistoryPage() {
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isModeratorOrAdmin =
    user?.role === "admin" || user?.role === "moderator";

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
