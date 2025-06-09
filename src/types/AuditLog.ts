// src/types/AuditLog.ts - FIXED VERSION
import type { PagedFilterDto, PagedResult } from "@/types/Pagination";

// Tipurile de acțiuni audit (din enum-ul backend)
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

// Tipurile de target audit (din enum-ul backend)
export type AuditTargetType = "User" | "Post" | "Comment" | "KDom" | "Flag";

// DTO pentru citirea audit logs
export interface AuditLogReadDto {
  id: number;
  userId?: number;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId?: string;
  details?: string;
  createdAt: string;
}

// DTO pentru filtrarea audit logs
export interface AuditLogFilterDto extends PagedFilterDto {
  action?: AuditAction;
  userId?: number;
  targetType?: AuditTargetType;
  from?: string;
  to?: string;
  search?: string;
}

// ✅ FIXED: Response pentru audit logs cu paginare - extinde direct PagedResult
export interface AuditLogFilterResponse extends PagedResult<AuditLogReadDto> {
  // Moștenește toate proprietățile din PagedResult<AuditLogReadDto>
  // Nu mai este interfață goală
}

// Statistici audit
export interface AuditStatsDto {
  totalLogs: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  topActions: Array<{
    action: AuditAction;
    count: number;
    percentage: number;
  }>;
  topUsers: Array<{
    userId: number;
    username?: string;
    actionCount: number;
  }>;
  securityEvents: number;
  failedLogins: number;
  lastActivity?: string;
}

// Date pentru activitatea zilnică
export interface AuditActivityData {
  date: string;
  count: number;
  actions: Record<AuditAction, number>;
}

// Opțiuni pentru export
export interface AuditExportOptions {
  format: "csv" | "json";
  filters?: Partial<AuditLogFilterDto>;
  dateRange?: {
    from: string;
    to: string;
  };
  includeUserDetails?: boolean;
}

// Timeline entry pentru vizualizarea cronologică
export interface AuditTimelineEntry {
  id: number;
  timestamp: string;
  action: AuditAction;
  userName?: string;
  description: string;
  icon: string;
  color: string;
  details?: string;
  targetInfo?: {
    type: AuditTargetType;
    id: string;
  };
}

// API Response types pentru consistență
export interface AuditLogResponse {
  logs: AuditLogReadDto[];
  totalCount: number;
  message: string;
}

export interface AuditExportResponse {
  success: boolean;
  downloadUrl?: string;
  message: string;
}

// ✅ FIXED: Labels pentru afișare - EXPORT ca valori, nu doar type
export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  CreateUser: "User Created",
  LoginSuccess: "Successful Login",
  LoginFailed: "Failed Login",
  ChangePassword: "Password Changed",
  ResetPassword: "Password Reset",
  ResolveFlag: "Flag Resolved",
  DeleteFlag: "Flag Deleted",
  CreateKDom: "K-Dom Created",
  ApproveKDom: "K-Dom Approved",
  RejectKDom: "K-Dom Rejected",
  EditKDom: "K-Dom Edited",
  DeletePost: "Post Deleted",
  DeleteComment: "Comment Deleted",
  ChangeRole: "Role Changed",
  ApproveCollaboration: "Collaboration Approved",
  RejectCollaboration: "Collaboration Rejected",
  RemoveCollaborator: "Collaborator Removed",
  DeleteKDom: "K-Dom Deleted",
  BulkApproveKDom: "Bulk K-Dom Approval",
  BulkRejectKDom: "Bulk K-Dom Rejection",
  ForceDeleteKDom: "K-Dom Force Deleted",
  ViewModerationDashboard: "Moderation Dashboard Viewed",
  ViewUserModerationHistory: "User History Viewed",
  ResubmitKDom: "K-Dom Resubmitted",
};

export const AUDIT_TARGET_TYPE_LABELS: Record<AuditTargetType, string> = {
  User: "User Account",
  Post: "Post",
  Comment: "Comment",
  KDom: "K-Dom",
  Flag: "Content Flag",
};

// Severitatea acțiunilor
export const AUDIT_ACTION_SEVERITY: Record<
  AuditAction,
  "low" | "medium" | "high" | "critical"
> = {
  CreateUser: "low",
  LoginSuccess: "low",
  LoginFailed: "medium",
  ChangePassword: "medium",
  ResetPassword: "medium",
  ResolveFlag: "low",
  DeleteFlag: "medium",
  CreateKDom: "low",
  ApproveKDom: "low",
  RejectKDom: "low",
  EditKDom: "low",
  DeletePost: "medium",
  DeleteComment: "medium",
  ChangeRole: "high",
  ApproveCollaboration: "low",
  RejectCollaboration: "low",
  RemoveCollaborator: "medium",
  DeleteKDom: "high",
  BulkApproveKDom: "medium",
  BulkRejectKDom: "medium",
  ForceDeleteKDom: "critical",
  ViewModerationDashboard: "low",
  ViewUserModerationHistory: "low",
  ResubmitKDom: "low",
};

// Culori pentru acțiuni
export const AUDIT_ACTION_COLORS: Record<AuditAction, string> = {
  CreateUser: "green",
  LoginSuccess: "blue",
  LoginFailed: "red",
  ChangePassword: "purple",
  ResetPassword: "orange",
  ResolveFlag: "green",
  DeleteFlag: "red",
  CreateKDom: "teal",
  ApproveKDom: "green",
  RejectKDom: "red",
  EditKDom: "yellow",
  DeletePost: "red",
  DeleteComment: "red",
  ChangeRole: "purple",
  ApproveCollaboration: "green",
  RejectCollaboration: "red",
  RemoveCollaborator: "orange",
  DeleteKDom: "red",
  BulkApproveKDom: "green",
  BulkRejectKDom: "red",
  ForceDeleteKDom: "red",
  ViewModerationDashboard: "blue",
  ViewUserModerationHistory: "blue",
  ResubmitKDom: "cyan",
};

// Iconuri pentru acțiuni
export const AUDIT_ACTION_ICONS: Record<AuditAction, string> = {
  CreateUser: "FiUserPlus",
  LoginSuccess: "FiLogIn",
  LoginFailed: "FiXCircle",
  ChangePassword: "FiLock",
  ResetPassword: "FiUnlock",
  ResolveFlag: "FiCheckCircle",
  DeleteFlag: "FiTrash2",
  CreateKDom: "FiPlus",
  ApproveKDom: "FiCheck",
  RejectKDom: "FiX",
  EditKDom: "FiEdit",
  DeletePost: "FiTrash2",
  DeleteComment: "FiTrash2",
  ChangeRole: "FiShield",
  ApproveCollaboration: "FiUserCheck",
  RejectCollaboration: "FiUserX",
  RemoveCollaborator: "FiUserMinus",
  DeleteKDom: "FiTrash2",
  BulkApproveKDom: "FiCheckSquare",
  BulkRejectKDom: "FiXSquare",
  ForceDeleteKDom: "FiAlertTriangle",
  ViewModerationDashboard: "FiEye",
  ViewUserModerationHistory: "FiClock",
  ResubmitKDom: "FiRefreshCw",
};
