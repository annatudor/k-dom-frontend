// src/hooks/useKDomDiscussion.ts
import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import {
  getKDomDiscussion,
  getKDomDiscussionStats,
  hasActiveDiscussion,
  searchKDomDiscussion,
} from "@/api/kdomDiscussion";
import type {
  KDomDiscussionFilterDto,
  KDomDiscussionSearchDto,
} from "@/types/KDomDiscussion";

// Hook principal pentru discussion
export function useKDomDiscussion(
  slug: string,
  initialFilter?: KDomDiscussionFilterDto
) {
  const [filter, setFilter] = useState<KDomDiscussionFilterDto>(
    initialFilter || { page: 1, pageSize: 20 }
  );

  const {
    data: discussion,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["kdom-discussion", slug, filter],
    queryFn: () => getKDomDiscussion(slug, filter),
    enabled: !!slug,
    staleTime: 60000, // 1 minute
  });

  const changePage = useCallback((newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage }));
  }, []);

  const changePageSize = useCallback((newPageSize: number) => {
    setFilter((prev) => ({ ...prev, page: 1, pageSize: newPageSize }));
  }, []);

  return {
    discussion,
    isLoading,
    error,
    refetch,
    filter,
    changePage,
    changePageSize,
    // Helper computed properties
    posts: discussion?.posts.items || [],
    pagination: discussion?.posts || null,
    kdom: discussion?.kdom || null,
    stats: discussion?.stats || null,
  };
}

// Hook pentru statistici rapide
export function useKDomDiscussionStats(slug: string) {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kdom-discussion-stats", slug],
    queryFn: () => getKDomDiscussionStats(slug),
    enabled: !!slug,
    staleTime: 300000, // 5 minutes
  });

  return { stats, isLoading, error };
}

// Hook pentru verificarea dacă are discussion activ
export function useHasActiveDiscussion(slug: string) {
  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["has-active-discussion", slug],
    queryFn: () => hasActiveDiscussion(slug),
    enabled: !!slug,
    staleTime: 300000, // 5 minutes
  });

  return {
    hasActiveDiscussion: result?.hasActiveDiscussion || false,
    isLoading,
    error,
  };
}

// Hook pentru căutare în discussion
export function useKDomDiscussionSearch(slug: string) {
  const toast = useToast();

  const searchMutation = useMutation({
    mutationFn: (params: KDomDiscussionSearchDto) =>
      searchKDomDiscussion(slug, params),
    onError: () => {
      toast({
        title: "Search failed",
        description: "Failed to search discussions. Please try again.",
        status: "error",
        duration: 3000,
      });
    },
  });

  const search = useCallback(
    (params: KDomDiscussionSearchDto) => {
      return searchMutation.mutate(params);
    },
    [searchMutation]
  );

  return {
    search,
    searchResults: searchMutation.data,
    isSearching: searchMutation.isPending,
    searchError: searchMutation.error,
    clearSearch: () => searchMutation.reset(),
  };
}

// Hook pentru integrarea cu pagina K-Dom-ului
export function useKDomWithDiscussion(slug: string) {
  const { hasActiveDiscussion } = useHasActiveDiscussion(slug);
  const { stats } = useKDomDiscussionStats(slug);

  return {
    hasActiveDiscussion,
    discussionStats: stats,
    // Quick stats pentru afișarea în sidebar sau header
    totalPosts: stats?.totalPosts || 0,
    totalComments: stats?.totalComments || 0,
    uniquePosters: stats?.uniquePosterCount || 0,
  };
}
