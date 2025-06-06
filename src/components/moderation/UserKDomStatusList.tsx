// src/components/moderation/UserKDomStatusList.tsx
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Button,
  Alert,
  AlertIcon,
  useColorModeValue,
  SimpleGrid,
  Spinner,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FiEye, FiEdit, FiClock, FiCalendar, FiUser } from "react-icons/fi";
import {
  formatProcessingTime,
  getModerationStatusColor,
} from "@/api/moderation";
import type { UserKDomStatusDto } from "@/types/Moderation";

interface UserKDomStatusListProps {
  statuses: UserKDomStatusDto[];
  isLoading?: boolean;
  emptyMessage?: string;
  showRejectionReasons?: boolean;
  showAllInfo?: boolean;
}

export function UserKDomStatusList({
  statuses,
  isLoading = false,
  emptyMessage = "No K-DOMs found",
  showRejectionReasons = false,
  showAllInfo = false,
}: UserKDomStatusListProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (isLoading) {
    return (
      <VStack spacing={4}>
        <Spinner size="lg" thickness="4px" color="purple.500" />
        <Text>Loading K-DOM status...</Text>
      </VStack>
    );
  }

  if (statuses.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">No K-DOMs found</Text>
          <Text>{emptyMessage}</Text>
        </VStack>
      </Alert>
    );
  }

  const getStatusMessage = (status: UserKDomStatusDto) => {
    switch (status.status) {
      case "Pending": {
        const waitingDays = Math.floor(
          (new Date().getTime() - new Date(status.createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return `Submitted ${waitingDays} day${
          waitingDays !== 1 ? "s" : ""
        } ago. Usually takes 1-3 days to review.`;
      }

      case "Approved": {
        return status.moderatedAt
          ? `Approved on ${new Date(status.moderatedAt).toLocaleDateString()}`
          : "Approved and live";
      }

      case "Rejected": {
        return status.moderatedAt
          ? `Rejected on ${new Date(status.moderatedAt).toLocaleDateString()}`
          : "Rejected by moderators";
      }

      default:
        return "Status unknown";
    }
  };

  const getActionButtons = (status: UserKDomStatusDto) => {
    const buttons = [];

    // View button (always available)
    buttons.push(
      <Tooltip key="view" label="View K-DOM">
        <IconButton
          icon={<FiEye />}
          size="sm"
          variant="ghost"
          aria-label="View K-DOM"
          as="a"
          href={`/kdoms/slug/${status.slug}`}
          target="_blank"
        />
      </Tooltip>
    );

    // Edit button (for approved K-DOMs)
    if (status.canEdit && status.status === "Approved") {
      buttons.push(
        <Tooltip key="edit" label="Edit K-DOM">
          <IconButton
            icon={<FiEdit />}
            size="sm"
            variant="ghost"
            aria-label="Edit K-DOM"
            as="a"
            href={`/kdoms/${status.slug}/edit`}
          />
        </Tooltip>
      );
    }

    return buttons;
  };

  return (
    <VStack spacing={4} align="stretch">
      {statuses.map((status) => (
        <Card
          key={status.id}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          _hover={{ shadow: "sm" }}
        >
          <CardBody>
            <VStack spacing={4} align="stretch">
              {/* Header */}
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={1} flex={1}>
                  <HStack spacing={3}>
                    <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
                      {status.title}
                    </Text>
                    <Badge
                      colorScheme={getModerationStatusColor(status.status)}
                      fontSize="sm"
                      px={2}
                      py={1}
                    >
                      {status.status}
                    </Badge>
                  </HStack>

                  <Text fontSize="sm" color="gray.600">
                    {getStatusMessage(status)}
                  </Text>
                </VStack>

                <HStack spacing={1}>{getActionButtons(status)}</HStack>
              </HStack>

              {/* Metadata */}
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <VStack align="start" spacing={1}>
                  <HStack spacing={2}>
                    <FiCalendar size={14} />
                    <Text fontSize="sm" fontWeight="medium">
                      Submitted
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    {new Date(status.createdAt).toLocaleDateString()}
                  </Text>
                </VStack>

                {status.moderatedAt && (
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <FiUser size={14} />
                      <Text fontSize="sm" fontWeight="medium">
                        Reviewed by
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      {status.moderatorUsername || "Unknown"}
                    </Text>
                  </VStack>
                )}

                {status.processingTime && (
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <FiClock size={14} />
                      <Text fontSize="sm" fontWeight="medium">
                        Processing Time
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      {formatProcessingTime(status.processingTime)}
                    </Text>
                  </VStack>
                )}

                {showAllInfo && (
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" fontWeight="medium">
                      Slug
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontFamily="mono">
                      /{status.slug}
                    </Text>
                  </VStack>
                )}
              </SimpleGrid>

              {/* Rejection Reason */}
              {showRejectionReasons &&
                status.rejectionReason &&
                status.status === "Rejected" && (
                  <Box
                    p={4}
                    bg="red.50"
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor="red.400"
                  >
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" fontWeight="bold" color="red.700">
                        Rejection Reason:
                      </Text>
                      <Text fontSize="sm" color="red.600">
                        {status.rejectionReason}
                      </Text>
                    </VStack>
                  </Box>
                )}

              {/* Pending Status Help */}
              {status.status === "Pending" && (
                <Box
                  p={4}
                  bg="yellow.50"
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderColor="yellow.400"
                >
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="bold" color="yellow.700">
                      What happens next?
                    </Text>
                    <Text fontSize="sm" color="yellow.600">
                      Your K-DOM is in the moderation queue. Our team reviews
                      submissions to ensure quality and compliance with
                      community guidelines. You'll be notified once it's
                      reviewed.
                    </Text>
                  </VStack>
                </Box>
              )}

              {/* Approved Status Help */}
              {status.status === "Approved" && showAllInfo && (
                <Box
                  p={4}
                  bg="green.50"
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderColor="green.400"
                >
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="bold" color="green.700">
                        🎉 Your K-DOM is live!
                      </Text>
                      <Text fontSize="sm" color="green.600">
                        Other users can now view, discuss, and collaborate on
                        your K-DOM.
                      </Text>
                    </VStack>
                    <Button
                      size="sm"
                      colorScheme="green"
                      variant="outline"
                      as="a"
                      href={`/kdoms/slug/${status.slug}`}
                      target="_blank"
                    >
                      View Live
                    </Button>
                  </HStack>
                </Box>
              )}

              {/* Action Buttons for Rejected */}
              {status.status === "Rejected" && (
                <HStack spacing={2} pt={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    as="a"
                    href={`/kdoms/slug/${status.slug}`}
                    target="_blank"
                  >
                    Review K-DOM
                  </Button>

                  {status.canResubmit && (
                    <Button
                      size="sm"
                      colorScheme="purple"
                      isDisabled
                      title="Resubmission feature coming soon"
                    >
                      Resubmit (Coming Soon)
                    </Button>
                  )}

                  <Button size="sm" variant="ghost" as="a" href="/start-kdom">
                    Create New K-DOM
                  </Button>
                </HStack>
              )}
            </VStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
}
