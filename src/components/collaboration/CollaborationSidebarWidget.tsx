// src/components/collaboration/CollaborationSidebarWidget.tsx
import {
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  useColorModeValue,
  Avatar,
  AvatarGroup,
  Divider,
} from "@chakra-ui/react";
import { FiUsers, FiUserPlus, FiSettings } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import {
  useCollaborators,
  useCollaborationRequests,
} from "@/hooks/useCollaboration";
import { useAuth } from "@/context/AuthContext";

interface CollaborationSidebarWidgetProps {
  kdomId: string;
  kdomSlug: string;
  kdomUserId: number;
  isOwner?: boolean;
  variant?: "compact" | "full";
}

export function CollaborationSidebarWidget({
  kdomId,
  kdomSlug,
  isOwner = false,
  variant = "compact",
}: CollaborationSidebarWidgetProps) {
  const { user } = useAuth();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { collaborators, isLoading: collaboratorsLoading } =
    useCollaborators(kdomId);
  const { requests, isLoading: requestsLoading } =
    useCollaborationRequests(kdomId);

  const pendingRequests = requests?.filter((r) => r.status === "Pending") || [];
  const isUserCollaborator =
    user && collaborators.some((c) => c.userId === user.id);

  if (collaboratorsLoading || requestsLoading) {
    return null; // or a skeleton
  }

  if (variant === "compact") {
    return (
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="md"
        overflow="hidden"
        size="sm"
      >
        <CardHeader pb={3}>
          <HStack spacing={3}>
            <Icon as={FiUsers} color="purple.500" boxSize={5} />
            <Text fontSize="md" fontWeight="bold" color="purple.600">
              Collaboration
            </Text>
          </HStack>
        </CardHeader>

        <CardBody pt={3}>
          <VStack spacing={4} align="stretch">
            {/* Collaborators Count */}
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Icon as={FiUsers} boxSize={4} color="purple.500" />
                <Text fontSize="sm" color="gray.600">
                  Collaborators
                </Text>
              </HStack>
              <Badge colorScheme="purple" borderRadius="full">
                {collaborators.length}
              </Badge>
            </HStack>

            {/* Avatar Group */}
            {collaborators.length > 0 && (
              <AvatarGroup size="sm" max={4}>
                {collaborators.map((collaborator) => (
                  <Avatar
                    key={collaborator.userId}
                    name={collaborator.username}
                    bg="purple.500"
                  />
                ))}
              </AvatarGroup>
            )}

            {/* Pending Requests (Owner only) */}
            {isOwner && pendingRequests.length > 0 && (
              <>
                <Divider />
                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <Icon as={FiUserPlus} boxSize={4} color="orange.500" />
                    <Text fontSize="sm" color="gray.600">
                      Pending Requests
                    </Text>
                  </HStack>
                  <Badge colorScheme="orange" borderRadius="full">
                    {pendingRequests.length}
                  </Badge>
                </HStack>
              </>
            )}

            {/* Action Buttons */}
            <VStack spacing={2} align="stretch">
              {isOwner && (
                <Button
                  as={RouterLink}
                  to={`/kdoms/${kdomSlug}/collaboration`}
                  variant="outline"
                  colorScheme="purple"
                  size="sm"
                  leftIcon={<Icon as={FiSettings} />}
                  justifyContent="flex-start"
                  w="full"
                >
                  Manage Collaboration
                </Button>
              )}

              {(isOwner || isUserCollaborator) && (
                <Button
                  as={RouterLink}
                  to={`/kdoms/${kdomSlug}/collaborators`}
                  variant="ghost"
                  colorScheme="purple"
                  size="sm"
                  leftIcon={<Icon as={FiUsers} />}
                  justifyContent="flex-start"
                  w="full"
                >
                  View All Collaborators
                </Button>
              )}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Full variant
  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="md"
      overflow="hidden"
    >
      <CardHeader pb={3}>
        <HStack spacing={3} justify="space-between">
          <HStack spacing={3}>
            <Icon as={FiUsers} color="purple.500" boxSize={6} />
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="bold" color="purple.600">
                Collaboration
              </Text>
              <Text fontSize="sm" color="gray.600">
                Work together on this K-Dom
              </Text>
            </VStack>
          </HStack>
          {isOwner && pendingRequests.length > 0 && (
            <Badge colorScheme="orange" borderRadius="full" px={3} py={1}>
              {pendingRequests.length} pending
            </Badge>
          )}
        </HStack>
      </CardHeader>

      <CardBody pt={3}>
        <VStack spacing={6} align="stretch">
          {/* Collaborators Section */}
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="semibold" color="gray.700">
                Active Collaborators ({collaborators.length})
              </Text>
            </HStack>

            {collaborators.length === 0 ? (
              <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                No collaborators yet
              </Text>
            ) : (
              <VStack spacing={3} align="stretch">
                {collaborators.slice(0, 3).map((collaborator) => (
                  <HStack key={collaborator.userId} spacing={3}>
                    <Avatar
                      name={collaborator.username}
                      size="sm"
                      bg="purple.500"
                    />
                    <VStack align="start" spacing={0} flex="1">
                      <Text fontSize="sm" fontWeight="semibold">
                        {collaborator.username}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {collaborator.editCount || 0} contributions
                      </Text>
                    </VStack>
                    <Badge
                      size="sm"
                      colorScheme={
                        collaborator.lastActivity &&
                        new Date(collaborator.lastActivity).getTime() >
                          Date.now() - 7 * 24 * 60 * 60 * 1000
                          ? "green"
                          : "gray"
                      }
                    >
                      {collaborator.lastActivity &&
                      new Date(collaborator.lastActivity).getTime() >
                        Date.now() - 7 * 24 * 60 * 60 * 1000
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                  </HStack>
                ))}

                {collaborators.length > 3 && (
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    +{collaborators.length - 3} more collaborators
                  </Text>
                )}
              </VStack>
            )}
          </VStack>

          {/* Pending Requests Section (Owner only) */}
          {isOwner && pendingRequests.length > 0 && (
            <>
              <Divider />
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="semibold" color="orange.700">
                    Pending Requests ({pendingRequests.length})
                  </Text>
                </HStack>

                <VStack spacing={3} align="stretch">
                  {pendingRequests.slice(0, 2).map((request) => (
                    <HStack
                      key={request.id}
                      spacing={3}
                      p={3}
                      bg="orange.50"
                      borderRadius="md"
                    >
                      <Avatar
                        name={request.username || `User ${request.userId}`}
                        size="sm"
                        bg="orange.500"
                      />
                      <VStack align="start" spacing={0} flex="1">
                        <Text fontSize="sm" fontWeight="semibold">
                          {request.username || `User ${request.userId}`}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </Text>
                      </VStack>
                      <Badge colorScheme="orange" size="sm">
                        Pending
                      </Badge>
                    </HStack>
                  ))}

                  {pendingRequests.length > 2 && (
                    <Text fontSize="sm" color="orange.600" textAlign="center">
                      +{pendingRequests.length - 2} more pending
                    </Text>
                  )}
                </VStack>
              </VStack>
            </>
          )}

          {/* Action Buttons */}
          <VStack spacing={3} align="stretch">
            {isOwner && (
              <Button
                as={RouterLink}
                to={`/kdoms/${kdomSlug}/collaboration`}
                colorScheme="purple"
                size="md"
                leftIcon={<Icon as={FiSettings} />}
                w="full"
              >
                Manage Collaboration
              </Button>
            )}

            {(isOwner || isUserCollaborator) && (
              <Button
                as={RouterLink}
                to={`/kdoms/${kdomSlug}/collaborators`}
                variant="outline"
                colorScheme="purple"
                size="md"
                leftIcon={<Icon as={FiUsers} />}
                w="full"
              >
                View All Collaborators
              </Button>
            )}

            {!isOwner && !isUserCollaborator && (
              <Button
                variant="outline"
                colorScheme="purple"
                size="md"
                leftIcon={<Icon as={FiUserPlus} />}
                w="full"
                isDisabled // Will be enabled via CollaborationButton component
              >
                Request Collaboration
              </Button>
            )}
          </VStack>

          {/* Info Box */}
          <VStack
            spacing={2}
            align="center"
            p={4}
            bg="purple.50"
            borderRadius="md"
            textAlign="center"
          >
            <Icon as={FiUsers} color="purple.500" fontSize="2xl" />
            <Text fontSize="sm" fontWeight="bold" color="purple.700">
              Collaborative Knowledge
            </Text>
            <Text fontSize="xs" color="purple.600" lineHeight="tall">
              Multiple contributors work together to improve and maintain this
              K-Dom's content
            </Text>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
}
