// src/hooks/useHomepageData.ts
import { useQuery } from "@tanstack/react-query";
import { getTrendingKdoms, getHubs } from "@/api/kdom";
import { globalSearch } from "@/api/search";
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

export const useHomepageData = () => {
  // Get trending K-Doms pentru featured section
  const { data: trendingKDoms = [] } = useQuery({
    queryKey: ["trending-kdoms-homepage"],
    queryFn: () => getTrendingKdoms(30), // Ultimele 30 de zile
    staleTime: 10 * 60 * 1000, // 10 minute cache
  });

  // Get available hubs
  const { data: availableHubs = [] } = useQuery({
    queryKey: ["hubs-homepage"],
    queryFn: getHubs,
    staleTime: 30 * 60 * 1000, // 30 minute cache
  });

  // Get category stats for each hub
  const { data: categoryStats = [] } = useQuery({
    queryKey: ["category-stats-homepage"],
    queryFn: async (): Promise<CategoryStats[]> => {
      if (availableHubs.length === 0) return [];

      const stats = await Promise.all(
        availableHubs.map(async (hub) => {
          try {
            // Search for K-Doms in this category
            const searchResults = await globalSearch(hub);
            const hubKDoms = searchResults.kdoms || [];

            return {
              hub,
              count: hubKDoms.length,
              featured: hubKDoms.slice(0, 3), // Top 3 pentru preview
            };
          } catch (error) {
            console.error(`Failed to get stats for hub ${hub}:`, error);
            return {
              hub,
              count: 0,
              featured: [],
            };
          }
        })
      );

      return stats;
    },
    enabled: availableHubs.length > 0,
    staleTime: 15 * 60 * 1000, // 15 minute cache
  });

  // Calculate platform stats
  const platformStats: PlatformStats = {
    totalKDoms:
      trendingKDoms.length > 0
        ? categoryStats.reduce((sum, cat) => sum + cat.count, 0)
        : 0,
    totalCategories: availableHubs.length,
    activeCollaborators: Math.floor(trendingKDoms.length * 2.5), // Estimare bazată pe trending
  };

  // Transform trending K-Doms pentru featured section
  const featuredKDoms = trendingKDoms.slice(0, 6).map((kdom) => ({
    id: kdom.id,
    title: kdom.title,
    slug: kdom.slug,
    score: kdom.TotalScore,
    hub: "Music", // Default hub - în viitor poate fi adăugat în trending API
  }));

  const isLoading = !trendingKDoms || !availableHubs || !categoryStats;

  return {
    data: {
      featuredKDoms,
      categoryStats: categoryStats.filter((cat) => cat.count > 0), // Doar categoriile cu K-Doms
      platformStats,
    } as HomepageData,
    isLoading,
    error: null,
  };
};
