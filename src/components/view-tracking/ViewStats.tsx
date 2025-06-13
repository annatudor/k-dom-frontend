// src/components/view-tracking/ViewStats.tsx - ÎNLOCUIEȘTE COMPLET
import React from "react"; // ADAUGĂ React import
import {
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Card,
  CardHeader,
  CardBody,
  Skeleton,
  Progress,
  useColorModeValue,
  Box,
  Divider,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import {
  FiEye,
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiActivity,
  FiBarChart2,
  FiAlertCircle,
} from "react-icons/fi";
import { useViewTracking } from "@/hooks/useViewTracking"; // NOUL HOOK
import type { ContentType } from "@/types/ViewTracking";

interface ViewStatsProps {
  contentType: ContentType;
  contentId: string;
  variant?: "sidebar" | "card" | "detailed" | "minimal";
  refreshInterval?: number;
  showComparison?: boolean;
}

// Helper functions (local, nu mai depind de API)
const formatViewCount = (count: number): string => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${Math.floor(count / 100) / 10}K`;
  return `${Math.floor(count / 100000) / 10}M`;
};

const getPopularityColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case "high":
      return "green";
    case "medium":
      return "yellow";
    case "low":
      return "gray";
    default:
      return "blue";
  }
};

export function ViewStats({
  contentType,
  contentId,
  variant = "sidebar",
  refreshInterval,
}: ViewStatsProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const statsBg = useColorModeValue("blue.50", "blue.900");

  // FOLOSEȘTE NOUL HOOK în loc de useQuery + API
  const { viewCount, viewStats, isLoadingCount, refreshStats } =
    useViewTracking({
      contentType,
      contentId,
      options: { enabled: true },
    });

  // Auto-refresh dacă e specificat
  React.useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      refreshStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, refreshStats]);

  if (isLoadingCount) {
    return <ViewStatsSkeleton variant={variant} />;
  }

  if (!viewStats) {
    return <ViewStatsError variant={variant} />;
  }

  // Calculate percentages
  const recentViewsPercentage =
    viewStats.totalViews > 0
      ? (viewStats.recentViews / viewStats.totalViews) * 100
      : 0;

  const uniqueViewersPercentage =
    viewStats.totalViews > 0
      ? (viewStats.uniqueViewers / viewStats.totalViews) * 100
      : 0;

  const popularityColor = getPopularityColor(viewStats.popularityLevel);

  if (variant === "minimal") {
    return (
      <HStack spacing={4} fontSize="sm">
        <HStack spacing={1}>
          <Icon as={FiEye} boxSize={4} color="blue.500" />
          <Text fontWeight="medium">{formatViewCount(viewCount)}</Text>
        </HStack>
        <HStack spacing={1}>
          <Icon as={FiUsers} boxSize={4} color="purple.500" />
          <Text fontWeight="medium">{viewStats.uniqueViewers}</Text>
        </HStack>
        <Badge colorScheme={popularityColor} size="sm">
          {viewStats.popularityLevel}
        </Badge>
      </HStack>
    );
  }

  if (variant === "card") {
    return (
      <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <CardHeader pb={3}>
          <HStack spacing={3}>
            <Icon as={FiBarChart2} color="blue.500" boxSize={5} />
            <Heading size="md">View Statistics</Heading>
          </HStack>
        </CardHeader>
        <CardBody pt={3}>
          <SimpleGrid columns={2} spacing={4}>
            <Stat>
              <StatLabel fontSize="xs">Total Views</StatLabel>
              <StatNumber fontSize="lg">
                {formatViewCount(viewCount)}
              </StatNumber>
            </Stat>

            <Stat>
              <StatLabel fontSize="xs">Recent Views</StatLabel>
              <StatNumber fontSize="lg">{viewStats.recentViews}</StatNumber>
              <StatHelpText fontSize="xs">Last 24h</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel fontSize="xs">Unique Viewers</StatLabel>
              <StatNumber fontSize="lg">{viewStats.uniqueViewers}</StatNumber>
              <StatHelpText fontSize="xs">
                {uniqueViewersPercentage.toFixed(0)}% of total
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel fontSize="xs">Popularity</StatLabel>
              <Badge colorScheme={popularityColor} mt={1} px={2} py={1}>
                {viewStats.popularityLevel}
              </Badge>
            </Stat>
          </SimpleGrid>
        </CardBody>
      </Card>
    );
  }

  if (variant === "detailed") {
    return (
      <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <CardHeader>
          <VStack align="start" spacing={2}>
            <HStack spacing={3}>
              <Icon as={FiActivity} color="blue.500" boxSize={6} />
              <VStack align="start" spacing={0}>
                <Heading size="lg">Performance Analytics</Heading>
                <Text fontSize="sm" color="gray.500">
                  {contentType} viewing statistics
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </CardHeader>

        <Divider />

        <CardBody>
          <VStack spacing={6} align="stretch">
            {/* Main metrics */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Box p={4} bg={statsBg} borderRadius="lg" textAlign="center">
                <Icon as={FiEye} color="blue.500" boxSize={8} mb={2} />
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {viewCount}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Total Views
                </Text>
              </Box>

              <Box p={4} bg="green.50" borderRadius="lg" textAlign="center">
                <Icon as={FiClock} color="green.500" boxSize={8} mb={2} />
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {viewStats.recentViews}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Recent (24h)
                </Text>
              </Box>

              <Box p={4} bg="purple.50" borderRadius="lg" textAlign="center">
                <Icon as={FiUsers} color="purple.500" boxSize={8} mb={2} />
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                  {viewStats.uniqueViewers}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Unique Viewers
                </Text>
              </Box>

              <Box p={4} bg="orange.50" borderRadius="lg" textAlign="center">
                <Icon as={FiTrendingUp} color="orange.500" boxSize={8} mb={2} />
                <Badge
                  colorScheme={popularityColor}
                  fontSize="lg"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {viewStats.popularityLevel}
                </Badge>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Popularity
                </Text>
              </Box>
            </SimpleGrid>

            {/* Recent Activity Progress */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium">
                  Recent Activity
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {recentViewsPercentage.toFixed(1)}% of total
                </Text>
              </HStack>
              <Progress
                value={recentViewsPercentage}
                colorScheme="green"
                size="lg"
                borderRadius="full"
              />
            </Box>

            {/* Unique Engagement */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium">
                  Unique Engagement
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {uniqueViewersPercentage.toFixed(1)}% unique
                </Text>
              </HStack>
              <Progress
                value={uniqueViewersPercentage}
                colorScheme="purple"
                size="lg"
                borderRadius="full"
              />
            </Box>

            {/* Last viewed info */}
            {viewStats.lastViewed && (
              <Box
                textAlign="center"
                pt={4}
                borderTop="1px"
                borderColor={borderColor}
              >
                <Text fontSize="sm" color="gray.500">
                  Last viewed: {new Date(viewStats.lastViewed).toLocaleString()}
                </Text>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Default sidebar variant
  return (
    <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" size="sm">
      <CardHeader pb={2}>
        <HStack spacing={2}>
          <Icon as={FiEye} color="blue.500" boxSize={4} />
          <Text fontSize="md" fontWeight="semibold">
            View Stats
          </Text>
        </HStack>
      </CardHeader>
      <CardBody pt={2}>
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              Total Views
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="blue.600">
              {viewCount}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              Recent (24h)
            </Text>
            <Text fontSize="md" fontWeight="semibold" color="green.600">
              {viewStats.recentViews}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              Unique Viewers
            </Text>
            <Text fontSize="md" fontWeight="semibold" color="purple.600">
              {viewStats.uniqueViewers}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              Popularity
            </Text>
            <Badge colorScheme={popularityColor} px={2} py={1}>
              {viewStats.popularityLevel}
            </Badge>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}

// Loading skeleton component
function ViewStatsSkeleton({ variant }: { variant: string }) {
  if (variant === "minimal") {
    return (
      <HStack spacing={4}>
        <Skeleton height="16px" width="60px" />
        <Skeleton height="16px" width="40px" />
        <Skeleton height="20px" width="50px" />
      </HStack>
    );
  }

  if (variant === "card") {
    return (
      <Card>
        <CardHeader>
          <Skeleton height="24px" width="120px" />
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={2} spacing={4}>
            {Array.from({ length: 4 }).map((_, i) => (
              <VStack key={i} align="start" spacing={2}>
                <Skeleton height="12px" width="60px" />
                <Skeleton height="20px" width="40px" />
                <Skeleton height="10px" width="50px" />
              </VStack>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    );
  }

  // Default skeleton
  return (
    <Card>
      <CardHeader>
        <Skeleton height="24px" width="100px" />
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {Array.from({ length: 4 }).map((_, i) => (
            <HStack key={i} justify="space-between">
              <Skeleton height="16px" width="80px" />
              <Skeleton height="20px" width="40px" />
            </HStack>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
}

// Error component
function ViewStatsError({ variant }: { variant: string }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (variant === "minimal") {
    return (
      <HStack spacing={2} color="red.500" fontSize="sm">
        <Icon as={FiAlertCircle} boxSize={4} />
        <Text>Stats unavailable</Text>
      </HStack>
    );
  }

  return (
    <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
      <CardBody>
        <VStack spacing={3} py={6} color="red.500" textAlign="center">
          <Icon as={FiAlertCircle} boxSize={8} />
          <Text fontSize="sm" fontWeight="medium">
            Unable to load statistics
          </Text>
          <Text fontSize="xs" color="gray.500">
            Please try again later
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
}

// Export helper components (compatibility)
export function QuickViewStats({
  contentType,
  contentId,
}: {
  contentType: ContentType;
  contentId: string;
}) {
  return (
    <ViewStats
      contentType={contentType}
      contentId={contentId}
      variant="minimal"
      refreshInterval={0}
    />
  );
}

export function DetailedViewStats({
  contentType,
  contentId,
}: {
  contentType: ContentType;
  contentId: string;
}) {
  return (
    <ViewStats
      contentType={contentType}
      contentId={contentId}
      variant="detailed"
      refreshInterval={30000} // 30 seconds pentru real-time feel
    />
  );
}

export function SidebarViewStats({
  contentType,
  contentId,
}: {
  contentType: ContentType;
  contentId: string;
}) {
  return (
    <ViewStats
      contentType={contentType}
      contentId={contentId}
      variant="sidebar"
      refreshInterval={60000} // 1 minute
    />
  );
}
