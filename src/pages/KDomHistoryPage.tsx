// src/pages/KDomHistoryPage.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Spinner,
  Badge,
  Button,
  Card,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Divider,
  Flex,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { FiClock, FiEdit3, FiInfo, FiArrowLeft } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

import { getKDomBySlug, getEditHistoryBySlug } from "@/api/kdom";
import { useAuth } from "@/context/AuthContext";
import type { KDomEditReadDto } from "@/types/KDom";

export default function KDomHistoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const bgColor = useColorModeValue("gray.50", "gray.900");

  // Query pentru detaliile K-Dom-ului (folosind slug)
  const {
    data: kdom,
    isLoading: isKdomLoading,
    error: kdomError,
  } = useQuery({
    queryKey: ["kdom", slug],
    queryFn: () => getKDomBySlug(slug!),
    enabled: !!slug,
  });

  // Query pentru istoricul editărilor (folosind slug)
  const {
    data: edits,
    isLoading: isEditsLoading,
    error: editsError,
  } = useQuery({
    queryKey: ["kdom-edits", slug],
    queryFn: () => getEditHistoryBySlug(slug!),
    enabled: !!slug && !!kdom,
  });

  if (isKdomLoading) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl">
          <VStack spacing={8} py={8}>
            <Spinner size="xl" />
            <Text>Loading K-Dom...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (kdomError || !kdom) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl">
          <Alert status="error" mt={8}>
            <AlertIcon />
            K-Dom not found or you don't have permission to view its history.
          </Alert>
        </Container>
      </Box>
    );
  }

  // Verificăm permisiunile
  if (
    kdom.userId !== user?.id &&
    user?.role !== "admin" &&
    user?.role !== "moderator"
  ) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl">
          <Alert status="error" mt={8}>
            <AlertIcon />
            You don't have permission to view this K-Dom's edit history.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} pt="80px">
      <Container maxW="container.xl" py={6}>
        {/* Breadcrumb */}
        <Breadcrumb mb={6} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to={`/kdom/${kdom.slug}`}>
              {kdom.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>Edit History</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <Card mb={6}>
          <CardBody>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <VStack align="start" spacing={2}>
                <Heading size="lg">Edit History</Heading>
                <Text color="gray.600">
                  View all changes made to <strong>{kdom.title}</strong>
                </Text>
              </VStack>

              <HStack spacing={3}>
                <Button
                  leftIcon={<FiArrowLeft />}
                  as={RouterLink}
                  to={`/kdom/${kdom.slug}`}
                  variant="outline"
                >
                  Back to K-Dom
                </Button>
                <Button
                  leftIcon={<FiEdit3 />}
                  as={RouterLink}
                  to={`/kdom/${slug}/edit`}
                  colorScheme="blue"
                >
                  Edit K-Dom
                </Button>
              </HStack>
            </Flex>
          </CardBody>
        </Card>

        {/* Lista editărilor */}
        {isEditsLoading ? (
          <Card>
            <CardBody>
              <VStack spacing={4} py={8}>
                <Spinner />
                <Text>Loading edit history...</Text>
              </VStack>
            </CardBody>
          </Card>
        ) : editsError ? (
          <Alert status="error">
            <AlertIcon />
            Failed to load edit history.
          </Alert>
        ) : !edits || edits.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4} py={12} color="gray.500">
                <Icon as={FiClock} boxSize={12} />
                <Heading size="md">No Edit History</Heading>
                <Text textAlign="center">
                  This K-Dom hasn't been edited yet. All changes will appear
                  here once you start editing.
                </Text>
                <Button
                  as={RouterLink}
                  to={`/kdom/${slug}/edit`}
                  colorScheme="blue"
                  leftIcon={<FiEdit3 />}
                >
                  Start Editing
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <VStack spacing={4} align="stretch">
            {edits.map((edit, index) => (
              <EditHistoryItem
                key={edit.id}
                edit={edit}
                isLatest={index === 0}
                kdomTitle={kdom.title}
              />
            ))}
          </VStack>
        )}

        {/* Informații adicionale */}
        <Card mt={6}>
          <CardBody>
            <VStack align="start" spacing={3}>
              <Heading size="sm">About Edit History</Heading>
              <VStack align="start" spacing={2} fontSize="sm" color="gray.600">
                <Text>
                  • <strong>Auto-saves</strong> are created automatically as you
                  type
                </Text>
                <Text>
                  • <strong>Manual saves</strong> are created when you click
                  "Save" with an edit summary
                </Text>
                <Text>
                  • <strong>Minor edits</strong> include typo fixes and small
                  formatting changes
                </Text>
                <Text>
                  • Only the K-Dom owner and administrators can view edit
                  history
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

// Componenta pentru fiecare edit din istoric
interface EditHistoryItemProps {
  edit: KDomEditReadDto;
  isLatest: boolean;
  kdomTitle: string;
}

function EditHistoryItem({ edit, isLatest, kdomTitle }: EditHistoryItemProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={isLatest ? "green.200" : borderColor}
      borderLeftWidth={isLatest ? "4px" : "1px"}
      borderLeftColor={isLatest ? "green.400" : borderColor}
    >
      <CardBody>
        <Flex justify="space-between" align="start" gap={4}>
          <VStack align="start" spacing={3} flex="1">
            {/* Header cu data și status */}
            <HStack spacing={3} wrap="wrap">
              <HStack spacing={2}>
                <Icon as={FiClock} color="gray.500" />
                <Text fontWeight="semibold">
                  {new Date(edit.editedAt).toLocaleString()}
                </Text>
              </HStack>

              {isLatest && (
                <Badge colorScheme="green" fontSize="xs">
                  Latest
                </Badge>
              )}

              {edit.isMinor && (
                <Tooltip label="Minor edit - small changes like typos or formatting">
                  <Badge colorScheme="blue" fontSize="xs">
                    Minor
                  </Badge>
                </Tooltip>
              )}
            </HStack>

            {/* Edit note */}
            <HStack spacing={2} align="start">
              <Icon as={FiInfo} color="blue.500" mt={1} flexShrink={0} />
              <Text fontSize="sm" color="gray.700">
                {edit.editNote || "No edit summary provided"}
              </Text>
            </HStack>

            {/* Metadata */}
            <HStack spacing={4} fontSize="xs" color="gray.500">
              <Text>Edit ID: {edit.id.substring(0, 8)}...</Text>
              <Divider orientation="vertical" height="12px" />
              <Text>K-Dom: {kdomTitle}</Text>
            </HStack>
          </VStack>

          {/* Acțiuni */}
          <VStack spacing={2}>
            <Button size="xs" variant="outline">
              View Changes
            </Button>
            {!isLatest && (
              <Button size="xs" variant="outline" colorScheme="orange">
                Restore
              </Button>
            )}
          </VStack>
        </Flex>
      </CardBody>
    </Card>
  );
}
