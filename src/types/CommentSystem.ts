// src/types/CommentSystem.ts

export type CommentTargetType = "Post" | "KDom";

export type CommentSortOption = "newest" | "oldest" | "mostLiked";

export interface BaseComment {
  id: string;
  targetType: CommentTargetType;
  targetId: string;
  userId: number;
  username: string;
  userAvatarUrl: string;
  text: string;
  createdAt: string;
  isEdited: boolean;
  editedAt?: string;
  parentCommentId?: string | null;
}

export interface CommentWithLikes extends BaseComment {
  likes: number[];
  likeCount: number;
  isLikedByUser?: boolean;
}

export interface CommentWithReplies extends CommentWithLikes {
  replies?: CommentWithReplies[];
  replyCount?: number;
}

export interface CommentFormData {
  text: string;
  parentCommentId?: string | null;
}

export interface CommentCreateRequest {
  targetType: CommentTargetType;
  targetId: string;
  text: string;
  parentCommentId?: string;
}

export interface CommentEditRequest {
  text: string;
}

export interface CommentStats {
  totalComments: number;
  mainComments: number;
  totalReplies: number;
}

export interface CommentsConfig {
  allowReplies?: boolean;
  maxReplyDepth?: number;
  showLikes?: boolean;
  showEditTimestamp?: boolean;
  sortOptions?: CommentSortOption[];
  defaultSort?: CommentSortOption;
  enableMentions?: boolean;
  maxCommentLength?: number;
  placeholderText?: string;
}

export interface CommentPermissions {
  canComment: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canLike: boolean;
  canReply: boolean;
  canModerate: boolean;
}

export interface CommentContextType {
  comments: CommentWithReplies[];
  isLoading: boolean;
  error: string | null;
  stats: CommentStats;
  permissions: CommentPermissions;
  config: CommentsConfig;
  sortBy: CommentSortOption;
  setSortBy: (sort: CommentSortOption) => void;
  addComment: (data: CommentFormData) => Promise<void>;
  editComment: (commentId: string, text: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  toggleLike: (commentId: string) => Promise<void>;
  refresh: () => Promise<void>;
}
