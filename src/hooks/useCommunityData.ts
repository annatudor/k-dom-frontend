// src/hooks/useCommunityData.ts - FIXED pentru rollback
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

  // ✅ Hook pentru K-Dom-urile urmărite - funcționează
  const {
    data: followedKdoms = [],
    isLoading: isLoadingFollowed,
    error: followedError,
  } = useQuery({
    queryKey: ["followed-kdoms"],
    queryFn: getFollowedKdoms,
    enabled: isAuthenticated,
    staleTime: 300000, // 5 minute
    retry: false, // Nu reîncerca dacă endpoint-ul nu există
  });

  // ✅ Hook pentru K-Dom-urile sugerate - cu fallback la trending
  const {
    data: suggestedKdoms = [],
    isLoading: isLoadingSuggested,
    error: suggestedError,
  } = useQuery({
    queryKey: ["suggested-kdoms"],
    queryFn: async () => {
      if (!isAuthenticated) return [];

      try {
        // Încearcă endpoint-ul de suggested
        return await getSuggestedKdoms();
      } catch (error) {
        console.warn(
          "Suggested K-Doms endpoint not available, using trending as fallback"
        );

        try {
          // Fallback la trending K-Doms
          const trending = await getTrendingKdoms(30);
          return trending.slice(0, 8).map((kdom) => ({
            id: kdom.id,
            title: kdom.title,
            slug: kdom.slug,
            description: `Trending with ${kdom.TotalScore} points`,
          }));
        } catch (trendingError) {
          console.error("Both suggested and trending failed:", trendingError);
          return [];
        }
      }
    },
    enabled: isAuthenticated,
    staleTime: 600000, // 10 minute
    retry: false,
  });

  // ✅ Hook pentru K-Dom-urile trending - funcționează
  const {
    data: trendingKdoms = [],
    isLoading: isLoadingTrending,
    error: trendingError,
  } = useQuery({
    queryKey: ["trending-kdoms"],
    queryFn: () => getTrendingKdoms(7),
    staleTime: 300000, // 5 minute
    retry: false,
  });

  // ✅ Hook pentru feed-ul de postări - cu fallback logic robust
  const {
    data: posts = [],
    isLoading: isLoadingFeed,
    error: feedError,
    refetch: refetchFeed,
  } = useQuery({
    queryKey: ["community-feed", isAuthenticated],
    queryFn: async () => {
      try {
        if (isAuthenticated) {
          console.log("Fetching authenticated user feed...");
          const feed = await getFeed();

          // Dacă feed-ul personal este gol, returnează feed-ul public
          if (feed.length === 0) {
            console.log("Personal feed empty, falling back to public feed...");
            return await getPublicFeed();
          }

          return feed;
        } else {
          console.log("Fetching public feed for guest...");
          return await getPublicFeed();
        }
      } catch (error) {
        console.error("Feed fetch failed:", error);

        // Ultimul fallback - încearcă să obții măcar feed-ul public
        try {
          console.log("Attempting final fallback to public feed...");
          return await getPublicFeed();
        } catch (finalError) {
          console.error("All feed options failed:", finalError);
          return [];
        }
      }
    },
    staleTime: 60000, // 1 minut
    retry: 1, // Încearcă o dată în plus
  });

  // ✅ Calculează state-uri derivate
  const hasData =
    posts.length > 0 ||
    followedKdoms.length > 0 ||
    suggestedKdoms.length > 0 ||
    trendingKdoms.length > 0;
  const hasErrors = !!(
    feedError ||
    followedError ||
    suggestedError ||
    trendingError
  );
  const isCompletelyLoading =
    isLoadingFeed &&
    isLoadingFollowed &&
    isLoadingSuggested &&
    isLoadingTrending;

  return {
    // ✅ Data
    followedKdoms,
    suggestedKdoms,
    trendingKdoms,
    posts,
    user,
    isAuthenticated,

    // ✅ Loading states
    isLoadingFollowed,
    isLoadingSuggested,
    isLoadingTrending,
    isLoadingFeed,
    isLoading: isCompletelyLoading,

    // ✅ Error states
    feedError,
    followedError,
    suggestedError,
    trendingError,
    hasErrors,

    // ✅ Computed states
    hasData,
    hasEmptyFeed: posts.length === 0 && !isLoadingFeed,
    canShowSuggestions: isAuthenticated && suggestedKdoms.length > 0,
    canShowFollowed: isAuthenticated && followedKdoms.length > 0,
    showTrending: trendingKdoms.length > 0,

    // ✅ Actions
    refetchFeed,

    // ✅ Debug info (remove in production)
    debugInfo: {
      endpoints: {
        followedAvailable: !followedError,
        suggestedAvailable: !suggestedError,
        trendingAvailable: !trendingError,
        feedAvailable: !feedError,
      },
      counts: {
        posts: posts.length,
        followed: followedKdoms.length,
        suggested: suggestedKdoms.length,
        trending: trendingKdoms.length,
      },
    },
  };
}
