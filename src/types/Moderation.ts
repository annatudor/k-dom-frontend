// src/types/Moderation.ts - Actualizat conform backend-ului
export type KDomModerationStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Deleted";

export type ModerationPriority = "Low" | "Normal" | "High" | "Urgent";

export type ModerationDecision = "Approved" | "Rejected" | "Pending";

// ========================================
// ADMIN DASHBOARD TYPES
// ========================================

export interface ModerationDashboardDto {
  stats: ModerationStatsDto;
  pendingKDoms: KDomModerationDto[];
  recentActions: ModerationActionDto[];
}

export interface ModerationStatsDto {
  totalPending: number;
  totalApprovedToday: number;
  totalRejectedToday: number;
  totalApprovedThisWeek: number;
  totalRejectedThisWeek: number;
  totalApprovedThisMonth: number;
  totalRejectedThisMonth: number;
  averageProcessingTimeHours: number;
  moderatorActivity: ModeratorActivityDto[];
}

export interface ModeratorActivityDto {
  moderatorUsername: string;
  approvedCount: number;
  rejectedCount: number;
  totalActions: number;
}

export interface ModerationActionDto {
  id: number;
  kdomId: string;
  kdomTitle: string;
  moderatorUsername: string;
  decision: ModerationDecision;
  reason?: string;
  actionDate: string;
  processingTime: string;
  authorUsername: string;
}

// ========================================
// K-DOM MODERATION TYPES
// ========================================

export interface KDomModerationDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  contentHtml: string;
  hub: string;
  language: string;
  isForKids: boolean;
  theme: string;
  authorUsername: string;
  authorId: number;
  createdAt: string;
  parentId?: string;
  parentTitle?: string;
  priority: ModerationPriority;
  flags: string[];
  status: string;
  waitingTime: string;
}

// ========================================
// USER MODERATION TYPES
// ========================================

export interface UserKDomStatusDto {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  status: KDomModerationStatus;
  rejectionReason?: string;
  moderatedAt?: string;
  moderatorUsername?: string;
  processingTime?: string;
  canEdit: boolean;
  canResubmit: boolean;
}

export interface ModerationHistoryDto {
  allSubmissions: UserKDomStatusDto[];
  userStats: ModerationStatsDto;
  recentDecisions: ModerationActionDto[];
}

// ========================================
// BULK OPERATIONS TYPES
// ========================================

export interface BulkModerationDto {
  kdomIds: string[];
  action: "approve" | "reject";
  reason?: string;
  deleteRejected?: boolean;
}

export interface BulkModerationResultDto {
  message: string;
  successCount: number;
  failureCount: number;
  totalProcessed: number;
  results: ModerationResultItemDto[];
}

export interface ModerationResultItemDto {
  kdomId: string;
  kdomTitle: string;
  success: boolean;
  message: string;
  error?: string;
}

// ========================================
// ACTION DTOS
// ========================================

export interface RejectAndDeleteDto {
  reason: string;
}

export interface ForceDeleteReasonDto {
  reason: string;
}

// ========================================
// ACCESS & PERMISSIONS
// ========================================

export interface KDomAccessCheckResult {
  hasAccess: boolean;
  reason?: string;
  status?: KDomModerationStatus;
  redirectTo?: string;
  showMessage?: boolean;
}

// ========================================
// DASHBOARD SUMMARY TYPES (pentru user)
// ========================================

export interface UserModerationSummary {
  totalSubmitted: number;
  pending: number;
  approved: number;
  rejected: number;
  approvalRate: number;
  hasNotifications: boolean;
  lastSubmission?: string;
}

// ========================================
// FILTER & SEARCH TYPES
// ========================================

export interface ModerationFilterDto {
  status?: KDomModerationStatus;
  priority?: ModerationPriority;
  authorUsername?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}
