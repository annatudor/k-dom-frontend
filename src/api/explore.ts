// src/api/explore.ts
import API from "./axios";
import type { ExploreFilterDto } from "../types/Explore";
import type { PagedResult, ExploreKDomDto } from "../types/Explore";

/**
 * Explorează K-Dom-urile cu filtre și paginare
 */
export const exploreKDoms = async (
  filters: Partial<ExploreFilterDto> = {}
): Promise<PagedResult<ExploreKDomDto>> => {
  const params = new URLSearchParams();

  // Adaugă filtrele ca parametri de query
  if (filters.hub) params.append("hub", filters.hub);
  if (filters.search) params.append("search", filters.search);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.pageSize) params.append("pageSize", filters.pageSize.toString());

  const response = await API.get<PagedResult<ExploreKDomDto>>(
    `/kdoms/explore?${params.toString()}`
  );
  return response.data;
};
