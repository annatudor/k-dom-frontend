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

export interface CommentLikeResponseDto {
  liked: boolean;
  likeCount: number;
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
}
