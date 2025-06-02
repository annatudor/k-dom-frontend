// src/hooks/useAnalytics.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  getAnalytics,
  getTotalViews,
  getViewsByContentType,
  getDailyViews,
  getMyViewStats,
  getUserViewStats,
  getTrendingContent,
  getTopViewed,
  getAnalyticsTimeframe,
  getViewStats,
} from "@/api/viewTracking";
import type { ContentType } from "@/types/ViewTracking";

// Hook pentru analytics complete (admin/moderator)
export function useAnalytics(days: number = 30) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  const {
    data: analytics,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["analytics", days],
    queryFn: () => getAnalytics(days),
    enabled: isAdmin,
    refetchInterval: 300000, // 5 minutes
    staleTime: 60000, // 1 minute
  });

  return {
    analytics,
    isLoading,
    error,
    refetch,
    isAuthorized: isAdmin,
    timeframe: getAnalyticsTimeframe(days),
  };
}

// Hook pentru statisticile proprii
export function useMyViewStats() {
  const { isAuthenticated } = useAuth();

  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-view-stats"],
    queryFn: getMyViewStats,
    enabled: isAuthenticated,
    refetchInterval: 600000, // 10 minutes
    staleTime: 300000, // 5 minutes
  });

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
}

// Hook pentru statisticile unui utilizator specific (admin only)
export function useUserViewStats(userId: number) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-view-stats", userId],
    queryFn: () => getUserViewStats(userId),
    enabled: isAdmin && !!userId,
    staleTime: 300000, // 5 minutes
  });

  return {
    stats,
    isLoading,
    error,
    refetch,
    isAuthorized: isAdmin,
  };
}

// Hook pentru view metrics simple
export function useViewMetrics(days: number = 30) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  // Total views
  const { data: totalViews = 0, isLoading: isLoadingTotal } = useQuery({
    queryKey: ["total-views", days],
    queryFn: () => getTotalViews(days),
    enabled: isAdmin,
    staleTime: 300000,
  });

  // Views by content type
  const { data: viewsByType = {}, isLoading: isLoadingByType } = useQuery({
    queryKey: ["views-by-type", days],
    queryFn: () => getViewsByContentType(days),
    enabled: isAdmin,
    staleTime: 300000,
  });

  // Daily views
  const { data: dailyViews = {}, isLoading: isLoadingDaily } = useQuery({
    queryKey: ["daily-views", days],
    queryFn: () => getDailyViews(days),
    enabled: isAdmin,
    staleTime: 300000,
  });

  // Calculate additional metrics
  const todayViews = dailyViews[new Date().toISOString().split("T")[0]] || 0;
  const postViews = viewsByType["Post"] || 0;
  const kdomViews = viewsByType["KDom"] || 0;

  const isLoading = isLoadingTotal || isLoadingByType || isLoadingDaily;

  return {
    totalViews,
    todayViews,
    postViews,
    kdomViews,
    viewsByType,
    dailyViews,
    isLoading,
    isAuthorized: isAdmin,
  };
}

// Hook pentru trending content cu opțiuni
export function useTrendingAnalytics(
  contentType?: ContentType,
  hours: number = 24,
  limit: number = 10
) {
  const {
    data: trending = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["trending-analytics", contentType, hours, limit],
    queryFn: () => getTrendingContent(contentType, hours, limit),
    refetchInterval: 300000, // 5 minutes
    staleTime: 60000, // 1 minute
  });

  return {
    trending,
    isLoading,
    error,
    refetch,
  };
}

// Hook pentru top content
export function useTopContent(contentType: ContentType, limit: number = 10) {
  const {
    data: topContent = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["top-content", contentType, limit],
    queryFn: () => getTopViewed(contentType, limit),
    staleTime: 600000, // 10 minutes
  });

  return {
    topContent,
    isLoading,
    error,
    refetch,
  };
}

