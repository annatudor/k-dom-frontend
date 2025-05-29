export type NotificationType =
  | "KDomApproved"
  | "KDomRejected"
  | "CommentReply"
  | "PostLiked"
  | "CommentLiked"
  | "KDomPending"
  | "MentionInComment"
  | "MentionInPost"
  | "NewFollower"
  | "SystemMessage";

export type ContentType = "Post" | "Comment" | "KDom";

export interface NotificationReadDto {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  triggeredByUsername?: string | null;
  targetType?: ContentType | null;
  targetId?: string | null;
}

export interface NotificationCreateDto {
  userId: number;
  type: NotificationType;
  message: string;
  triggeredByUserId?: number;
  targetType?: ContentType;
  targetId?: string;
}
