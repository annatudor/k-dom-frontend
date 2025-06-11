// src/hooks/useExplore.ts
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  exploreKDoms,
  getExploreMetadata,
  getTrendingKDomsForExplore,
} from "@/api/explore";
import type { ExploreFilters, ExploreResponse } from "@/api/explore";
import type { Hub, Language, KDomTheme } from "@/types/KDom";

export const useExplore = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL
  const [filters, setFilters] = useState<ExploreFilters>(() => ({
    hub: (searchParams.get("hub") as Hub) || undefined,
    language: (searchParams.get("language") as Language) || undefined,
    theme: (searchParams.get("theme") as KDomTheme) || undefined,
    isForKids: searchParams.get("isForKids")
      ? searchParams.get("isForKids") === "true"
      : undefined,
    search: searchParams.get("search") || undefined,
    sortBy:
      (searchParams.get("sortBy") as ExploreFilters["sortBy"]) || "popular",
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(searchParams.get("pageSize") || "20"),
  }));

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.hub) params.set("hub", filters.hub);
    if (filters.language) params.set("language", filters.language);
    if (filters.theme) params.set("theme", filters.theme);
    if (filters.isForKids !== undefined)
      params.set("isForKids", filters.isForKids.toString());
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy && filters.sortBy !== "popular")
      params.set("sortBy", filters.sortBy);
    if (filters.page && filters.page !== 1)
      params.set("page", filters.page.toString());
    if (filters.pageSize && filters.pageSize !== 20)
      params.set("pageSize", filters.pageSize.toString());

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Fetch explore data
  const {
    data: exploreData,
    isLoading: isLoadingExplore,
    error: exploreError,
    refetch: refetchExplore,
  } = useQuery({
    queryKey: ["explore", filters],
    queryFn: () => exploreKDoms(filters),
    keepPreviousData: true,
    staleTime: 30000, // 30 seconds
  });

  // Fetch metadata (hubs, languages, themes)
  const { data: metadata, isLoading: isLoadingMetadata } = useQuery({
    queryKey: ["explore-metadata"],
    queryFn: getExploreMetadata,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch trending K-Doms for sidebar
  const { data: trendingData, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trending-explore"],
    queryFn: () => getTrendingKDomsForExplore(7),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Filter management functions
  const updateFilter = (key: keyof ExploreFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const updateFilters = (newFilters: Partial<ExploreFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const clearFilters = () => {
    setFilters({
      sortBy: "popular",
      page: 1,
      pageSize: 20,
    });
  };

  const clearFilter = (key: keyof ExploreFilters) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return {
        ...newFilters,
        page: 1,
      };
    });
  };

  // Pagination functions
  const goToPage = (page: number) => {
    updateFilter("page", page);
  };

  const nextPage = () => {
    if (exploreData && exploreData.currentPage < exploreData.totalPages) {
      goToPage(exploreData.currentPage + 1);
    }
  };

  const prevPage = () => {
    if (exploreData && exploreData.currentPage > 1) {
      goToPage(exploreData.currentPage - 1);
    }
  };

  // Helper functions
  const hasActiveFilters = () => {
    return !!(
      filters.hub ||
      filters.language ||
      filters.theme ||
      filters.isForKids !== undefined ||
      filters.search
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.hub) count++;
    if (filters.language) count++;
    if (filters.theme) count++;
    if (filters.isForKids !== undefined) count++;
    if (filters.search) count++;
    return count;
  };

  return {
    // Data
    kdoms: exploreData?.kdoms || [],
    totalCount: exploreData?.totalCount || 0,
    totalPages: exploreData?.totalPages || 0,
    currentPage: exploreData?.currentPage || 1,
    pageSize: exploreData?.pageSize || 20,
    facets: exploreData?.facets,
    trendingKDoms: trendingData?.kdoms || [],

    // Metadata
    availableHubs: metadata?.hubs || [],
    availableLanguages: metadata?.languages || [],
    availableThemes: metadata?.themes || [],

    // Current filters
    filters,

    // Loading states
    isLoading: isLoadingExplore,
    isLoadingMetadata,
    isLoadingTrending,

    // Error states
    error: exploreError,

    // Filter management
    updateFilter,
    updateFilters,
    clearFilters,
    clearFilter,
    hasActiveFilters: hasActiveFilters(),
    activeFiltersCount: getActiveFiltersCount(),

    // Pagination
    goToPage,
    nextPage,
    prevPage,
    canGoNext: exploreData
      ? exploreData.currentPage < exploreData.totalPages
      : false,
    canGoPrev: exploreData ? exploreData.currentPage > 1 : false,

    // Actions
    refetch: refetchExplore,
  };
};
