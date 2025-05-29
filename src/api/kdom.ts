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
} from "../types/KDom";

// CRUD
export const createKDom = async (data: KDomCreateDto) => {
  // The issue is likely with the Content-Type header or data serialization
  const response = await API.post("/kdoms", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const editKDom = async (id: string, data: KDomEditDto) => {
  await API.put(`/kdoms/${id}`, data);
};

export const updateMetadata = async (
  id: string,
  data: KDomUpdateMetadataDto
) => {
  await API.put(`/kdoms/${id}/metadata`, data);
};

// Approve/Reject
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

// Read
export const getKDomById = async (id: string): Promise<KDomReadDto> => {
  const res = await API.get(`/kdoms/${id}`);
  return res.data;
};

export const getEditHistory = async (
  id: string
): Promise<KDomEditReadDto[]> => {
  const res = await API.get(`/kdoms/${id}/edits`);
  return res.data;
};

export const getMetadataHistory = async (
  id: string
): Promise<KDomMetadataEditReadDto[]> => {
  const res = await API.get(`/kdoms/${id}/metadata-history`);
  return res.data;
};

// Relations
export const getParentKDom = async (
  id: string
): Promise<KDomTagSearchResultDto> => {
  const res = await API.get(`/kdoms/${id}/parent`);
  return res.data;
};

export const getChildKDoms = async (id: string): Promise<KDomDisplayDto[]> => {
  const res = await API.get(`/kdoms/${id}/children`);
  return res.data;
};

export const getRelatedKDoms = async (
  id: string
): Promise<KDomDisplayDto[]> => {
  const res = await API.get(`/kdoms/${id}/related`);
  return res.data;
};

// SubKDom
export const createSubKDom = async (id: string, data: KDomSubCreateDto) => {
  await API.post(`/kdoms/${id}/sub`, data);
};

// Follow
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
  q: string
): Promise<KDomTagSearchResultDto[]> => {
  const res = await API.get(`/kdoms/search-tag-slug`, { params: { q } });
  return res.data;
};

export const getTrendingKdoms = async (): Promise<KDomTrendingDto[]> => {
  const res = await API.get("/kdoms/trending");
  return res.data;
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
