// src/types/Comment.ts
export type CommentTargetType = "Post" | "KDom";

export interface CommentCreateDto {
  targetType: CommentTargetType;
  targetId: string;
  text: string;
  parentCommentId?: string;
}

export interface CommentEditDto {
  text: string;
}

export interface CommentReadDto {
  id: string;
  targetType: CommentTargetType;
  targetId: string;
  userId: number;
  username: string;
  text: string;
  parentCommentId?: string;
  createdAt: string;
  isEdited: boolean;
  editedAt?: string;
  likeCount?: number;
  isLiked?: boolean;
}

export interface CommentLikeResponseDto {
  liked: boolean;
  likeCount: number;
}

// Additional interfaces for enhanced functionality
export interface CommentFilters {
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest" | "popular";
  search?: string;
  parentId?: string;
}

export interface CommentResponse {
  data: CommentReadDto[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface CommentStats {
  total: number;
  mainComments: number;
  replies: number;
  uniqueUsers: number;
}
