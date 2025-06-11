// src/api/explore.ts
import API from "./axios";
import type { Hub, Language, KDomTheme } from "../types/KDom";

export interface ExploreKDomDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  hub: Hub;
  language: Language;
  theme: KDomTheme;
  isForKids: boolean;
  authorUsername: string;
  followersCount: number;
  postsCount: number;
  commentsCount: number;
  createdAt: string;
  lastActivity?: string;
}

export interface ExploreFilters {
  hub?: Hub;
  language?: Language;
  theme?: KDomTheme;
  isForKids?: boolean;
  search?: string;
  sortBy?: "newest" | "oldest" | "popular" | "trending" | "alphabetical";
  page?: number;
  pageSize?: number;
}

export interface ExploreResponse {
  kdoms: ExploreKDomDto[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  filters: ExploreFilters;
  facets: {
    hubCounts: Record<string, number>;
    languageCounts: Record<string, number>;
    themeCounts: Record<string, number>;
    totalKidsContent: number;
  };
}

export interface TrendingKDomsResponse {
  kdoms: Array<{
    id: string;
    title: string;
    slug: string;
    postScore: number;
    commentScore: number;
    followScore: number;
    editScore: number;
    totalScore: number;
  }>;
}

/**
 * Explorează K-Dom-urile cu filtre și paginare
 */
export const exploreKDoms = async (
  filters: ExploreFilters = {}
): Promise<ExploreResponse> => {
  const params = new URLSearchParams();

  // Adaugă filtrele ca parametri de query
  if (filters.hub) params.append("hub", filters.hub);
  if (filters.language) params.append("language", filters.language);
  if (filters.theme) params.append("theme", filters.theme);
  if (filters.isForKids !== undefined)
    params.append("isForKids", filters.isForKids.toString());
  if (filters.search) params.append("search", filters.search);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.pageSize) params.append("pageSize", filters.pageSize.toString());

  const response = await API.get<ExploreResponse>(
    `/explore?${params.toString()}`
  );
  return response.data;
};

/**
 * Obține K-Dom-urile trending
 */
export const getTrendingKDomsForExplore = async (
  days: number = 7
): Promise<TrendingKDomsResponse> => {
  const response = await API.get<TrendingKDomsResponse>(
    `/kdoms/trending?days=${days}`
  );
  return response.data;
};

/**
 * Obține sugestii de căutare
 */
export const getSearchSuggestions = async (
  query: string
): Promise<{ suggestions: string[] }> => {
  if (!query.trim()) return { suggestions: [] };

  const response = await API.get(
    `/explore/suggestions?q=${encodeURIComponent(query)}`
  );
  return response.data;
};

/**
 * Obține filtrele disponibile pentru explore
 */
export const getExploreMetadata = async (): Promise<{
  hubs: Hub[];
  languages: Language[];
  themes: KDomTheme[];
}> => {
  const [hubs, languages, themes] = await Promise.all([
    API.get<Hub[]>("/kdoms/hubs"),
    API.get<Language[]>("/kdoms/languages"),
    API.get<KDomTheme[]>("/kdoms/themes"),
  ]);

  return {
    hubs: hubs.data,
    languages: languages.data,
    themes: themes.data,
  };
};
