// src/components/kdom/kdom-components/KDomDiscussionWidget.tsx
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
  Skeleton,
  Divider,
} from "@chakra-ui/react";
import {
  FiMessageCircle,
  FiUsers,
  FiTrendingUp,
  FiExternalLink,
  FiCalendar,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useKDomWithDiscussion } from "@/hooks/useKDomDiscussion";

interface KDomDiscussionWidgetProps {
  slug: string;
  variant?: "sidebar" | "card" | "inline";
  showViewAllButton?: boolean;
}

export function KDomDiscussionWidget({
  slug,
  variant = "sidebar",
  showViewAllButton = true,
}: KDomDiscussionWidgetProps) {
  const {
    hasActiveDiscussion,
    discussionStats,
    totalPosts,
    totalComments,
    uniquePosters,
  } = useKDomWithDiscussion(slug);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.400");

  // Inline variant (pentru header)
  if (variant === "inline") {
    if (!hasActiveDiscussion) {
      return (
        <Button
          as={RouterLink}
          to={`/kdoms/${slug}/discussion`}
          leftIcon={<Icon as={FiMessageCircle} />}
          variant="outline"
          size="sm"
          colorScheme="blue"
        >
          Start Discussion
        </Button>
      );
    }

    return (
      <HStack spacing={4}>
        <HStack spacing={2}>
          <Icon as={FiMessageCircle} color="blue.500" boxSize={4} />
          <Badge colorScheme="blue" borderRadius="full">
            {totalPosts} posts
          </Badge>
        </HStack>
        <Button
          as={RouterLink}
          to={`/kdoms/${slug}/discussion`}
          leftIcon={<Icon as={FiExternalLink} />}
          variant="outline"
          size="sm"
          colorScheme="blue"
        >
          View Discussion
        </Button>
      </HStack>
    );
  }

  // Card variant (pentru main content)
  if (variant === "card") {
    return (
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="md"
      >
        <CardHeader pb={3}>
          <HStack spacing={3} justify="space-between">
            <HStack spacing={3}>
              <Icon as={FiMessageCircle} color="blue.500" boxSize={6} />
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  Community Discussion
                </Text>
                <Text fontSize="sm" color={textColor}>
                  Join the conversation about this K-Dom
                </Text>
              </VStack>
            </HStack>
            {hasActiveDiscussion && (
              <Badge colorScheme="green" borderRadius="full" px={3} py={1}>
                Active
              </Badge>
            )}
          </HStack>
        </CardHeader>

        <CardBody pt={3}>
          <VStack spacing={6} align="stretch">
            {hasActiveDiscussion ? (
              <>
                {/* Statistics Grid */}
                <HStack spacing={6} justify="center">
                  <VStack spacing={1} align="center">
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                      {totalPosts}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      Posts
                    </Text>
                  </VStack>
                  <VStack spacing={1} align="center">
                    <Text fontSize="2xl" fontWeight="bold" color="green.600">
                      {totalComments}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      Comments
                    </Text>
                  </VStack>
                  <VStack spacing={1} align="center">
                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                      {uniquePosters}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      Contributors
                    </Text>
                  </VStack>
                </HStack>

                <Divider />

                {/* Last Activity */}
                {discussionStats?.lastPostDate && (
                  <HStack spacing={2} color={textColor} fontSize="sm">
                    <Icon as={FiCalendar} boxSize={4} />
                    <Text>
                      Last post:{" "}
                      {new Date(
                        discussionStats.lastPostDate
                      ).toLocaleDateString()}
                    </Text>
                  </HStack>
                )}

                {showViewAllButton && (
                  <Button
                    as={RouterLink}
                    to={`/kdoms/${slug}/discussion`}
                    colorScheme="blue"
                    size="lg"
                    leftIcon={<Icon as={FiExternalLink} />}
                    borderRadius="full"
                  >
                    View All Discussions
                  </Button>
                )}
              </>
            ) : (
              /* No Discussion State */
              <VStack spacing={4} py={6} textAlign="center">
                <Icon as={FiMessageCircle} boxSize={12} color="gray.400" />
                <VStack spacing={2}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.500">
                    No discussions yet
                  </Text>
                  <Text
                    fontSize="sm"
                    color={textColor}
                    maxW="sm"
                    lineHeight="tall"
                  >
                    Be the first to start a conversation about this K-Dom. Share
                    your thoughts, ask questions, or contribute ideas!
                  </Text>
                </VStack>
                <Button
                  as={RouterLink}
                  to={`/kdoms/${slug}/discussion`}
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<Icon as={FiMessageCircle} />}
                  borderRadius="full"
                >
                  Start First Discussion
                </Button>
              </VStack>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Sidebar variant (default)
  if (!discussionStats) {
    return (
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
      >
        <CardHeader pb={3}>
          <Skeleton height="24px" width="120px" />
        </CardHeader>
        <CardBody pt={3}>
          <VStack spacing={3}>
            <Skeleton height="40px" width="100%" />
            <Skeleton height="40px" width="100%" />
            <Skeleton height="32px" width="100%" />
          </VStack>
        </CardBody>
      </Card>
    );
  }

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
        <HStack spacing={3}>
          <Icon as={FiMessageCircle} color="blue.500" boxSize={5} />
          <Text fontSize="md" fontWeight="bold" color="blue.600">
            Discussion
          </Text>
        </HStack>
      </CardHeader>

      <CardBody pt={3}>
        <VStack spacing={4} align="stretch">
          {hasActiveDiscussion ? (
            <>
              {/* Quick Stats */}
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <Icon as={FiMessageCircle} boxSize={4} color="blue.500" />
                    <Text fontSize="sm" color={textColor}>
                      Posts
                    </Text>
                  </HStack>
                  <Badge colorScheme="blue" borderRadius="full">
                    {totalPosts}
                  </Badge>
                </HStack>

                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <Icon as={FiTrendingUp} boxSize={4} color="green.500" />
                    <Text fontSize="sm" color={textColor}>
                      Comments
                    </Text>
                  </HStack>
                  <Badge colorScheme="green" borderRadius="full">
                    {totalComments}
                  </Badge>
                </HStack>

                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <Icon as={FiUsers} boxSize={4} color="purple.500" />
                    <Text fontSize="sm" color={textColor}>
                      Contributors
                    </Text>
                  </HStack>
                  <Badge colorScheme="purple" borderRadius="full">
                    {uniquePosters}
                  </Badge>
                </HStack>
              </VStack>

              <Divider />

              {showViewAllButton && (
                <Button
                  as={RouterLink}
                  to={`/kdoms/${slug}/discussion`}
                  variant="outline"
                  colorScheme="blue"
                  size="sm"
                  leftIcon={<Icon as={FiExternalLink} />}
                  justifyContent="flex-start"
                  w="full"
                >
                  View All Discussions
                </Button>
              )}
            </>
          ) : (
            /* No Discussion Sidebar State */
            <VStack spacing={3} align="center" py={4}>
              <Icon as={FiMessageCircle} boxSize={8} color="gray.400" />
              <VStack spacing={1} textAlign="center">
                <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                  No discussions
                </Text>
                <Text fontSize="xs" color={textColor} lineHeight="tall">
                  Be the first to start a conversation
                </Text>
              </VStack>
              <Button
                as={RouterLink}
                to={`/kdoms/${slug}/discussion`}
                size="sm"
                colorScheme="blue"
                variant="outline"
                borderRadius="full"
                w="full"
              >
                Start Discussion
              </Button>
            </VStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
