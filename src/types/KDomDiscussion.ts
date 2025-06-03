// src/types/KDomDiscussion.ts
import type { PostReadDto } from "./Post";

export interface KDomBasicInfoDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  authorUsername: string;
  followersCount: number;
}

export interface KDomDiscussionStatsDto {
  totalPosts: number;
  totalComments: number;
  uniquePosterCount: number;
  lastPostDate?: string | null;
  firstPostDate?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface KDomDiscussionReadDto {
  kdom: KDomBasicInfoDto;
  posts: PagedResult<PostReadDto>;
  stats: KDomDiscussionStatsDto;
}

export interface KDomDiscussionFilterDto {
  page: number;
  pageSize: number;
}

export interface KDomDiscussionSearchDto extends KDomDiscussionFilterDto {
  contentQuery?: string;
  username?: string;
  sortBy?: "newest" | "oldest" | "most-liked";
  onlyLiked?: boolean;
  lastDays?: number;
}

// Types pentru componente UI
export interface DiscussionStatsProps {
  stats: KDomDiscussionStatsDto;
  variant?: "compact" | "detailed";
}

export interface DiscussionFilterValues {
  contentQuery?: string;
  username?: string;
  sortBy?: "newest" | "oldest" | "most-liked";
  onlyLiked?: boolean;
  lastDays?: number;
}

export interface DiscussionFiltersProps {
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onFilter: (filters: DiscussionFilterValues) => void;
  isLoading?: boolean;
}
