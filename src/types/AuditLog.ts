import type { PagedFilterDto } from "@/types/Pagination";

export type AuditAction =
  | "CreateUser"
  | "LoginSuccess"
  | "LoginFailed"
  | "ChangePassword"
  | "ResetPassword"
  | "ResolveFlag"
  | "DeleteFlag"
  | "CreateKDom"
  | "ApproveKDom"
  | "RejectKDom"
  | "EditKDom"
  | "DeletePost"
  | "DeleteComment"
  | "ChangeRole"
  | "ApproveCollaboration"
  | "RejectCollaboration"
  | "RemoveCollaborator"
  | "DeleteKDom"
  | "BulkApproveKDom"
  | "BulkRejectKDom"
  | "ForceDeleteKDom"
  | "ViewModerationDashboard"
  | "ViewUserModerationHistory"
  | "ResubmitKDom";

export type AuditTargetType = "User" | "Post" | "Comment" | "KDom" | "Flag";

export interface AuditLogReadDto {
  id: number;
  userId: number;
  action: AuditAction; // Schimbă din string în AuditAction
  targetType: AuditTargetType; // Schimbă din string în AuditTargetType
  targetId: string;
  details: string;
  createdAt: string;
}

export interface AuditLogFilterDto extends PagedFilterDto {
  action?: AuditAction; // Schimbă din string în AuditAction
  userId?: number;
  from?: string;
  to?: string;
}
