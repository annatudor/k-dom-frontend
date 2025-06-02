// src/components/view-tracking/ViewStats.tsx
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
  Tooltip,
  Box,
  Divider,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import {
  FiEye,
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiActivity,
  FiBarChart2,
  FiTarget,
  FiAlertCircle,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import {
  getViewStats,
  formatViewCount,
  getPopularityColor,
} from "@/api/viewTracking";
import type { ContentType } from "@/types/ViewTracking";

interface ViewStatsProps {
  contentType: ContentType;
  contentId: string;
  variant?: "sidebar" | "card" | "detailed" | "minimal";
  refreshInterval?: number;
  showComparison?: boolean;
}

export function ViewStats({
  contentType,
  contentId,
  variant = "sidebar",
  refreshInterval = 300000, // 5 minutes
}: ViewStatsProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const statsBg = useColorModeValue("blue.50", "blue.900");

  const {
    data: viewStats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["view-stats", contentType, contentId],
    queryFn: () => getViewStats(contentType, contentId),
    enabled: !!contentId,
    refetchInterval: refreshInterval,
    staleTime: 60000, // 1 minute
  });

  if (isLoading) {
    return <ViewStatsSkeleton variant={variant} />;
  }

  if (error || !viewStats) {
    return <ViewStatsError variant={variant} />;
  }

  // Calculate percentage for progress bars
  const recentViewsPercentage =
    viewStats.viewCount > 0
      ? (viewStats.recentViews / viewStats.viewCount) * 100
      : 0;

  const uniqueViewersPercentage =
    viewStats.viewCount > 0
      ? (viewStats.uniqueViewers / viewStats.viewCount) * 100
      : 0;

  const popularityColor = getPopularityColor(viewStats.popularityLevel);

  if (variant === "minimal") {
    return (
      <HStack spacing={4} fontSize="sm">
        <HStack spacing={1}>
          <Icon as={FiEye} boxSize={4} color="blue.500" />
          <Text fontWeight="medium">
            {formatViewCount(viewStats.viewCount)}
          </Text>
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
                {formatViewCount(viewStats.viewCount)}
              </StatNumber>
              {viewStats.growthRate !== 0 && (
                <StatHelpText fontSize="xs">
                  <StatArrow
                    type={viewStats.growthRate > 0 ? "increase" : "decrease"}
                  />
                  {Math.abs(viewStats.growthRate).toFixed(1)}%
                </StatHelpText>
              )}
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
                <Icon
                  as={FiEye}
                  boxSize={6}
                  color="blue.500"
                  mx="auto"
                  mb={2}
                />
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {formatViewCount(viewStats.viewCount)}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Total Views
                </Text>
              </Box>

              <Box p={4} bg="green.50" borderRadius="lg" textAlign="center">
                <Icon
                  as={FiClock}
                  boxSize={6}
                  color="green.500"
                  mx="auto"
                  mb={2}
                />
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {viewStats.recentViews}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Recent (24h)
                </Text>
              </Box>

              <Box p={4} bg="purple.50" borderRadius="lg" textAlign="center">
                <Icon
                  as={FiUsers}
                  boxSize={6}
                  color="purple.500"
                  mx="auto"
                  mb={2}
                />
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                  {viewStats.uniqueViewers}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Unique Viewers
                </Text>
              </Box>

              <Box p={4} bg="orange.50" borderRadius="lg" textAlign="center">
                <Icon
                  as={FiTarget}
                  boxSize={6}
                  color="orange.500"
                  mx="auto"
                  mb={2}
                />
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

            {/* Progress indicators */}
            <VStack spacing={4} align="stretch">
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
                  size="md"
                  borderRadius="full"
                />
              </Box>

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
                  size="md"
                  borderRadius="full"
                />
              </Box>
            </VStack>

            {/* Growth indicator */}
            {viewStats.growthRate !== 0 && (
              <Box p={4} bg="gray.50" borderRadius="lg">
                <HStack spacing={3}>
                  <Icon
                    as={FiTrendingUp}
                    boxSize={5}
                    color={viewStats.growthRate > 0 ? "green.500" : "red.500"}
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="medium">
                      Growth Rate
                    </Text>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color={viewStats.growthRate > 0 ? "green.600" : "red.600"}
                    >
                      {viewStats.growthRate > 0 ? "+" : ""}
                      {viewStats.growthRate.toFixed(1)}%
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}

            {/* Last viewed */}
            {viewStats.lastViewed && (
              <Text fontSize="xs" color="gray.500" textAlign="center">
                Last viewed: {new Date(viewStats.lastViewed).toLocaleString()}
              </Text>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Sidebar variant (default)
  return (
    <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
      <CardHeader pb={3}>
        <HStack spacing={3}>
          <Icon as={FiEye} color="blue.500" boxSize={5} />
          <Heading size="md">View Stats</Heading>
        </HStack>
      </CardHeader>
      <CardBody pt={3}>
        <VStack spacing={4} align="stretch">
          {/* Total Views */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">
                Total Views
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">
                {formatViewCount(viewStats.viewCount)}
              </Text>
            </HStack>

            {viewStats.growthRate !== 0 && (
              <HStack spacing={1} fontSize="xs" color="gray.500">
                <Icon
                  as={FiTrendingUp}
                  boxSize={3}
                  color={viewStats.growthRate > 0 ? "green.500" : "red.500"}
                />
                <Text
                  color={viewStats.growthRate > 0 ? "green.600" : "red.600"}
                >
                  {viewStats.growthRate > 0 ? "+" : ""}
                  {viewStats.growthRate.toFixed(1)}%
                </Text>
                <Text>vs previous period</Text>
              </HStack>
            )}
          </Box>

          <Divider />

          {/* Recent Activity */}
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Icon as={FiClock} boxSize={4} color="green.500" />
                <Text fontSize="sm">Recent (24h)</Text>
              </HStack>
              <Text fontSize="md" fontWeight="semibold" color="green.600">
                {viewStats.recentViews}
              </Text>
            </HStack>

            <Box>
              <Progress
                value={recentViewsPercentage}
                colorScheme="green"
                size="sm"
                borderRadius="full"
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {recentViewsPercentage.toFixed(1)}% of total views
              </Text>
            </Box>
          </VStack>

          <Divider />

          {/* Unique Viewers */}
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Icon as={FiUsers} boxSize={4} color="purple.500" />
                <Text fontSize="sm">Unique Viewers</Text>
              </HStack>
              <Text fontSize="md" fontWeight="semibold" color="purple.600">
                {viewStats.uniqueViewers}
              </Text>
            </HStack>

            <Box>
              <Progress
                value={uniqueViewersPercentage}
                colorScheme="purple"
                size="sm"
                borderRadius="full"
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {uniqueViewersPercentage.toFixed(1)}% unique engagement
              </Text>
            </Box>
          </VStack>

          <Divider />

          {/* Popularity Level */}
          <HStack justify="space-between" align="center">
            <HStack spacing={2}>
              <Icon as={FiTarget} boxSize={4} color="orange.500" />
              <Text fontSize="sm">Popularity</Text>
            </HStack>
            <Tooltip
              label={`This content is performing at ${viewStats.popularityLevel.toLowerCase()} level`}
            >
              <Badge
                colorScheme={popularityColor}
                px={3}
                py={1}
                borderRadius="full"
                cursor="help"
              >
                {viewStats.popularityLevel}
              </Badge>
            </Tooltip>
          </HStack>

          {/* Last Viewed */}
          {viewStats.lastViewed && (
            <>
              <Divider />
              <Text fontSize="xs" color="gray.500" textAlign="center">
                Last viewed: {new Date(viewStats.lastViewed).toLocaleString()}
              </Text>
            </>
          )}
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

  // Default skeleton for sidebar/detailed variants
  return (
    <Card>
      <CardHeader>
        <Skeleton height="24px" width="100px" />
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {Array.from({ length: 5 }).map((_, i) => (
            <Box key={i}>
              <HStack justify="space-between" mb={2}>
                <Skeleton height="16px" width="80px" />
                <Skeleton height="20px" width="40px" />
              </HStack>
              {i < 3 && <Skeleton height="8px" width="100%" />}
            </Box>
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

// Quick stats for dashboards
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
      refreshInterval={0} // No auto-refresh for quick stats
    />
  );
}

// Detailed analytics for content pages
export function DetailedViewStats({
  contentType,
  contentId,
  showComparison = true,
}: {
  contentType: ContentType;
  contentId: string;
  showComparison?: boolean;
}) {
  return (
    <ViewStats
      contentType={contentType}
      contentId={contentId}
      variant="detailed"
      showComparison={showComparison}
      refreshInterval={300000} // 5 minutes
    />
  );
}

// Sidebar stats for content editing
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
      refreshInterval={600000} // 10 minutes
    />
  );
}
