// src/components/collaboration/CollaboratorsManager.tsx - Updated with proper TypeScript types
import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Heading,
  Avatar,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Alert,
  AlertIcon,
  Spinner,
  Icon,
  useColorModeValue,
  Tooltip,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import {
  FiEdit3,
  FiClock,
  FiTrash2,
  FiUsers,
  FiActivity,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import {
  useCollaborators,
  useKDomCollaborationStats,
  useCollaborationPermissions,
} from "@/hooks/useCollaboration";
import type { CollaboratorReadDto } from "@/types/Collaboration";

interface CollaboratorsManagerProps {
  kdomId: string;
  kdomTitle: string;
  showStats?: boolean;
}

// Define error type for better type safety
interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export function CollaboratorsManager({
  kdomId,
  kdomTitle,
  showStats = true,
}: CollaboratorsManagerProps) {
  const [collaboratorToRemove, setCollaboratorToRemove] =
    useState<CollaboratorReadDto | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { collaborators, isLoading, removeCollaborator, isRemoving, error } =
    useCollaborators(kdomId);

  const { data: statsData, error: statsError } =
    useKDomCollaborationStats(kdomId);
  const { data: permissions } = useCollaborationPermissions(kdomId);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const statBg = useColorModeValue("gray.50", "gray.700");

  const handleRemoveClick = (collaborator: CollaboratorReadDto) => {
    setCollaboratorToRemove(collaborator);
    onOpen();
  };

  const handleRemoveConfirm = () => {
    if (collaboratorToRemove) {
      removeCollaborator({ userIdToRemove: collaboratorToRemove.userId });
      onClose();
      setCollaboratorToRemove(null);
    }
  };

  const getActivityBadge = (lastActivity?: string) => {
    if (!lastActivity) return <Badge colorScheme="gray">No activity</Badge>;

    const lastActivityDate = new Date(lastActivity);
    const daysSince = Math.floor(
      (Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSince <= 7) return <Badge colorScheme="green">Active</Badge>;
    if (daysSince <= 30)
      return <Badge colorScheme="yellow">Recently active</Badge>;
    return <Badge colorScheme="gray">Inactive</Badge>;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  const getErrorMessage = (error: unknown): string => {
    const apiError = error as ApiError;
    return (
      apiError?.response?.data?.error ||
      "There was an error loading the collaborators. Please try again."
    );
  };

  const CollaboratorCard = ({
    collaborator,
  }: {
    collaborator: CollaboratorReadDto;
  }) => (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      transition="all 0.2s"
    >
      <CardBody p={5}>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between" align="start">
            <HStack spacing={4} flex="1">
              <Avatar name={collaborator.username} size="md" bg="blue.500" />
              <VStack align="start" spacing={1} flex="1">
                <Text fontWeight="bold" fontSize="lg">
                  {collaborator.username}
                </Text>
                <HStack spacing={2}>
                  {getActivityBadge(collaborator.lastActivity)}
                  <Badge colorScheme="blue" variant="outline">
                    {collaborator.editCount} edits
                  </Badge>
                </HStack>
              </VStack>
            </HStack>

            {permissions?.canManage && (
              <Tooltip label="Remove collaborator" hasArrow>
                <IconButton
                  aria-label="Remove collaborator"
                  icon={<FiTrash2 />}
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveClick(collaborator)}
                  isLoading={isRemoving}
                />
              </Tooltip>
            )}
          </HStack>

          <SimpleGrid columns={3} spacing={4}>
            <Stat size="sm" bg={statBg} p={3} borderRadius="md">
              <StatLabel fontSize="xs">
                <HStack spacing={1}>
                  <Icon as={FiEdit3} boxSize={3} />
                  <Text>Edits</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="lg">{collaborator.editCount}</StatNumber>
            </Stat>

            <Stat size="sm" bg={statBg} p={3} borderRadius="md">
              <StatLabel fontSize="xs">
                <HStack spacing={1}>
                  <Icon as={FiCalendar} boxSize={3} />
                  <Text>Joined</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="sm">
                {formatDate(collaborator.addedAt)}
              </StatNumber>
            </Stat>

            <Stat size="sm" bg={statBg} p={3} borderRadius="md">
              <StatLabel fontSize="xs">
                <HStack spacing={1}>
                  <Icon as={FiClock} boxSize={3} />
                  <Text>Last Active</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="sm">
                {collaborator.lastActivity
                  ? formatDate(collaborator.lastActivity)
                  : "Never"}
              </StatNumber>
            </Stat>
          </SimpleGrid>
        </VStack>
      </CardBody>
    </Card>
  );

  // Permission check
  if (permissions && !permissions.canView) {
    return (
      <Alert status="warning" borderRadius="lg">
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontWeight="semibold">Access denied</Text>
          <Text fontSize="sm">
            You don't have permission to view collaborators for this K-Dom.
          </Text>
        </VStack>
      </Alert>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="lg" color="blue.500" />
        <Text>Loading collaborators...</Text>
      </VStack>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <VStack align="start" spacing={3} flex="1">
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold">Failed to load collaborators</Text>
            <Text fontSize="sm">{getErrorMessage(error)}</Text>
          </VStack>
          <Button
            leftIcon={<Icon as={FiRefreshCw} />}
            size="sm"
            colorScheme="red"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </VStack>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" mb={2}>
          Collaborators
        </Heading>
        <Text color="gray.600">Manage collaborators for "{kdomTitle}"</Text>
      </Box>

      {/* Stats Overview */}
      {showStats && statsData?.stats && !statsError && (
        <Card
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="xl"
        >
          <CardBody p={6}>
            <VStack spacing={6} align="stretch">
              <HStack spacing={3}>
                <Icon as={FiActivity} color="blue.500" boxSize={6} />
                <Heading size="md" color="blue.600">
                  Collaboration Overview
                </Heading>
              </HStack>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                <Stat textAlign="center">
                  <StatLabel>
                    <HStack spacing={1} justify="center">
                      <Icon as={FiUsers} boxSize={4} />
                      <Text>Total Collaborators</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="blue.600">
                    {statsData.stats.totalCollaborators}
                  </StatNumber>
                </Stat>

                <Stat textAlign="center">
                  <StatLabel>
                    <HStack spacing={1} justify="center">
                      <Icon as={FiActivity} boxSize={4} />
                      <Text>Active (30 days)</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="green.600">
                    {statsData.stats.activeCollaborators}
                  </StatNumber>
                </Stat>

                <Stat textAlign="center">
                  <StatLabel>Owner Edits</StatLabel>
                  <StatNumber color="purple.600">
                    {statsData.stats.editDistribution.ownerEdits}
                  </StatNumber>
                  <StatHelpText>
                    {statsData.stats.editDistribution.ownerPercentage}%
                  </StatHelpText>
                </Stat>

                <Stat textAlign="center">
                  <StatLabel>Collaborator Edits</StatLabel>
                  <StatNumber color="orange.600">
                    {statsData.stats.editDistribution.collaboratorEdits}
                  </StatNumber>
                  <StatHelpText>
                    {statsData.stats.editDistribution.collaboratorPercentage}%
                  </StatHelpText>
                </Stat>
              </SimpleGrid>

              {/* Top Contributors */}
              {statsData.stats.topCollaborators.length > 0 && (
                <Box>
                  <Heading size="sm" mb={3}>
                    Top Contributors
                  </Heading>
                  <VStack spacing={2} align="stretch">
                    {statsData.stats.topCollaborators
                      .slice(0, 3)
                      .map((contributor, index) => (
                        <HStack
                          key={contributor.userId}
                          spacing={3}
                          p={3}
                          bg={statBg}
                          borderRadius="md"
                        >
                          <Text fontWeight="bold" color="gray.600" minW="20px">
                            #{index + 1}
                          </Text>
                          <Avatar name={contributor.username} size="sm" />
                          <Text fontWeight="semibold" flex="1">
                            {contributor.username}
                          </Text>
                          <Badge colorScheme="blue">
                            {contributor.editCount} edits
                          </Badge>
                          <Text fontSize="sm" color="gray.600">
                            {contributor.contributionPercentage}%
                          </Text>
                        </HStack>
                      ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Stats Error Alert */}
      {showStats && statsError && (
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold">Collaboration stats unavailable</Text>
            <Text fontSize="sm">
              Statistics could not be loaded, but collaborator list is available
              below.
            </Text>
          </VStack>
        </Alert>
      )}

      {/* Collaborators List */}
      {collaborators.length === 0 ? (
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold">No collaborators yet</Text>
            <Text fontSize="sm">
              When you approve collaboration requests, collaborators will appear
              here.
            </Text>
          </VStack>
        </Alert>
      ) : (
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="md">
              Active Collaborators ({collaborators.length})
            </Heading>
          </HStack>

          <VStack spacing={4} align="stretch">
            {collaborators.map((collaborator) => (
              <CollaboratorCard
                key={collaborator.userId}
                collaborator={collaborator}
              />
            ))}
          </VStack>
        </VStack>
      )}

      {/* Remove Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove Collaborator</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="warning" borderRadius="lg">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="semibold">Are you sure?</Text>
                  <Text fontSize="sm">
                    This action will remove {collaboratorToRemove?.username}{" "}
                    from the collaborators list and revoke their editing
                    permissions for this K-Dom.
                  </Text>
                </VStack>
              </Alert>

              {collaboratorToRemove && (
                <HStack spacing={4} p={4} bg={statBg} borderRadius="md">
                  <Avatar name={collaboratorToRemove.username} size="md" />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">
                      {collaboratorToRemove.username}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {collaboratorToRemove.editCount} contributions
                    </Text>
                  </VStack>
                </HStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleRemoveConfirm}
              isLoading={isRemoving}
            >
              Remove Collaborator
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
