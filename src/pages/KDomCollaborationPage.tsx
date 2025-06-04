// src/pages/KDomCollaborationPage.tsx
import { useParams, Navigate } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getKDomBySlug } from "@/api/kdom";
import { useAuth } from "@/context/AuthContext";
import { CollaborationRequestsManager } from "@/components/collaboration/CollaborationRequestsManager";
import { CollaboratorsManager } from "@/components/collaboration/CollaboratorsManager";
import { useCollaborationRequests } from "@/hooks/useCollaboration";

export default function KDomCollaborationPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // Query pentru detaliile K-Dom-ului
  const {
    data: kdom,
    isLoading: kdomLoading,
    error: kdomError,
  } = useQuery({
    queryKey: ["kdom", slug],
    queryFn: () => getKDomBySlug(slug!),
    enabled: !!slug,
  });

  // Get requests to show pending count in tab
  const { requests } = useCollaborationRequests(kdom?.id || "");
  const pendingCount =
    requests?.filter((r) => r.status === "Pending").length || 0;

  // Check permissions
  const isOwner = user && kdom && user.id === kdom.userId;
  const isAdminOrMod =
    user && (user.role === "admin" || user.role === "moderator");
  const canManage = isOwner || isAdminOrMod;

  if (kdomLoading) {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={bgColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" color="purple.500" />
          <Text fontSize="lg" color="gray.600">
            Loading K-Dom collaboration settings...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (kdomError || !kdom) {
    return (
      <Box py={8}>
        <Container maxW="container.lg">
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">K-Dom not found</Text>
              <Text>This K-Dom doesn't exist or has been removed.</Text>
            </VStack>
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!canManage) {
    return <Navigate to={`/kdoms/slug/${slug}`} replace />;
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Breadcrumb Navigation */}
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
            <BreadcrumbItem>
              <BreadcrumbLink
                as={RouterLink}
                to={`/kdoms/slug/${kdom.slug}`}
                _hover={{ color: "purple.500" }}
              >
                {kdom.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <Text color="gray.500">Collaboration</Text>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <Box>
            <HStack spacing={4} mb={4}>
              <Heading size="xl" color="purple.600">
                Collaboration Management
              </Heading>
              {pendingCount > 0 && (
                <Badge
                  colorScheme="orange"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="md"
                >
                  {pendingCount} pending
                </Badge>
              )}
            </HStack>
            <Text fontSize="lg" color="gray.600">
              Manage collaboration requests and collaborators for "{kdom.title}"
            </Text>
          </Box>

          {/* Main Content */}
          <Tabs colorScheme="purple" variant="enclosed">
            <TabList>
              <Tab>
                <HStack spacing={2}>
                  <Text>Collaboration Requests</Text>
                  {pendingCount > 0 && (
                    <Badge colorScheme="orange" borderRadius="full">
                      {pendingCount}
                    </Badge>
                  )}
                </HStack>
              </Tab>
              <Tab>
                <Text>Active Collaborators</Text>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0} py={6}>
                <CollaborationRequestsManager
                  kdomId={kdom.id}
                  kdomTitle={kdom.title}
                />
              </TabPanel>

              <TabPanel px={0} py={6}>
                <CollaboratorsManager
                  kdomId={kdom.id}
                  kdomTitle={kdom.title}
                  showStats={true}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}
