// src/types/Notification.ts
export interface NotificationCreateDto {
  userId: number;
  type: NotificationType;
  message: string;
  triggeredByUserId?: number;
  targetType?: ContentType;
  targetId?: string;
}

export interface NotificationReadDto {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  triggeredByUsername?: string;
  targetType?: ContentType;
  targetId?: string;
}

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
  | "SystemMessage"
  | "KDomDeleted"
  | "KDomForceDeleted"
  | "BulkModerationCompleted"
  | "ModerationReminder"
  | "KDomResubmitted";

export type ContentType = "Post" | "Comment" | "KDom";

// Constants for easy reference and to avoid typos
export const NOTIFICATION_TYPES = {
  KDOM_APPROVED: "KDomApproved" as const,
  KDOM_REJECTED: "KDomRejected" as const,
  COMMENT_REPLY: "CommentReply" as const,
  POST_LIKED: "PostLiked" as const,
  COMMENT_LIKED: "CommentLiked" as const,
  KDOM_PENDING: "KDomPending" as const,
  MENTION_IN_COMMENT: "MentionInComment" as const,
  MENTION_IN_POST: "MentionInPost" as const,
  NEW_FOLLOWER: "NewFollower" as const,
  SYSTEM_MESSAGE: "SystemMessage" as const,
  KDOM_DELETED: "KDomDeleted" as const,
  KDOM_FORCE_DELETED: "KDomForceDeleted" as const,
  BULK_MODERATION_COMPLETED: "BulkModerationCompleted" as const,
  MODERATION_REMINDER: "ModerationReminder" as const,
  KDOM_RESUBMITTED: "KDomResubmitted" as const,
} as const;

export const CONTENT_TYPES = {
  POST: "Post" as const,
  COMMENT: "Comment" as const,
  KDOM: "KDom" as const,
} as const;
