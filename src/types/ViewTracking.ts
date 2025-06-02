// src/types/ViewTracking.ts
export type ContentType = "Post" | "KDom";

export interface ViewTrackingCreateDto {
  contentType: ContentType;
  contentId: string;
  viewerId?: number | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface ViewStatsDto {
  contentType: ContentType;
  contentId: string;
  viewCount: number;
  recentViews: number; // Last 24h
  uniqueViewers: number;
  lastViewed?: string | null;
  growthRate: number; // Percentage growth
  popularityLevel: string; // New, Growing, Popular, Viral
}

export interface TrendingContentDto {
  contentId: string;
  contentType: ContentType;
  contentTitle: string;
  viewCount: number;
  recentViews: number;
  trendingScore: number;
  lastViewed: string;
}

export interface TopContentDto {
  contentId: string;
  contentType: ContentType;
  title: string;
  viewCount: number;
  createdAt: string;
  slug?: string | null;
}

export interface ViewTrendsDto {
  growthRate: number; // Percentage
  mostActiveHour: number; // 0-23
  mostActiveDay: string; // Monday, Tuesday, etc.
  peakViews: number;
  peakViewsDate: string;
  viewDistribution: Record<string, number>; // Hour distribution
}

export interface AnalyticsDto {
  periodDays: number;
  totalViews: number;
  viewsByType: Record<string, number>;
  topKDoms: TopContentDto[];
  topPosts: TopContentDto[];
  dailyViews: Record<string, number>;
  trends: ViewTrendsDto;
}

export interface UserViewBreakdownDto {
  totalViews: number;
  breakdown: Record<string, number>;
  uniqueViewers: number;
  viewsByMonth: Record<string, number>;
  topContent: TopContentDto[];
}

// Pentru response-uri API
export interface ViewTrackingResponse {
  message: string;
  success: boolean;
}

export interface ViewCountResponse {
  contentType: ContentType;
  contentId: string;
  viewCount: number;
}

export interface RecentViewsResponse {
  contentType: ContentType;
  contentId: string;
  hours: number;
  recentViews: number;
}

export interface UniqueViewersResponse {
  contentType: ContentType;
  contentId: string;
  uniqueViewers: number;
}

export interface TrendingResponse {
  contentType: string;
  hours: number;
  trending: TrendingContentDto[];
}

export interface TopViewedResponse {
  contentType: ContentType;
  topViewed: Record<string, number>;
}

// Pentru analytics dashboard
export interface ViewMetrics {
  totalViews: number;
  todayViews: number;
  thisWeekViews: number;
  thisMonthViews: number;
  growthRate: number;
  popularityLevel: string;
}

// Pentru componente UI
export interface ViewDisplayProps {
  contentType: ContentType;
  contentId: string;
  showDetailed?: boolean;
  refreshInterval?: number;
}

export interface ViewBadgeProps {
  viewCount: number;
  size?: "sm" | "md" | "lg";
  variant?: "subtle" | "solid" | "outline";
  showIcon?: boolean;
}

export interface TrendingItemProps {
  item: TrendingContentDto;
  rank: number;
  showTrend?: boolean;
}

// Pentru tracking options
export interface ViewTrackingOptions {
  enabled?: boolean;
  trackAnonymous?: boolean;
  debounceMs?: number;
  retryAttempts?: number;
  trackScrollDepth?: boolean;
  trackTimeSpent?: boolean;
}

// Pentru error handling
export interface ViewTrackingError {
  code: string;
  message: string;
  contentId?: string;
  contentType?: ContentType;
  timestamp: string;
}

export interface ViewTrackingResult<T = unknown> {
  success: boolean;
  error?: ViewTrackingError;
  data?: T;
}
