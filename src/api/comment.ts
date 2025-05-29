import API from "./axios";
import type {
  CommentCreateDto,
  CommentEditDto,
  CommentLikeResponseDto,
  CommentReadDto,
  CommentTargetType,
} from "../types/Comment";

// Creează un comentariu nou
export const createComment = async (data: CommentCreateDto): Promise<void> => {
  await API.post("/comments", data);
};

// Obține comentariile pentru un target (Post sau KDom)
export const getCommentsByTarget = async (
  targetType: CommentTargetType,
  targetId: string
): Promise<CommentReadDto[]> => {
  const res = await API.get("/comments", {
    params: { targetType, targetId },
  });
  return res.data;
};

// Obține răspunsurile pentru un comentariu
export const getRepliesForComment = async (
  commentId: string
): Promise<CommentReadDto[]> => {
  const res = await API.get(`/comments/${commentId}/replies`);
  return res.data;
};

// Editează un comentariu
export const editComment = async (
  commentId: string,
  data: CommentEditDto
): Promise<void> => {
  await API.put(`/comments/${commentId}`, data);
};

// Șterge un comentariu
export const deleteComment = async (commentId: string): Promise<void> => {
  await API.delete(`/comments/${commentId}`);
};

// Toggle like/unlike pe comentariu
export const toggleLikeComment = async (
  commentId: string
): Promise<CommentLikeResponseDto> => {
  const res = await API.post(`/comments/${commentId}/like`);
  return res.data;
};
