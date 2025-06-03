import API from "./axios";
import type {
  KDomCreateDto,
  KDomEditDto,
  KDomUpdateMetadataDto,
  KDomRejectDto,
  KDomReadDto,
  KDomEditReadDto,
  KDomMetadataEditReadDto,
  KDomDisplayDto,
  KDomTagSearchResultDto,
  KDomTrendingDto,
  KDomSubCreateDto,
  Language,
  Hub,
  KDomTheme,
  KDomSearchResult,
} from "../types/KDom";

// CRUD
export const createKDom = async (data: KDomCreateDto) => {
  const response = await API.post("/kdoms", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

// Updated to use slug-based editing (primary method)
export const editKDomBySlug = async (slug: string, data: KDomEditDto) => {
  await API.put(`/kdoms/slug/${slug}`, data);
};

// Keep backward compatibility with ID-based editing
export const editKDom = async (id: string, data: KDomEditDto) => {
  await API.put(`/kdoms/${id}`, data);
};

// Updated to use slug-based metadata updates (primary method)
export const updateMetadataBySlug = async (
  slug: string,
  data: KDomUpdateMetadataDto
) => {
  await API.put(`/kdoms/slug/${slug}/metadata`, data);
};

// Keep backward compatibility with ID-based metadata updates
export const updateMetadata = async (
  id: string,
  data: KDomUpdateMetadataDto
) => {
  await API.put(`/kdoms/${id}/metadata`, data);
};

// Approve/Reject (still ID-based for admin operations)
export const approveKDom = async (id: string) => {
  await API.post(`/kdoms/${id}/approve`);
};

export const rejectKDom = async (id: string, data: KDomRejectDto) => {
  await API.post(`/kdoms/${id}/reject`, data);
};

export const getPendingKdoms = async (): Promise<KDomDisplayDto[]> => {
  const res = await API.get("/kdoms/pending");
  return res.data;
};

// Read operations - supporting both ID and slug
export const getKDomById = async (id: string): Promise<KDomReadDto> => {
  const res = await API.get(`/kdoms/${id}`);
  return res.data;
};

export const getKDomBySlug = async (slug: string): Promise<KDomReadDto> => {
  const res = await API.get(`/kdoms/slug/${slug}`);
  return res.data;
};

// Edit History - supporting both slug and ID
export const getEditHistoryBySlug = async (
  slug: string
): Promise<KDomEditReadDto[]> => {
  const res = await API.get(`/kdoms/slug/${slug}/edits`);
  return res.data;
};

export const getEditHistory = async (
  id: string
): Promise<KDomEditReadDto[]> => {
  const res = await API.get(`/kdoms/${id}/edits`);
  return res.data;
};

// Metadata History - supporting both slug and ID
export const getMetadataHistoryBySlug = async (
  slug: string
): Promise<KDomMetadataEditReadDto[]> => {
  const res = await API.get(`/kdoms/slug/${slug}/metadata-history`);
  return res.data;
};

export const getMetadataHistory = async (
  id: string
): Promise<KDomMetadataEditReadDto[]> => {
  const res = await API.get(`/kdoms/${id}/metadata-history`);
  return res.data;
};

// Relations (can work with both ID and slug)
export const getParentKDom = async (
  idOrSlug: string
): Promise<KDomTagSearchResultDto | null> => {
  try {
    const res = await API.get(`/kdoms/${idOrSlug}/parent`);
    return res.data;
  } catch {
    return null;
  }
};

export const getChildKDoms = async (
  idOrSlug: string
): Promise<KDomDisplayDto[]> => {
  const res = await API.get(`/kdoms/${idOrSlug}/children`);
  return res.data;
};

export const getRelatedKDoms = async (
  idOrSlug: string
): Promise<KDomDisplayDto[]> => {
  const res = await API.get(`/kdoms/${idOrSlug}/related`);
  return res.data;
};

// SubKDom
export const createSubKDom = async (id: string, data: KDomSubCreateDto) => {
  await API.post(`/kdoms/${id}/sub`, data);
};

// Follow operations (using ID)
export const followKDom = async (id: string) => {
  await API.post(`/kdoms/${id}/follow`);
};

export const unfollowKDom = async (id: string) => {
  await API.delete(`/kdoms/${id}/unfollow`);
};

export const isKDomFollowed = async (id: string): Promise<boolean> => {
  const res = await API.get(`/kdoms/${id}/is-followed`);
  return res.data.isFollowed;
};

export const getFollowedKdoms = async (): Promise<KDomTagSearchResultDto[]> => {
  const res = await API.get("/kdoms/followed");
  return res.data;
};

export const getKDomFollowersCount = async (id: string): Promise<number> => {
  const res = await API.get(`/kdoms/${id}/followers/count`);
  return res.data.count;
};

// Utility
export const checkKDomTitleExists = async (
  title: string
): Promise<{ exists: boolean }> => {
  const res = await API.get(`/kdoms/check`, { params: { title } });
  return res.data;
};

export const searchKDomTags = async (
  query: string
): Promise<KDomTagSearchResultDto[]> => {
  const res = await API.get(`/kdoms/search-tag-slug`, {
    params: { query }, // Changed from 'q' to 'query' to match backend
  });
  return res.data;
};

export const getTrendingKdoms = async (
  days: number = 7
): Promise<KDomTrendingDto[]> => {
  const res = await API.get(`/kdoms/trending?days=${days}`);
  return res.data;
};

export const getTrendingKdomsForGuests = async (
  limit: number = 15
): Promise<KDomTagSearchResultDto[]> => {
  const res = await API.get(`/kdoms/trending-guest?limit=${limit}`);
  return res.data.kdoms;
};

export const getSuggestedKdoms = async (): Promise<
  KDomTagSearchResultDto[]
> => {
  const res = await API.get("/kdoms/suggested");
  return res.data;
};

export const getLanguages = async (): Promise<Language[]> => {
  const res = await API.get<Language[]>("/kdoms/languages");
  return res.data;
};

export const getHubs = async (): Promise<Hub[]> => {
  const res = await API.get<Hub[]>("/kdoms/hubs");
  return res.data;
};

export const getThemes = async (): Promise<KDomTheme[]> => {
  const res = await API.get<KDomTheme[]>("/kdoms/themes");
  return res.data;
};

export const searchKDomsForParent: (
  query: string
) => Promise<KDomSearchResult[]> = async (
  query: string
): Promise<KDomSearchResult[]> => {
  if (!query.trim()) return [];

  const res = await API.get(`/kdoms/search-tag-slug`, {
    params: { query: query.trim() }, // Changed from 'q' to 'query'
  });

  // Transform results to have the correct interface
  return res.data.map((item: KDomSearchResult) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description || "Unknown",
  }));
};
