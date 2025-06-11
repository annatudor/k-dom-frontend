// src/hooks/useHomePageData.ts - Updated version
import { useQuery } from "@tanstack/react-query";
import { getHomepageData, getPlatformStats } from "@/api/statistics";
import type { Hub } from "@/types/KDom";

interface CategoryStats {
  hub: Hub;
  count: number;
  featured: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
}

interface PlatformStats {
  totalKDoms: number;
  totalCategories: number;
  activeCollaborators: number;
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
}

interface HomepageData {
  featuredKDoms: Array<{
    id: string;
    title: string;
    slug: string;
    score: number;
    hub: string;
  }>;
  categoryStats: CategoryStats[];
  platformStats: PlatformStats;
}

interface DebugInfo {
  hasHomepageData: boolean;
  hasFallbackStats: boolean;
  homepageError?: string;
  fallbackError?: string;
}

export const useHomepageData = () => {
  // Încearcă să obții toate datele printr-un singur request
  const {
    data: homepageData,
    isLoading: isLoadingAll,
    error: homepageError,
  } = useQuery({
    queryKey: ["homepage-data"],
    queryFn: getHomepageData,
    staleTime: 5 * 60 * 1000, // 5 minute cache
    retry: 1, // Doar o reîncercare
  });

  // Fallback: dacă endpoint-ul pentru toate datele nu funcționează,
  // obține măcar statisticile platformei
  const {
    data: fallbackStats,
    isLoading: isLoadingFallback,
    error: fallbackError,
  } = useQuery({
    queryKey: ["platform-stats-fallback"],
    queryFn: getPlatformStats,
    enabled: !!homepageError, // Activează doar dacă primul query a eșuat
    staleTime: 5 * 60 * 1000,
  });

  // Determină ce date să returnezi
  const isLoading = isLoadingAll || (!!homepageError && isLoadingFallback);
  const error = homepageError && fallbackError;

  let data: HomepageData | null = null;

  if (homepageData) {
    // Datele complete sunt disponibile
    data = {
      featuredKDoms: homepageData.featuredKDoms.map((kdom) => ({
        id: kdom.id,
        title: kdom.title,
        slug: kdom.slug,
        score: kdom.score,
        hub: kdom.hub,
      })),
      categoryStats: homepageData.categoryStats.map((category) => ({
        hub: category.hub as Hub, // Explicit cast to Hub type
        count: category.count,
        featured: category.featured,
      })),
      platformStats: homepageData.platformStats,
    };
  } else if (fallbackStats) {
    // Doar statisticile de bază sunt disponibile
    console.log("Using fallback stats:", fallbackStats);
    data = {
      featuredKDoms: [],
      categoryStats: [],
      platformStats: fallbackStats,
    };
  }

  return {
    data,
    isLoading,
    error,
    // Debug info with proper typing
    debugInfo: {
      hasHomepageData: !!homepageData,
      hasFallbackStats: !!fallbackStats,
      homepageError: homepageError?.message,
      fallbackError: fallbackError?.message,
    } as DebugInfo,
  };
};
