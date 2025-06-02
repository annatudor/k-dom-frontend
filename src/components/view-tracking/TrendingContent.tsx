// src/components/viewTracking/TrendingContent.tsx
import {
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Box,
  Card,
  CardHeader,
  CardBody,
  Skeleton,
  useColorModeValue,
  Link,
  Heading,
  Divider,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import {
  FiTrendingUp,
  FiEye,
  FiClock,
  FiArrowUp,
  FiArrowDown,
  FiMinus,
  FiExternalLink,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import { getTrendingContent, formatViewCount } from "@/api/viewTracking";
import type {
  ContentType,
  TrendingContentDto,
  TrendingItemProps,
} from "@/types/ViewTracking";

interface TrendingContentProps {
  contentType?: ContentType;
  hours?: number;
  limit?: number;
  title?: string;
  showTimeframe?: boolean;
  variant?: "compact" | "detailed" | "minimal";
}

export function TrendingContent({
  contentType,
  hours = 24,
  limit = 10,
  title,
  showTimeframe = true,
  variant = "detailed",
}: TrendingContentProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const {
    data: trendingItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trending-content", contentType, hours, limit],
    queryFn: () => getTrendingContent(contentType, hours, limit),
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 60000, // Consider data stale after 1 minute
  });

  const displayTitle =
    title ||
    `Trending ${contentType ? contentType + "s" : "Content"}${
      showTimeframe ? ` (${hours}h)` : ""
    }`;

  if (error) {
    return (
      <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <VStack spacing={4} py={8} color="red.500">
            <Icon as={FiTrendingUp} boxSize={8} />
            <Text>Failed to load trending content</Text>
            <Text fontSize="sm" color="gray.500">
              {error instanceof Error ? error.message : "Unknown error"}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  if (variant === "minimal") {
    return (
      <VStack spacing={2} align="stretch">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height="40px" />
            ))
          : trendingItems
              .slice(0, 3)
              .map((item, index) => (
                <TrendingItem
                  key={item.contentId}
                  item={item}
                  rank={index + 1}
                  variant="minimal"
                />
              ))}
      </VStack>
    );
  }

  if (variant === "compact") {
    return (
      <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <CardHeader pb={3}>
          <HStack justify="space-between">
            <HStack spacing={2}>
              <Icon as={FiTrendingUp} color="orange.500" boxSize={5} />
              <Heading size="md">{displayTitle}</Heading>
            </HStack>
            <Badge colorScheme="orange" borderRadius="full">
              {trendingItems.length}
            </Badge>
          </HStack>
        </CardHeader>
        <CardBody pt={3}>
          <VStack spacing={2} align="stretch">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} height="32px" />
              ))
            ) : trendingItems.length > 0 ? (
              trendingItems.map((item, index) => (
                <TrendingItem
                  key={item.contentId}
                  item={item}
                  rank={index + 1}
                  variant="compact"
                />
              ))
            ) : (
              <Box textAlign="center" py={8} color="gray.500">
                <Icon as={FiTrendingUp} boxSize={8} mb={2} />
                <Text>No trending content yet</Text>
                <Text fontSize="sm">Check back later for updates</Text>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Detailed variant (default)
  return (
    <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
      <CardHeader>
        <Flex justify="space-between" align="center">
          <HStack spacing={3}>
            <Icon as={FiTrendingUp} color="orange.500" boxSize={6} />
            <VStack align="start" spacing={0}>
              <Heading size="lg" color="orange.600">
                {displayTitle}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Most viewed content right now
              </Text>
            </VStack>
          </HStack>

          {isLoading && <Spinner size="sm" color="orange.500" />}
        </Flex>
      </CardHeader>

      <Divider />

      <CardBody>
        <VStack spacing={4} align="stretch">
          {isLoading ? (
            Array.from({ length: limit }).map((_, i) => (
              <Skeleton key={i} height="60px" />
            ))
          ) : trendingItems.length > 0 ? (
            trendingItems.map((item, index) => (
              <TrendingItem
                key={item.contentId}
                item={item}
                rank={index + 1}
                variant="detailed"
                showTrend={true}
              />
            ))
          ) : (
            <Box textAlign="center" py={12} color="gray.500">
              <Icon as={FiTrendingUp} boxSize={12} mb={4} />
              <Text fontSize="lg" fontWeight="semibold">
                No trending content
              </Text>
              <Text>Content will appear here as it gains popularity</Text>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}

// Individual trending item component
export function TrendingItem({
  item,
  rank,
  variant = "detailed",
  showTrend = false,
}: TrendingItemProps & { variant?: "minimal" | "compact" | "detailed" }) {
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const rankColor = getRankColor(rank);

  // Determine the link based on content type
  const getContentLink = (item: TrendingContentDto): string => {
    if (item.contentType === "KDom") {
      return `/kdoms/slug/${item.contentId}`; // Assuming contentId is the slug for KDoms
    }
    return `/posts/${item.contentId}`;
  };

  // Get trending indicator
  const getTrendingIcon = (score: number) => {
    if (score > 10) return { icon: FiArrowUp, color: "green.500" };
    if (score > 5) return { icon: FiArrowUp, color: "orange.500" };
    if (score > 1) return { icon: FiMinus, color: "blue.500" };
    return { icon: FiArrowDown, color: "gray.500" };
  };

  const trendingIcon = getTrendingIcon(item.trendingScore);

  if (variant === "minimal") {
    return (
      <HStack
        spacing={3}
        p={2}
        borderRadius="md"
        _hover={{ bg: hoverBg }}
        transition="background 0.2s"
      >
        <Badge colorScheme={rankColor} borderRadius="full" minW="24px">
          {rank}
        </Badge>
        <Link
          as={RouterLink}
          to={getContentLink(item)}
          flex="1"
          _hover={{ textDecoration: "none" }}
        >
          <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
            {item.contentTitle || `${item.contentType} ${item.contentId}`}
          </Text>
        </Link>
        <Badge colorScheme="blue" variant="subtle" fontSize="xs">
          {formatViewCount(item.viewCount)}
        </Badge>
      </HStack>
    );
  }

  if (variant === "compact") {
    return (
      <HStack
        spacing={3}
        p={3}
        borderRadius="lg"
        borderWidth="1px"
        borderColor="transparent"
        _hover={{
          bg: hoverBg,
          borderColor: "orange.200",
          transform: "translateY(-1px)",
        }}
        transition="all 0.2s"
        cursor="pointer"
        as={RouterLink}
        to={getContentLink(item)}
      >
        <Badge
          colorScheme={rankColor}
          borderRadius="full"
          minW="28px"
          h="28px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
        >
          {rank}
        </Badge>

        <VStack align="start" spacing={1} flex="1" minW="0">
          <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
            {item.contentTitle || `${item.contentType} ${item.contentId}`}
          </Text>
          <HStack spacing={3} fontSize="xs" color="gray.500">
            <HStack spacing={1}>
              <Icon as={FiEye} boxSize={3} />
              <Text>{formatViewCount(item.viewCount)} views</Text>
            </HStack>
            {showTrend && (
              <HStack spacing={1}>
                <Icon
                  as={trendingIcon.icon}
                  boxSize={3}
                  color={trendingIcon.color}
                />
                <Text color={trendingIcon.color}>
                  {item.trendingScore.toFixed(1)}
                </Text>
              </HStack>
            )}
          </HStack>
        </VStack>

        <Icon as={FiExternalLink} boxSize={4} color="gray.400" />
      </HStack>
    );
  }

  // Detailed variant
  return (
    <HStack
      spacing={4}
      p={4}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="transparent"
      _hover={{
        bg: hoverBg,
        borderColor: "orange.200",
        transform: "translateY(-2px)",
        boxShadow: "md",
      }}
      transition="all 0.3s"
      cursor="pointer"
      as={RouterLink}
      to={getContentLink(item)}
    >
      {/* Rank Badge */}
      <Badge
        colorScheme={rankColor}
        borderRadius="full"
        minW="40px"
        h="40px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="lg"
        fontWeight="bold"
      >
        {rank}
      </Badge>

      {/* Content Info */}
      <VStack align="start" spacing={2} flex="1" minW="0">
        <HStack spacing={2} w="full">
          <Text fontSize="md" fontWeight="bold" noOfLines={1} flex="1">
            {item.contentTitle || `${item.contentType} ${item.contentId}`}
          </Text>
          <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={2}>
            {item.contentType}
          </Badge>
        </HStack>

        <HStack spacing={4} fontSize="sm" color="gray.500">
          <HStack spacing={1}>
            <Icon as={FiEye} boxSize={4} color="blue.500" />
            <Text fontWeight="medium">{formatViewCount(item.viewCount)}</Text>
            <Text>views</Text>
          </HStack>

          <HStack spacing={1}>
            <Icon as={FiClock} boxSize={4} color="green.500" />
            <Text fontWeight="medium">{formatViewCount(item.recentViews)}</Text>
            <Text>recent</Text>
          </HStack>

          {showTrend && (
            <HStack spacing={1}>
              <Icon
                as={trendingIcon.icon}
                boxSize={4}
                color={trendingIcon.color}
              />
              <Text fontWeight="medium" color={trendingIcon.color}>
                {item.trendingScore.toFixed(1)} trend
              </Text>
            </HStack>
          )}
        </HStack>
      </VStack>

      {/* Action Icon */}
      <Icon as={FiExternalLink} boxSize={5} color="gray.400" />
    </HStack>
  );
}

// Helper function to get rank color
function getRankColor(rank: number): string {
  if (rank === 1) return "yellow";
  if (rank <= 3) return "orange";
  if (rank <= 5) return "purple";
  return "blue";
}

// Quick trending widget for sidebars
export function TrendingWidget({
  contentType,
  limit = 5,
}: {
  contentType?: ContentType;
  limit?: number;
}) {
  return (
    <TrendingContent
      contentType={contentType}
      hours={24}
      limit={limit}
      variant="compact"
      title="🔥 Trending Now"
      showTimeframe={false}
    />
  );
}
