export interface PostCreateDto {
  contentHtml: string;
  kdomId?: string;
  tags?: string[];
}

export interface PostEditDto {
  contentHtml: string;
  tags: string[];
}

export interface PostLikeResponseDto {
  liked: boolean;
  likeCount: number;
}

export interface PostReadDto {
  id: string;
  userId: number;
  username: string;
  contentHtml: string;
  tags: string[];
  createdAt: string;
  isEdited: boolean;
  editedAt?: string;
  likeCount: number;
}
