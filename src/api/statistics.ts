// src/api/statistics.ts
import API from "./axios";
import type { Hub } from "../types/KDom";

export interface PlatformStatsDto {
  totalKDoms: number;
  totalCategories: number;
  activeCollaborators: number;
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
}

export interface FeaturedKDomDto {
  id: string;
  title: string;
  slug: string;
  followersCount: number;
}

export interface CategoryStatsDto {
  hub: string;
  count: number;
  featured: FeaturedKDomDto[];
}

export interface FeaturedKDomForHomepageDto {
  id: string;
  title: string;
  slug: string;
  score: number;
  hub: string;
  followersCount: number;
  postsCount: number;
  commentsCount: number;
}

export interface HomepageDataDto {
  platformStats: PlatformStatsDto;
  categoryStats: CategoryStatsDto[];
  featuredKDoms: FeaturedKDomForHomepageDto[];
}

/**
 * Obține statisticile generale ale platformei
 */
export const getPlatformStats = async (): Promise<PlatformStatsDto> => {
  const response = await API.get<PlatformStatsDto>("/statistics/platform");
  return response.data;
};

/**
 * Obține statisticile pe categorii
 */
export const getCategoryStats = async (): Promise<CategoryStatsDto[]> => {
  const response = await API.get<CategoryStatsDto[]>("/statistics/categories");
  return response.data;
};

/**
 * Obține K-Dom-urile featured
 */
export const getFeaturedKDoms = async (
  limit: number = 6
): Promise<FeaturedKDomForHomepageDto[]> => {
  const response = await API.get<FeaturedKDomForHomepageDto[]>(
    `/statistics/featured?limit=${limit}`
  );
  return response.data;
};

/**
 * Obține toate datele pentru homepage într-un singur request
 */
export const getHomepageData = async (): Promise<HomepageDataDto> => {
  const response = await API.get<HomepageDataDto>("/statistics/homepage");
  return response.data;
};

/**
 * Health check pentru serviciul de statistici
 */
export const checkStatisticsHealth = async (): Promise<{
  status: string;
  message: string;
}> => {
  const response = await API.get("/statistics/health");
  return response.data;
};
// Funcții helper pentru transformarea datelor
export const transformCategoryStats = (stats: CategoryStatsDto[]) => {
  return stats.map((category) => ({
    hub: category.hub as Hub, // Cast to Hub type
    count: category.count,
    featured: category.featured.map((featured) => ({
      id: featured.id,
      title: featured.title,
      slug: featured.slug,
    })),
  }));
};

export const transformFeaturedKDoms = (kdoms: FeaturedKDomForHomepageDto[]) => {
  return kdoms.map((kdom) => ({
    id: kdom.id,
    title: kdom.title,
    slug: kdom.slug,
    score: kdom.score,
    hub: kdom.hub,
  }));
};
