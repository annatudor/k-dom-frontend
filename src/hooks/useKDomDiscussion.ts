// src/hooks/useKDomDiscussion.ts - FIXED VERSION
import { useState, useCallback, useEffect, useMemo } from "react";
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

  console.log(
    `[useKDomDiscussion] Called with slug: "${slug}", filter:`,
    filter
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

  // ✅ DEBUG: Log detailed data structure
  useEffect(() => {
    if (discussion) {
      console.log(`[useKDomDiscussion] Full discussion data:`, discussion);
      console.log(`[useKDomDiscussion] discussion.kdom:`, discussion.kdom);
      console.log(`[useKDomDiscussion] discussion.posts:`, discussion.posts);
      console.log(`[useKDomDiscussion] discussion.stats:`, discussion.stats);
    }
  }, [discussion]);

  const changePage = useCallback((newPage: number) => {
    console.log(`[useKDomDiscussion] Changing page to: ${newPage}`);
    setFilter((prev) => ({ ...prev, page: newPage }));
  }, []);

  const changePageSize = useCallback((newPageSize: number) => {
    console.log(`[useKDomDiscussion] Changing page size to: ${newPageSize}`);
    setFilter((prev) => ({ ...prev, page: 1, pageSize: newPageSize }));
  }, []);

  // ✅ FIX: Extrage datele cu verificări defensive
  const kdom = discussion?.kdom || null;
  const posts = useMemo(
    () => discussion?.posts?.items || [],
    [discussion?.posts?.items]
  );
  const pagination = discussion?.posts || null;
  const stats = discussion?.stats || null;

  // ✅ DEBUG: Log extracted values
  useEffect(() => {
    console.log(`[useKDomDiscussion] Extracted values:`, {
      kdom,
      posts: posts.length,
      pagination: !!pagination,
      stats: !!stats,
    });
  }, [kdom, posts, pagination, stats]);

  return {
    discussion,
    isLoading,
    error,
    refetch,
    filter,
    changePage,
    changePageSize,
    // ✅ FIX: Returnează valorile extrase explicit
    posts,
    pagination,
    kdom,
    stats,
  };
}

// Hook pentru statistici rapide
export function useKDomDiscussionStats(slug: string) {
  console.log(`[useKDomDiscussionStats] Called with slug: "${slug}"`);

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

  console.log(`[useKDomDiscussionStats] Result:`, { stats, isLoading, error });

  return { stats, isLoading, error };
}

// Hook pentru verificarea dacă are discussion activ
export function useHasActiveDiscussion(slug: string) {
  console.log(`[useHasActiveDiscussion] Called with slug: "${slug}"`);

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

  console.log(`[useHasActiveDiscussion] Result:`, { result, isLoading, error });

  return {
    hasActiveDiscussion: result?.hasActiveDiscussion || false,
    isLoading,
    error,
  };
}

// Hook pentru căutare în discussion
export function useKDomDiscussionSearch(slug: string) {
  const toast = useToast();

  console.log(`[useKDomDiscussionSearch] Called with slug: "${slug}"`);

  const searchMutation = useMutation({
    mutationFn: (params: KDomDiscussionSearchDto) => {
      console.log(`[useKDomDiscussionSearch] Searching with params:`, params);
      return searchKDomDiscussion(slug, params);
    },
    onSuccess: (data) => {
      console.log(`[useKDomDiscussionSearch] Search successful:`, data);
    },
    onError: (error) => {
      console.error(`[useKDomDiscussionSearch] Search failed:`, error);
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
  console.log(`[useKDomWithDiscussion] Called with slug: "${slug}"`);

  const { hasActiveDiscussion } = useHasActiveDiscussion(slug);
  const { stats } = useKDomDiscussionStats(slug);

  console.log(`[useKDomWithDiscussion] Combined result:`, {
    hasActiveDiscussion,
    stats,
  });

  return {
    hasActiveDiscussion,
    discussionStats: stats,
    // Quick stats pentru afișarea în sidebar sau header
    totalPosts: stats?.totalPosts || 0,
    totalComments: stats?.totalComments || 0,
    uniquePosters: stats?.uniquePosterCount || 0,
  };
}
