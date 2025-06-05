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
  KDomStatsDto,
  SimilarSuggestionsDto,
  ValidateTitleResponse,
  Language,
  Hub,
  KDomTheme,
  KDomSearchResult,
  KDomPermissions,
} from "../types/KDom";

// ========================================
// CRUD OPERATIONS
// ========================================

export const createKDom = async (data: KDomCreateDto) => {
  const response = await API.post("/kdoms", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

// ✅ ACTUALIZAT - Slug-based editing (primary method)
export const editKDomBySlug = async (slug: string, data: KDomEditDto) => {
  await API.put(`/kdoms/slug/${slug}`, data);
};

// Keep backward compatibility with ID-based editing
export const editKDom = async (id: string, data: KDomEditDto) => {
  await API.put(`/kdoms/${id}`, data);
};

// ✅ ACTUALIZAT - Slug-based metadata updates (primary method)
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

// ========================================
// READ OPERATIONS
// ========================================

export const getKDomById = async (id: string): Promise<KDomReadDto> => {
  const res = await API.get(`/kdoms/${id}`);
  return res.data;
};

export const getKDomBySlug = async (slug: string): Promise<KDomReadDto> => {
  const res = await API.get(`/kdoms/slug/${slug}`);
  return res.data;
};

// ✅ NOU - Pentru obținerea permisiunilor utilizatorului
export const getUserPermissions = async (
  id: string
): Promise<KDomPermissions> => {
  const res = await API.get(`/kdoms/${id}/permissions`);
  return res.data;
};

export const getUserPermissionsBySlug = async (
  slug: string
): Promise<KDomPermissions> => {
  const res = await API.get(`/kdoms/slug/${slug}/permissions`);
  return res.data;
};

// ✅ NOU - Pentru statistici K-DOM
export const getKDomStats = async (id: string): Promise<KDomStatsDto> => {
  const res = await API.get(`/kdoms/${id}/stats`);
  return res.data;
};

// ========================================
// EDIT HISTORY
// ========================================

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

// ========================================
// METADATA HISTORY
// ========================================

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

// ========================================
// RELATIONS
// ========================================

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

// ========================================
// SUB K-DOM
// ========================================

export const createSubKDom = async (id: string, data: KDomSubCreateDto) => {
  await API.post(`/kdoms/${id}/sub`, data);
};

// ✅ NOU - Verifică dacă poate crea sub-pagini
export const canCreateSubKDom = async (
  parentId: string
): Promise<{
  canCreate: boolean;
  message: string;
}> => {
  const res = await API.get(`/kdoms/${parentId}/can-create-sub`);
  return res.data;
};

// ========================================
// FOLLOW OPERATIONS
// ========================================

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

// ========================================
// VALIDATION & UTILITY
// ========================================

// ✅ ACTUALIZAT - Validare îmbunătățită pentru titlu
export const validateKDomTitle = async (
  title: string
): Promise<ValidateTitleResponse> => {
  const res = await API.post("/kdoms/validate-title", { title });
  return res.data;
};

export const checkKDomTitleExists = async (
  title: string
): Promise<{ exists: boolean; suggestions: string[] }> => {
  const res = await API.get(`/kdoms/check`, { params: { title } });
  return res.data;
};

// ✅ NOU - Pentru sugestii similare
export const getSimilarSuggestions = async (
  title: string
): Promise<SimilarSuggestionsDto> => {
  const res = await API.get(`/kdoms/suggest-similar`, { params: { title } });
  return res.data;
};

export const searchKDomTags = async (
  query: string
): Promise<KDomTagSearchResultDto[]> => {
  const res = await API.get(`/kdoms/search-tag-slug`, {
    params: { query },
  });
  return res.data;
};

// ========================================
// TRENDING & SUGGESTIONS
// ========================================

export const getTrendingKdoms = async (
  days: number = 7
): Promise<KDomTrendingDto[]> => {
  const res = await API.get(`/kdoms/trending?days=${days}`);
  return res.data;
};

export const getTrendingKdomsForGuests = async (
  limit: number = 15
): Promise<KDomTagSearchResultDto[]> => {
  try {
    const trendingKdoms = await getTrendingKdoms(7);

    const transformed = trendingKdoms.slice(0, limit).map((kdom) => ({
      id: kdom.id,
      title: kdom.title,
      slug: kdom.slug,
      description: `Trending with ${kdom.TotalScore} points`,
    }));

    return transformed;
  } catch (error) {
    console.error("Error fetching trending K-Doms for guests:", error);
    return [];
  }
};

export const getSuggestedKdoms = async (): Promise<
  KDomTagSearchResultDto[]
> => {
  const res = await API.get("/kdoms/suggested");
  return res.data;
};

// ========================================
// ENUM VALUES
// ========================================

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

// ========================================
// SEARCH
// ========================================

export const searchKDomsForParent = async (
  query: string
): Promise<KDomSearchResult[]> => {
  if (!query.trim()) return [];

  const res = await API.get(`/kdoms/search-tag-slug`, {
    params: { query: query.trim() },
  });

  return res.data.map((item: KDomSearchResult) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description || "Unknown",
  }));
};

// ========================================
// MODERATION (pentru administratori)
// ========================================

export const getPendingKdoms = async (): Promise<KDomDisplayDto[]> => {
  const res = await API.get("/kdoms/pending");
  return res.data;
};

export const approveKDom = async (id: string) => {
  await API.post(`/kdoms/${id}/approve`);
};

export const rejectKDom = async (id: string, data: KDomRejectDto) => {
  await API.post(`/kdoms/${id}/reject`, data);
};

// ========================================
// DISCUSSION (pentru pagina de discuții)
// ========================================

export const getKDomDiscussion = async (
  slug: string,
  filter?: {
    page?: number;
    pageSize?: number;
  }
) => {
  const params = {
    page: filter?.page || 1,
    pageSize: filter?.pageSize || 20,
  };

  const res = await API.get(`/kdoms/slug/${slug}/discussion`, { params });
  return res.data;
};

export const getKDomDiscussionStats = async (slug: string) => {
  const res = await API.get(`/kdoms/slug/${slug}/discussion/stats`);
  return res.data;
};

export const hasActiveDiscussion = async (
  slug: string
): Promise<{
  slug: string;
  hasActiveDiscussion: boolean;
  message: string;
}> => {
  const res = await API.get(`/kdoms/slug/${slug}/has-discussion`);
  return res.data;
};

// ========================================
// HELPER FUNCTIONS
// ========================================

export const formatKDomStatus = (status: string): string => {
  switch (status) {
    case "Pending":
      return "Pending Moderation";
    case "Approved":
      return "Live";
    case "Rejected":
      return "Rejected";
    case "Deleted":
      return "Deleted";
    default:
      return status;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Approved":
      return "green";
    case "Pending":
      return "yellow";
    case "Rejected":
      return "red";
    case "Deleted":
      return "gray";
    default:
      return "gray";
  }
};
