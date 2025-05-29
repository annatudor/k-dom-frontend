import type { PagedFilterDto } from "./Pagination";

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
  | "RemoveCollaborator";

export type AuditTargetType = "User" | "Post" | "Comment" | "KDom" | "Flag";

export interface AuditLogReadDto {
  id: number;
  userId: number;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId: string;
  details: string;
  createdAt: string;
}

export interface AuditLogFilterDto extends PagedFilterDto {
  action?: string;
  userId?: number;
  from?: string; // ISO date string
  to?: string;
}
