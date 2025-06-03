// src/api/kdomDiscussion.ts
import API from "./axios";
import type {
  KDomDiscussionReadDto,
  KDomDiscussionStatsDto,
  KDomDiscussionFilterDto,
  KDomDiscussionSearchDto,
} from "../types/KDomDiscussion";

/**
 * Obține discussion-ul complet pentru un K-Dom
 */
export const getKDomDiscussion = async (
  slug: string,
  filter: KDomDiscussionFilterDto = { page: 1, pageSize: 20 }
): Promise<KDomDiscussionReadDto> => {
  const response = await API.get(`/kdoms/slug/${slug}/discussion`, {
    params: filter,
  });
  return response.data;
};

/**
 * Obține doar statisticile discussion-ului
 */
export const getKDomDiscussionStats = async (
  slug: string
): Promise<KDomDiscussionStatsDto> => {
  const response = await API.get(`/kdoms/slug/${slug}/discussion/stats`);
  return response.data;
};

/**
 * Verifică dacă un K-Dom are discussion activ
 */
export const hasActiveDiscussion = async (
  slug: string
): Promise<{ hasActiveDiscussion: boolean; message: string }> => {
  const response = await API.get(`/kdoms/slug/${slug}/has-discussion`);
  return response.data;
};

/**
 * Caută în discussion-ul unui K-Dom
 */
export const searchKDomDiscussion = async (
  slug: string,
  searchParams: KDomDiscussionSearchDto
): Promise<KDomDiscussionReadDto> => {
  const response = await API.get(`/kdoms/slug/${slug}/discussion/search`, {
    params: searchParams,
  });
  return response.data.results;
};

/**
 * Obține postările unui K-Dom (pentru backward compatibility)
 */
export const getKDomPosts = async (
  slug: string,
  page: number = 1,
  pageSize: number = 20
): Promise<{
  kdom: {
    id: string;
    title: string;
    slug: string;
    description: string;
  };
  posts: unknown;
  pagination: Record<string, unknown>;
}> => {
  const response = await API.get(`/kdoms/slug/${slug}/posts`, {
    params: { page, pageSize },
  });
  return response.data;
};
