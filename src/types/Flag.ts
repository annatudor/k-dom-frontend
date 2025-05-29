export type ContentType = "Post" | "Comment" | "KDom";

export interface FlagCreateDto {
  contentType: ContentType;
  contentId: string;
  reason: string;
}

export interface FlagReadDto {
  id: number;
  userId: number;
  contentType: ContentType;
  contentId: string;
  reason: string;
  createdAt: string;
  isResolved: boolean;
}
