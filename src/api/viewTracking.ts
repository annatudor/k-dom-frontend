// src/api/viewTracking.ts
import API from "./axios";
import type {
  ViewTrackingCreateDto,
  ViewStatsDto,
  TrendingContentDto,
  AnalyticsDto,
  UserViewBreakdownDto,
  ContentType,
  ViewTrackingResponse,
  ViewCountResponse,
  RecentViewsResponse,
  UniqueViewersResponse,
  TrendingResponse,
  TopViewedResponse,
} from "../types/ViewTracking";

// === BASIC TRACKING OPERATIONS ===

/**
 * Track a view for content (Post or KDom)
 */
export const trackView = async (
  data: ViewTrackingCreateDto
): Promise<ViewTrackingResponse> => {
  const response = await API.post("/view-tracking/track", data);
  return response.data;
};

/**
 * Get total view count for content
 */
export const getViewCount = async (
  contentType: ContentType,
  contentId: string
): Promise<number> => {
  const response = await API.get<ViewCountResponse>("/view-tracking/count", {
    params: { contentType, contentId },
  });
  return response.data.viewCount;
};

/**
 * Get detailed stats for content
 */
export const getViewStats = async (
  contentType: ContentType,
  contentId: string
): Promise<ViewStatsDto> => {
  const response = await API.get<ViewStatsDto>("/view-tracking/stats", {
    params: { contentType, contentId },
  });
  return response.data;
};

/**
 * Get recent views (last X hours)
 */
export const getRecentViews = async (
  contentType: ContentType,
  contentId: string,
  hours: number = 24
): Promise<number> => {
  const response = await API.get<RecentViewsResponse>("/view-tracking/recent", {
    params: { contentType, contentId, hours },
  });
  return response.data.recentViews;
};

/**
 * Get unique viewers count
 */
export const getUniqueViewers = async (
  contentType: ContentType,
  contentId: string
): Promise<number> => {
  const response = await API.get<UniqueViewersResponse>(
    "/view-tracking/unique-viewers",
    {
      params: { contentType, contentId },
    }
  );
  return response.data.uniqueViewers;
};

// === TRENDING & TOP CONTENT ===

/**
 * Get top viewed content by type
 */
export const getTopViewed = async (
  contentType: ContentType,
  limit: number = 10
): Promise<Record<string, number>> => {
  const response = await API.get<TopViewedResponse>(
    "/view-tracking/top-viewed",
    {
      params: { contentType, limit },
    }
  );
  return response.data.topViewed;
};

/**
 * Get trending content
 */
export const getTrendingContent = async (
  contentType?: ContentType,
  hours: number = 24,
  limit: number = 10
): Promise<TrendingContentDto[]> => {
  const params: Record<string, unknown> = { hours, limit };
  if (contentType) {
    params.contentType = contentType;
  }

  const response = await API.get<TrendingResponse>("/view-tracking/trending", {
    params,
  });
  return response.data.trending;
};

// === USER STATS (Authenticated only) ===

/**
 * Get current user's view stats
 */
export const getMyViewStats = async (): Promise<UserViewBreakdownDto> => {
  const response = await API.get<UserViewBreakdownDto>(
    "/view-tracking/my-stats"
  );
  return response.data;
};

// === ANALYTICS (Admin/Moderator only) ===

/**
 * Get comprehensive analytics
 */
export const getAnalytics = async (
  days: number = 30
): Promise<AnalyticsDto> => {
  const response = await API.get<AnalyticsDto>("/view-tracking/analytics", {
    params: { days },
  });
  return response.data;
};

/**
 * Get total views for period
 */
export const getTotalViews = async (days: number = 30): Promise<number> => {
  const response = await API.get<{ totalViews: number }>(
    "/view-tracking/total-views",
    {
      params: { days },
    }
  );
  return response.data.totalViews;
};

/**
 * Get views breakdown by content type
 */
export const getViewsByContentType = async (
  days: number = 30
): Promise<Record<string, number>> => {
  const response = await API.get<{ breakdown: Record<string, number> }>(
    "/view-tracking/content-type-breakdown",
    {
      params: { days },
    }
  );
  return response.data.breakdown;
};

/**
 * Get daily views for period
 */
export const getDailyViews = async (
  days: number = 30
): Promise<Record<string, number>> => {
  const response = await API.get<{ dailyViews: Record<string, number> }>(
    "/view-tracking/daily-views",
    {
      params: { days },
    }
  );
  return response.data.dailyViews;
};

/**
 * Get user view stats (Admin only)
 */
export const getUserViewStats = async (
  userId: number
): Promise<UserViewBreakdownDto> => {
  const response = await API.get<UserViewBreakdownDto>(
    `/view-tracking/user-stats/${userId}`
  );
  return response.data;
};

// === UTILITY FUNCTIONS ===

/**
 * Check if view tracking service is healthy
 */
export const checkViewTrackingHealth = async (): Promise<{
  status: string;
  message: string;
}> => {
  const response = await API.get("/view-tracking/health");
  return response.data;
};

/**
 * Batch track multiple views (if implemented in backend)
 */
export const batchTrackViews = async (
  views: ViewTrackingCreateDto[]
): Promise<ViewTrackingResponse> => {
  const response = await API.post("/view-tracking/batch", { views });
  return response.data;
};

// === HELPER FUNCTIONS ===

/**
 * Create view tracking data from basic info
 */
export const createViewTrackingData = (
  contentType: ContentType,
  contentId: string,
  options?: {
    viewerId?: number;
    includeUserAgent?: boolean;
  }
): ViewTrackingCreateDto => {
  const data: ViewTrackingCreateDto = {
    contentType,
    contentId,
  };

  if (options?.viewerId) {
    data.viewerId = options.viewerId;
  }

  if (options?.includeUserAgent) {
    data.userAgent = navigator.userAgent;
  }

  return data;
};

/**
 * Format view count for display
 */
export const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

/**
 * Get popularity badge color based on level
 */
export const getPopularityColor = (
  level: string
): "gray" | "green" | "blue" | "purple" | "red" => {
  switch (level.toLowerCase()) {
    case "viral":
      return "red";
    case "popular":
      return "purple";
    case "growing":
      return "blue";
    case "active":
      return "green";
    default:
      return "gray";
  }
};

/**
 * Calculate view growth rate display
 */
export const formatGrowthRate = (rate: number): string => {
  const sign = rate >= 0 ? "+" : "";
  return `${sign}${rate.toFixed(1)}%`;
};

/**
 * Get time-based greeting for analytics
 */
export const getAnalyticsTimeframe = (days: number): string => {
  if (days === 1) return "Today";
  if (days === 7) return "This Week";
  if (days === 30) return "This Month";
  if (days === 365) return "This Year";
  return `Last ${days} Days`;
};
