// src/components/moderation/RecentModerationActions.tsx
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Avatar,
  Button,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiCheck, FiX, FiClock, FiExternalLink } from "react-icons/fi";
import { useRecentModerationActions } from "@/hooks/useModeration";
import {
  formatProcessingTime,
  getModerationStatusColor,
} from "@/api/moderation";
import type { ModerationActionDto } from "@/types/Moderation";

interface RecentModerationActionsProps {
  actions?: ModerationActionDto[];
  showLoadMore?: boolean;
  limit?: number;
}

export function RecentModerationActions({
  actions: propActions,
  showLoadMore = false,
  limit = 20,
}: RecentModerationActionsProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const {
    data: fetchedActions,
    isLoading,
    error,
    refetch,
  } = useRecentModerationActions(limit);

  const actions = propActions || fetchedActions || [];

  if (isLoading) {
    return (
      <VStack spacing={4}>
        <Text>Loading recent actions...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load recent moderation actions.
      </Alert>
    );
  }

  if (actions.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">No recent moderation actions</Text>
          <Text>Start moderating K-DOMs to see activity here.</Text>
        </VStack>
      </Alert>
    );
  }

  const getActionIcon = (decision: string) => {
    switch (decision) {
      case "Approved":
        return <FiCheck color="green" />;
      case "Rejected":
        return <FiX color="red" />;
      default:
        return <FiClock color="orange" />;
    }
  };

  const getActionText = (decision: string) => {
    switch (decision) {
      case "Approved":
        return "approved";
      case "Rejected":
        return "rejected";
      default:
        return "reviewed";
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {actions.map((action) => (
        <Card
          key={action.id}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          _hover={{ shadow: "sm" }}
        >
          <CardBody>
            <HStack spacing={4} align="start">
              {/* Action Icon */}
              <Box mt={1}>{getActionIcon(action.decision)}</Box>

              {/* Content */}
              <VStack flex={1} align="start" spacing={2}>
                <HStack justify="space-between" w="full">
                  <HStack spacing={3}>
                    <Avatar size="sm" name={action.moderatorUsername} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="medium">
                        {action.moderatorUsername}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Moderator
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack align="end" spacing={1}>
                    <Badge
                      colorScheme={getModerationStatusColor(action.decision)}
                      fontSize="xs"
                    >
                      {action.decision}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(action.actionDate).toLocaleDateString()}
                    </Text>
                  </VStack>
                </HStack>

                <Box>
                  <Text fontSize="sm">
                    {getActionText(action.decision)} K-DOM{" "}
                    <Text as="span" fontWeight="bold">
                      "{action.kdomTitle}"
                    </Text>{" "}
                    by {action.authorUsername}
                  </Text>
                </Box>

                {/* Rejection Reason */}
                {action.reason && action.decision === "Rejected" && (
                  <Box p={3} bg="red.50" borderRadius="md" w="full">
                    <Text fontSize="sm" color="red.700" fontWeight="medium">
                      Rejection Reason:
                    </Text>
                    <Text fontSize="sm" color="red.600">
                      {action.reason}
                    </Text>
                  </Box>
                )}

                {/* Processing Time */}
                <HStack justify="space-between" w="full" pt={2}>
                  <HStack spacing={2}>
                    <FiClock size={14} />
                    <Text fontSize="xs" color="gray.500">
                      Processed in {formatProcessingTime(action.processingTime)}
                    </Text>
                  </HStack>

                  <Button
                    size="xs"
                    variant="ghost"
                    leftIcon={<FiExternalLink />}
                    as="a"
                    href={`/kdoms/${action.kdomId}`}
                    target="_blank"
                  >
                    View
                  </Button>
                </HStack>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      ))}

      {/* Load More Button */}
      {showLoadMore && actions.length >= limit && (
        <Box textAlign="center">
          <Button
            variant="outline"
            onClick={() => refetch()}
            isLoading={isLoading}
          >
            Load More Actions
          </Button>
        </Box>
      )}
    </VStack>
  );
}