// Hook pentru dashboard overview
export function useDashboardOverview() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  // Analytics pentru ultimele 30 de zile
  const analytics = useAnalytics(30);

  // View metrics pentru diferite perioade
  const metrics30Days = useViewMetrics(30);
  const metrics7Days = useViewMetrics(7);
  const metrics1Day = useViewMetrics(1);

  // Trending content
  const trendingKDoms = useTrendingAnalytics("KDom", 24, 5);
  const trendingPosts = useTrendingAnalytics("Post", 24, 5);

  // Top content
  const topKDoms = useTopContent("KDom", 5);
  const topPosts = useTopContent("Post", 5);

  const isLoading =
    analytics.isLoading ||
    metrics30Days.isLoading ||
    trendingKDoms.isLoading ||
    topKDoms.isLoading;

  return {
    // Basic metrics
    totalViews30Days: metrics30Days.totalViews,
    totalViews7Days: metrics7Days.totalViews,
    todayViews: metrics1Day.totalViews,

    // Growth calculations
    weeklyGrowth: calculateGrowthRate(
      metrics7Days.totalViews,
      metrics30Days.totalViews - metrics7Days.totalViews
    ),
    dailyGrowth: calculateGrowthRate(
      metrics1Day.totalViews,
      metrics7Days.totalViews - metrics1Day.totalViews
    ),

    // Content breakdown
    postViews: metrics30Days.postViews,
    kdomViews: metrics30Days.kdomViews,

    // Trending
    trendingKDoms: trendingKDoms.trending,
    trendingPosts: trendingPosts.trending,

    // Top content
    topKDoms: topKDoms.topContent,
    topPosts: topPosts.topContent,

    // Full analytics
    analytics: analytics.analytics,

    // States
    isLoading,
    isAuthorized: isAdmin,
    error: analytics.error || trendingKDoms.error || topKDoms.error,

    // Refresh functions
    refresh: () => {
      analytics.refetch();
      trendingKDoms.refetch();
      topKDoms.refetch();
    },
  };
}

// Hook pentru personal analytics (pentru utilizatori normali)
export function usePersonalAnalytics() {
  const myStats = useMyViewStats();
  const myTrendingKDoms = useTrendingAnalytics("KDom", 168, 5); // 7 days
  const myTrendingPosts = useTrendingAnalytics("Post", 168, 5); // 7 days

  return {
    stats: myStats.stats,
    trendingKDoms: myTrendingKDoms.trending,
    trendingPosts: myTrendingPosts.trending,
    isLoading: myStats.isLoading || myTrendingKDoms.isLoading,
    error: myStats.error || myTrendingKDoms.error,
    refresh: () => {
      myStats.refetch();
      myTrendingKDoms.refetch();
    },
  };
}

// Hook pentru real-time updates
export function useRealTimeAnalytics(enabled: boolean = false) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  // Trending content care se actualizează des
  const {
    data: liveTrending = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["live-trending"],
    queryFn: () => getTrendingContent(undefined, 1, 10), // Ultima oră
    enabled: enabled && isAdmin,
    refetchInterval: 30000, // 30 secunde
    staleTime: 10000, // 10 secunde
  });

  // Total views de azi
  const { data: todayTotal = 0 } = useQuery({
    queryKey: ["today-total"],
    queryFn: () => getTotalViews(1),
    enabled: enabled && isAdmin,
    refetchInterval: 60000, // 1 minut
    staleTime: 30000, // 30 secunde
  });

  return {
    liveTrending,
    todayTotal,
    isLoading,
    isEnabled: enabled && isAdmin,
    refresh: refetch,
  };
}

// Hook pentru performance tracking
export function useContentPerformance(
  contentType: ContentType,
  contentId: string,
  days: number = 30
) {
  const { user } = useAuth();

  // View stats pentru conținutul specific
  const { data: viewStats } = useQuery({
    queryKey: ["content-performance", contentType, contentId],
    queryFn: () => getViewStats(contentType, contentId),
    staleTime: 300000, // 5 minute
  });

  // Comparare cu media pentru tipul de conținut
  const { data: averageViews } = useQuery({
    queryKey: ["average-views", contentType, days],
    queryFn: async () => {
      const topContent = await getTopViewed(contentType, 100);
      const values = Object.values(topContent);
      return values.reduce((sum, views) => sum + views, 0) / values.length;
    },
    staleTime: 3600000, // 1 oră
  });

  // Performance score calculation
  const performanceScore =
    viewStats && averageViews
      ? Math.min(100, (viewStats.viewCount / averageViews) * 100)
      : 0;

  const performanceLevel =
    performanceScore >= 200
      ? "Exceptional"
      : performanceScore >= 150
      ? "Excellent"
      : performanceScore >= 100
      ? "Above Average"
      : performanceScore >= 50
      ? "Average"
      : "Below Average";

  return {
    viewStats,
    averageViews,
    performanceScore,
    performanceLevel,
    canTrackPerformance: !!user,
  };
}

