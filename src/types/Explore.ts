// src/types/Explore.ts
import type { Hub, Language, KDomTheme } from "./KDom";
import type { PagedResult, PagedFilterDto } from "./Pagination";

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
  createdAt: string;
}

export interface ExploreFilterDto extends PagedFilterDto {
  hub?: string;
  search?: string;
  sortBy?: "newest" | "alphabetical";
}

// Export the PagedResult for easier importing
export type { PagedResult };
