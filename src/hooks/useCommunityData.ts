// src/hooks/useCommunityData.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  getFollowedKdoms,
  getSuggestedKdoms,
  getTrendingKdoms,
} from "@/api/kdom";
import { getFeed, getPublicFeed } from "@/api/post";

export function useCommunityData() {
  const { isAuthenticated, user } = useAuth();

  // Hook pentru K-Dom-urile urmărite
  const { data: followedKdoms = [], isLoading: isLoadingFollowed } = useQuery({
    queryKey: ["followed-kdoms"],
    queryFn: getFollowedKdoms,
    enabled: isAuthenticated,
    staleTime: 300000, // 5 minute
  });

  // Hook pentru K-Dom-urile sugerate
  const { data: suggestedKdoms = [], isLoading: isLoadingSuggested } = useQuery(
    {
      queryKey: ["suggested-kdoms"],
      queryFn: getSuggestedKdoms,
      enabled: isAuthenticated,
      staleTime: 600000, // 10 minute
    }
  );

  // Hook pentru K-Dom-urile trending
  const { data: trendingKdoms = [], isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trending-kdoms"],
    queryFn: () => getTrendingKdoms(),
    staleTime: 300000, // 5 minute
  });

  // Hook pentru feed-ul de postări
  const {
    data: posts = [],
    isLoading: isLoadingFeed,
    refetch: refetchFeed,
  } = useQuery({
    queryKey: ["community-feed", isAuthenticated],
    queryFn: isAuthenticated ? getFeed : getPublicFeed,
    staleTime: 60000, // 1 minut
  });

  return {
    // Data
    followedKdoms,
    suggestedKdoms,
    trendingKdoms,
    posts,
    user,
    isAuthenticated,

    // Loading states
    isLoadingFollowed,
    isLoadingSuggested,
    isLoadingTrending,
    isLoadingFeed,
    isLoading:
      isLoadingFollowed ||
      isLoadingSuggested ||
      isLoadingTrending ||
      isLoadingFeed,

    // Actions
    refetchFeed,
  };
}
