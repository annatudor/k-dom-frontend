// src/hooks/useViewTracking.ts
import { useEffect, useRef, useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  trackView,
  getViewCount,
  getViewStats,
  createViewTrackingData,
} from "@/api/viewTracking";
import type {
  ContentType,
  ViewTrackingOptions,
  ViewStatsDto,
  ViewTrackingResult,
} from "@/types/ViewTracking";

interface UseViewTrackingProps {
  contentType: ContentType;
  contentId: string;
  options?: ViewTrackingOptions;
}

interface UseViewTrackingReturn {
  // Basic data
  viewCount: number;
  viewStats: ViewStatsDto | null;

  // Loading states
  isLoadingCount: boolean;
  isLoadingStats: boolean;
  isTracking: boolean;

  // Functions
  trackViewNow: () => Promise<ViewTrackingResult>;
  refreshStats: () => void;

  // Status
  hasTracked: boolean;
  trackingEnabled: boolean;
  error: Error | null;
}

const defaultOptions: ViewTrackingOptions = {
  enabled: true,
  trackAnonymous: true,
  debounceMs: 2000, // 2 seconds delay before tracking
  retryAttempts: 3,
  trackScrollDepth: false,
  trackTimeSpent: false,
};

export function useViewTracking({
  contentType,
  contentId,
  options = {},
}: UseViewTrackingProps): UseViewTrackingReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Merge options with defaults
  const finalOptions = { ...defaultOptions, ...options };

  // State
  const [hasTracked, setHasTracked] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Refs for tracking logic
  const trackingTimeoutRef = useRef<number | null>(null);
  const hasStartedTracking = useRef(false);
  const retryCount = useRef(0);

  // FIXED: Determine if tracking should be enabled with proper boolean conversion
  const trackingEnabled = Boolean(
    finalOptions.enabled &&
      !!contentId &&
      (!!user || finalOptions.trackAnonymous)
  );

  // Query for view count
  const {
    data: viewCount = 0,
    isLoading: isLoadingCount,
    refetch: refetchCount,
  } = useQuery({
    queryKey: ["view-count", contentType, contentId],
    queryFn: () => getViewCount(contentType, contentId),
    enabled: !!contentId,
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
  });

  // Query for detailed stats
  const {
    data: viewStats = null,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["view-stats", contentType, contentId],
    queryFn: () => getViewStats(contentType, contentId),
    enabled: !!contentId,
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  });

  // Mutation for tracking views
  const trackViewMutation = useMutation({
    mutationFn: trackView,
    onSuccess: () => {
      setHasTracked(true);
      setError(null);
      retryCount.current = 0;

      // Update the view count optimistically
      queryClient.setQueryData(
        ["view-count", contentType, contentId],
        (oldCount: number | undefined) => (oldCount || 0) + 1
      );

      // Invalidate queries after a short delay
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["view-count", contentType, contentId],
        });
        queryClient.invalidateQueries({
          queryKey: ["view-stats", contentType, contentId],
        });
      }, 1000);
    },
    onError: (error: Error) => {
      setError(error);

      // Retry logic
      if (retryCount.current < finalOptions.retryAttempts!) {
        retryCount.current++;
        setTimeout(() => {
          if (trackingEnabled) {
            trackViewNow();
          }
        }, Math.pow(2, retryCount.current) * 1000); // Exponential backoff
      }
    },
  });

  // Function to track view immediately
  const trackViewNow = useCallback(async (): Promise<ViewTrackingResult> => {
    if (!trackingEnabled || hasTracked) {
      return {
        success: false,
        error: {
          code: "DISABLED",
          message: "Tracking disabled or already tracked",
          timestamp: new Date().toISOString(),
        },
      };
    }

    try {
      const trackingData = createViewTrackingData(contentType, contentId, {
        viewerId: user?.id,
        includeUserAgent: true,
      });

      await trackViewMutation.mutateAsync(trackingData);

      return { success: true };
    } catch (error) {
      const trackingError = {
        code: "TRACKING_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
        contentId,
        contentType,
        timestamp: new Date().toISOString(),
      };

      return { success: false, error: trackingError };
    }
  }, [
    trackingEnabled,
    hasTracked,
    contentType,
    contentId,
    user?.id,
    trackViewMutation,
  ]);

  // Function to refresh stats
  const refreshStats = useCallback(() => {
    refetchCount();
    refetchStats();
  }, [refetchCount, refetchStats]);

  // Auto-track when component mounts/content changes
  useEffect(() => {
    if (!trackingEnabled || hasTracked || hasStartedTracking.current) {
      return;
    }

    hasStartedTracking.current = true;

    // Clear any existing timeout
    if (trackingTimeoutRef.current) {
      clearTimeout(trackingTimeoutRef.current);
    }

    // Set up debounced tracking
    trackingTimeoutRef.current = window.setTimeout(() => {
      trackViewNow();
    }, finalOptions.debounceMs);

    // Cleanup function
    return () => {
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
        trackingTimeoutRef.current = null;
      }
    };
  }, [trackingEnabled, hasTracked, trackViewNow, finalOptions.debounceMs]);

  // Reset tracking state when content changes
  useEffect(() => {
    setHasTracked(false);
    setError(null);
    hasStartedTracking.current = false;
    retryCount.current = 0;
  }, [contentType, contentId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Basic data
    viewCount,
    viewStats,

    // Loading states
    isLoadingCount,
    isLoadingStats,
    isTracking: trackViewMutation.isPending,

    // Functions
    trackViewNow,
    refreshStats,

    // Status
    hasTracked,
    trackingEnabled, // Now properly returns boolean
    error,
  };
}

// Hook for multiple content items (e.g., feed)
export function useMultipleViewTracking(
  items: Array<{ contentType: ContentType; contentId: string }>
) {
  const [trackedItems, setTrackedItems] = useState(new Set<string>());

  const trackMultiple = useCallback(async () => {
    const untracked = items.filter(
      (item) => !trackedItems.has(`${item.contentType}-${item.contentId}`)
    );

    if (untracked.length === 0) return;

    // Track each item with a small delay to avoid overwhelming the server
    for (let i = 0; i < untracked.length; i++) {
      const item = untracked[i];

      setTimeout(async () => {
        try {
          const trackingData = createViewTrackingData(
            item.contentType,
            item.contentId,
            { includeUserAgent: true }
          );

          await trackView(trackingData);

          setTrackedItems((prev) =>
            new Set(prev).add(`${item.contentType}-${item.contentId}`)
          );
        } catch (error) {
          console.error(`Failed to track view for ${item.contentId}:`, error);
        }
      }, i * 500); // 500ms delay between each tracking
    }
  }, [items, trackedItems]);

  return {
    trackMultiple,
    trackedItems: trackedItems.size,
    totalItems: items.length,
  };
}

// Hook for view count only (lighter version)
export function useViewCount(contentType: ContentType, contentId: string) {
  const { data: viewCount = 0, isLoading } = useQuery({
    queryKey: ["view-count", contentType, contentId],
    queryFn: () => getViewCount(contentType, contentId),
    enabled: !!contentId,
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  });

  return { viewCount, isLoading };
}
