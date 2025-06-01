// src/api/comment.ts
import API from "./axios";
import type {
  CommentReadDto,
  CommentCreateDto,
  CommentEditDto,
  CommentLikeResponseDto,
  CommentTargetType,
  CommentFilters,
  CommentStats,
} from "../types/Comment";

/**
 * Get comments for a specific target (Post or KDom)
 */
export const getCommentsByTarget = async (
  targetType: CommentTargetType,
  targetId: string
): Promise<CommentReadDto[]> => {
  const res = await API.get("/comments", {
    params: { targetType, targetId },
  });
  return res.data;
};

/**
 * Get replies for a specific comment
 */
export const getCommentReplies = async (
  commentId: string
): Promise<CommentReadDto[]> => {
  const res = await API.get(`/comments/${commentId}/replies`);
  return res.data;
};

/**
 * Get a single comment by ID
 */
export const getCommentById = async (
  commentId: string
): Promise<CommentReadDto> => {
  const res = await API.get(`/comments/${commentId}`);
  return res.data;
};

/**
 * Create a new comment
 */
export const createComment = async (data: CommentCreateDto): Promise<void> => {
  await API.post("/comments", data);
};

/**
 * Edit an existing comment
 */
export const editComment = async (
  commentId: string,
  data: CommentEditDto
): Promise<void> => {
  await API.put(`/comments/${commentId}`, data);
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  await API.delete(`/comments/${commentId}`);
};

/**
 * Toggle like/unlike a comment
 */
export const toggleLikeComment = async (
  commentId: string
): Promise<CommentLikeResponseDto> => {
  const res = await API.post(`/comments/${commentId}/like`);
  return res.data;
};

/**
 * Report a comment
 */
export const reportComment = async (
  commentId: string,
  reason: string,
  description?: string
): Promise<void> => {
  await API.post(`/comments/${commentId}/report`, {
    reason,
    description,
  });
};

/**
 * Get comments with advanced filtering (if backend supports)
 */
export const getCommentsWithFilters = async (
  targetType: CommentTargetType,
  targetId: string,
  filters: CommentFilters = {}
): Promise<CommentReadDto[]> => {
  const params = {
    targetType,
    targetId,
    ...filters,
  };

  const res = await API.get("/comments", { params });
  return res.data;
};

/**
 * Search comments (if backend supports)
 */
export const searchComments = async (
  query: string,
  targetType?: CommentTargetType,
  targetId?: string,
  filters: CommentFilters = {}
): Promise<CommentReadDto[]> => {
  const params = {
    q: query,
    ...(targetType && { targetType }),
    ...(targetId && { targetId }),
    ...filters,
  };

  const res = await API.get("/comments/search", { params });
  return res.data;
};

/**
 * Get comment statistics for a target
 */
export const getCommentStats = async (
  targetType: CommentTargetType,
  targetId: string
): Promise<CommentStats> => {
  const res = await API.get("/comments/stats", {
    params: { targetType, targetId },
  });
  return res.data;
};

/**
 * Get comments by user
 */
export const getUserComments = async (
  userId: number,
  filters: CommentFilters = {}
): Promise<CommentReadDto[]> => {
  const params = {
    userId,
    ...filters,
  };

  const res = await API.get("/comments/user", { params });
  return res.data;
};

/**
 * Pin/unpin a comment (moderator only)
 */
export const pinComment = async (commentId: string): Promise<void> => {
  await API.post(`/comments/${commentId}/pin`);
};

/**
 * Lock/unlock comments for a target (moderator only)
 */
export const lockComments = async (
  targetType: CommentTargetType,
  targetId: string,
  locked: boolean = true
): Promise<void> => {
  await API.post("/comments/lock", {
    targetType,
    targetId,
    locked,
  });
};

/**
 * Bulk delete comments (admin only)
 */
export const bulkDeleteComments = async (
  commentIds: string[]
): Promise<void> => {
  await API.post("/comments/bulk-delete", { commentIds });
};

/**
 * Get moderation queue
 */
export const getModerationQueue = async (
  filters: CommentFilters = {}
): Promise<CommentReadDto[]> => {
  const res = await API.get("/comments/moderation", {
    params: filters,
  });
  return res.data;
};

/**
 * Approve a comment (moderator only)
 */
export const approveComment = async (commentId: string): Promise<void> => {
  await API.post(`/comments/${commentId}/approve`);
};

/**
 * Hide a comment (moderator only)
 */
export const hideComment = async (commentId: string): Promise<void> => {
  await API.post(`/comments/${commentId}/hide`);
};
