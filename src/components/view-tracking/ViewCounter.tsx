// src/components/view-tracking/ViewCounter.tsx
import React from "react";
import {
  HStack,
  VStack,
  Text,
  Badge,
  Icon,
  Tooltip,
  Skeleton,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiEye, FiTrendingUp, FiUsers, FiClock } from "react-icons/fi";
import { useViewTracking, useViewCount } from "@/hooks/useViewTracking";
import { formatViewCount, getPopularityColor } from "@/api/viewTracking";
import type { ContentType, ViewBadgeProps } from "@/types/ViewTracking";

interface ViewCounterProps {
  contentType: ContentType;
  contentId: string;
  variant?: "minimal" | "detailed" | "badge" | "stats";
  size?: "sm" | "md" | "lg";
  showPopularity?: boolean;
  enableTracking?: boolean;
  refreshInterval?: number;
}

export function ViewCounter({
  contentType,
  contentId,
  variant = "minimal",
  size = "md",
  showPopularity = false,
  enableTracking = true,
  refreshInterval,
}: ViewCounterProps) {
  const textColor = useColorModeValue("gray.600", "gray.400");
  const iconColor = useColorModeValue("gray.500", "gray.500");

  // Use appropriate hook based on whether tracking is enabled
  const trackingResult = useViewTracking({
    contentType,
    contentId,
    options: { enabled: enableTracking },
  });

  const countOnlyResult = useViewCount(contentType, contentId);

  // Choose which result to use and normalize the interface
  const result = enableTracking ? trackingResult : countOnlyResult;

  // Extract common properties with proper fallbacks
  const viewCount = result.viewCount || 0;
  const isLoadingCount = enableTracking
    ? trackingResult.isLoadingCount
    : countOnlyResult.isLoading;
  const viewStats = enableTracking ? trackingResult.viewStats : null;

  // Auto-refresh if interval is set and tracking is enabled
  React.useEffect(() => {
    if (!refreshInterval || !enableTracking || !trackingResult.refreshStats)
      return;

    const interval = setInterval(() => {
      trackingResult.refreshStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [
    refreshInterval,
    enableTracking,
    trackingResult,
    trackingResult.refreshStats,
  ]);

  // Size configurations
  const sizeConfig = {
    sm: {
      iconSize: 3,
      fontSize: "xs",
      spacing: 1,
      badgePx: 2,
      badgePy: 1,
    },
    md: {
      iconSize: 4,
      fontSize: "sm",
      spacing: 2,
      badgePx: 3,
      badgePy: 1,
    },
    lg: {
      iconSize: 5,
      fontSize: "md",
      spacing: 3,
      badgePx: 4,
      badgePy: 2,
    },
  };

  const config = sizeConfig[size];

  // Loading state
  if (isLoadingCount) {
    return (
      <Skeleton height={variant === "badge" ? "24px" : "20px"} width="60px" />
    );
  }

  // Badge variant
  if (variant === "badge") {
    return (
      <ViewBadge
        viewCount={viewCount}
        size={size}
        showIcon={true}
        variant="subtle"
      />
    );
  }

  // Minimal variant
  if (variant === "minimal") {
    return (
      <HStack spacing={config.spacing} color={textColor}>
        <Icon as={FiEye} boxSize={config.iconSize} color={iconColor} />
        <Text fontSize={config.fontSize} fontWeight="medium">
          {formatViewCount(viewCount)}
        </Text>
      </HStack>
    );
  }

  // Detailed variant
  if (variant === "detailed") {
    return (
      <VStack spacing={2} align="start">
        <HStack spacing={config.spacing}>
          <Icon as={FiEye} boxSize={config.iconSize} color="blue.500" />
          <Text fontSize={config.fontSize} fontWeight="bold" color="blue.600">
            {formatViewCount(viewCount)} views
          </Text>
        </HStack>

        {viewStats && (
          <HStack spacing={4} fontSize="xs" color={textColor}>
            <HStack spacing={1}>
              <Icon as={FiClock} boxSize={3} />
              <Text>{viewStats.recentViews} today</Text>
            </HStack>
            <HStack spacing={1}>
              <Icon as={FiUsers} boxSize={3} />
              <Text>{viewStats.uniqueViewers} unique</Text>
            </HStack>
            {showPopularity && (
              <Badge
                colorScheme={getPopularityColor(viewStats.popularityLevel)}
                size="sm"
                borderRadius="full"
              >
                {viewStats.popularityLevel}
              </Badge>
            )}
          </HStack>
        )}
      </VStack>
    );
  }

  // Stats variant (comprehensive)
  if (variant === "stats") {
    return (
      <VStack spacing={3} align="stretch" w="full">
        {/* Main view count */}
        <HStack justify="space-between" align="center">
          <HStack spacing={config.spacing}>
            <Icon as={FiEye} boxSize={5} color="blue.500" />
            <Text fontSize="lg" fontWeight="bold" color="blue.600">
              {formatViewCount(viewCount)}
            </Text>
            <Text fontSize="sm" color={textColor}>
              total views
            </Text>
          </HStack>

          {viewStats && showPopularity && (
            <Badge
              colorScheme={getPopularityColor(viewStats.popularityLevel)}
              px={config.badgePx}
              py={config.badgePy}
              borderRadius="full"
              fontWeight="bold"
            >
              {viewStats.popularityLevel}
            </Badge>
          )}
        </HStack>

        {/* Detailed stats */}
        {viewStats && (
          <HStack spacing={6} fontSize="sm" color={textColor}>
            <Tooltip label="Views in the last 24 hours">
              <HStack spacing={1}>
                <Icon as={FiClock} boxSize={4} color="green.500" />
                <Text fontWeight="medium">{viewStats.recentViews}</Text>
                <Text>recent</Text>
              </HStack>
            </Tooltip>

            <Tooltip label="Unique viewers">
              <HStack spacing={1}>
                <Icon as={FiUsers} boxSize={4} color="purple.500" />
                <Text fontWeight="medium">{viewStats.uniqueViewers}</Text>
                <Text>unique</Text>
              </HStack>
            </Tooltip>

            {viewStats.growthRate !== 0 && (
              <Tooltip label="Growth rate compared to previous period">
                <HStack spacing={1}>
                  <Icon
                    as={FiTrendingUp}
                    boxSize={4}
                    color={viewStats.growthRate > 0 ? "green.500" : "red.500"}
                  />
                  <Text
                    fontWeight="medium"
                    color={viewStats.growthRate > 0 ? "green.600" : "red.600"}
                  >
                    {viewStats.growthRate > 0 ? "+" : ""}
                    {viewStats.growthRate.toFixed(1)}%
                  </Text>
                </HStack>
              </Tooltip>
            )}
          </HStack>
        )}
      </VStack>
    );
  }

  // Default fallback
  return (
    <HStack spacing={config.spacing} color={textColor}>
      <Icon as={FiEye} boxSize={config.iconSize} color={iconColor} />
      <Text fontSize={config.fontSize}>{formatViewCount(viewCount)}</Text>
    </HStack>
  );
}

// Separate ViewBadge component for reusability
export function ViewBadge({
  viewCount,
  size = "md",
  variant = "subtle",
  showIcon = true,
}: ViewBadgeProps) {
  const sizeConfig = {
    sm: { fontSize: "xs", px: 2, py: 1, iconSize: 3 },
    md: { fontSize: "sm", px: 3, py: 1, iconSize: 4 },
    lg: { fontSize: "md", px: 4, py: 2, iconSize: 5 },
  };

  const config = sizeConfig[size];

  return (
    <Badge
      colorScheme="blue"
      variant={variant}
      px={config.px}
      py={config.py}
      borderRadius="full"
      fontSize={config.fontSize}
      fontWeight="semibold"
      display="flex"
      alignItems="center"
      gap={showIcon ? 1 : 0}
    >
      {showIcon && <Icon as={FiEye} boxSize={config.iconSize} />}
      {formatViewCount(viewCount)}
    </Badge>
  );
}

// Quick view counter for lists/feeds
export function QuickViewCounter({
  contentType,
  contentId,
  size = "sm",
}: {
  contentType: ContentType;
  contentId: string;
  size?: "sm" | "md";
}) {
  const { viewCount, isLoading } = useViewCount(contentType, contentId);

  if (isLoading) {
    return <Skeleton height="16px" width="40px" />;
  }

  return (
    <HStack spacing={1} color="gray.500" fontSize={size === "sm" ? "xs" : "sm"}>
      <Icon as={FiEye} boxSize={size === "sm" ? 3 : 4} />
      <Text>{formatViewCount(viewCount)}</Text>
    </HStack>
  );
}

// View counter with auto-tracking for content pages
export function AutoTrackingViewCounter({
  contentType,
  contentId,
  variant = "detailed",
  showDebugInfo = false,
}: {
  contentType: ContentType;
  contentId: string;
  variant?: "minimal" | "detailed" | "stats";
  showDebugInfo?: boolean;
}) {
  const { isLoadingCount, isTracking, hasTracked, trackingEnabled, error } =
    useViewTracking({
      contentType,
      contentId,
      options: {
        enabled: true,
        trackAnonymous: true,
        debounceMs: 2000,
      },
    });

  // Check if we're in development mode safely
  const isDevelopment =
    typeof window !== "undefined" && window.location.hostname === "localhost";

  return (
    <VStack spacing={3} align="stretch">
      <ViewCounter
        contentType={contentType}
        contentId={contentId}
        variant={variant}
        enableTracking={false} // We're already tracking with the hook
      />

      {/* Debug info for development */}
      {showDebugInfo && isDevelopment && (
        <Box
          p={2}
          bg="gray.100"
          borderRadius="md"
          fontSize="xs"
          color="gray.600"
          fontFamily="mono"
        >
          <Text>Debug: Tracking={trackingEnabled ? "✓" : "✗"}</Text>
          <Text>Tracked={hasTracked ? "✓" : "✗"}</Text>
          <Text>Loading={isLoadingCount ? "✓" : "✗"}</Text>
          <Text>InProgress={isTracking ? "✓" : "✗"}</Text>
          {error && <Text color="red.500">Error: {error.message}</Text>}
        </Box>
      )}
    </VStack>
  );
}