// Hook pentru export de date (admin)
export function useAnalyticsExport() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const exportData = async (
    type: "analytics" | "user-stats" | "trending",
    days: number = 30,
    format: "json" | "csv" = "json"
  ) => {
    if (!isAdmin) throw new Error("Unauthorized");

    let data: unknown;
    let filename: string;

    switch (type) {
      case "analytics":
        data = await getAnalytics(days);
        filename = `analytics_${days}days_${
          new Date().toISOString().split("T")[0]
        }`;
        break;
      case "trending":
        data = await getTrendingContent(undefined, 24, 50);
        filename = `trending_${new Date().toISOString().split("T")[0]}`;
        break;
      default:
        throw new Error("Invalid export type");
    }

    // Convert și download
    if (format === "json") {
      const jsonData = JSON.stringify(data, null, 2);
      downloadFile(jsonData, `${filename}.json`, "application/json");
    } else if (format === "csv") {
      // Pentru CSV, convertim datele la un format simplu
      const csvData = convertToCSV(data);
      downloadFile(csvData, `${filename}.csv`, "text/csv");
    }
  };

  return {
    exportData,
    isAuthorized: isAdmin,
  };
}

// Helper functions
function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function convertToCSV(data: unknown): string {
  if (Array.isArray(data)) {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0] as Record<string, unknown>);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = (row as Record<string, unknown>)[header];
            return typeof value === "string" ? `"${value}"` : value;
          })
          .join(",")
      ),
    ];
    return csvRows.join("\n");
  }

  // Pentru obiecte simple
  const entries = Object.entries(data as Record<string, unknown>);
  return entries.map(([key, value]) => `"${key}","${value}"`).join("\n");
}

// Hook pentru monitoring in timp real
export function useViewMonitoring(enabled: boolean = false) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  // Live metrics
  const { data: liveMetrics, refetch } = useQuery({
    queryKey: ["live-metrics"],
    queryFn: async () => {
      const [totalToday, trending, topKDoms, topPosts] = await Promise.all([
        getTotalViews(1),
        getTrendingContent(undefined, 1, 5),
        getTopViewed("KDom", 5),
        getTopViewed("Post", 5),
      ]);

      return {
        totalToday,
        trending,
        topKDoms,
        topPosts,
        timestamp: new Date().toISOString(),
      };
    },
    enabled: enabled && isAdmin,
    refetchInterval: 30000, // 30 secunde
  });

  return {
    liveMetrics,
    isEnabled: enabled && isAdmin,
    refresh: refetch,
  };
}

// Hook pentru alerts și notifications
export function useViewAlerts() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  const { data: alerts = [] } = useQuery({
    queryKey: ["view-alerts"],
    queryFn: async () => {
      if (!isAdmin) return [];

      const trending = await getTrendingContent(undefined, 1, 10);
      const alerts = [];

      // Alert pentru conținut viral
      const viralContent = trending.filter((item) => item.trendingScore > 50);
      if (viralContent.length > 0) {
        alerts.push({
          type: "viral",
          message: `${viralContent.length} content items are trending heavily`,
          severity: "info",
          data: viralContent,
        });
      }

      // Alert pentru trafic neobișnuit
      const totalToday = await getTotalViews(1);
      const averageDaily = (await getTotalViews(30)) / 30;

      if (totalToday > averageDaily * 2) {
        alerts.push({
          type: "traffic_spike",
          message: `Today's traffic is ${Math.round(
            (totalToday / averageDaily) * 100
          )}% above average`,
          severity: "warning",
          data: { today: totalToday, average: averageDaily },
        });
      }

      return alerts;
    },
    enabled: isAdmin,
    refetchInterval: 300000, // 5 minute
  });

  return {
    alerts,
    hasAlerts: alerts.length > 0,
    isAuthorized: isAdmin,
  };
}
