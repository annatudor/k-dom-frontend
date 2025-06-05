// src/types/Moderation.ts
export type KDomModerationStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Deleted";

export type ModerationPriority = "Low" | "Normal" | "High" | "Urgent";

export type ModerationDecision = "Approved" | "Rejected" | "Pending";

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
  waitingTime: string; // ISO duration sau string formatat
}

export interface UserKDomStatusDto {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  status: KDomModerationStatus;
  rejectionReason?: string;
  moderatedAt?: string;
  moderatorUsername?: string;
  processingTime?: string; // ISO duration sau string formatat
  canEdit: boolean;
  canResubmit: boolean;
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
  processingTime: string; // ISO duration sau string formatat
  authorUsername: string;
}

export interface ModerationDashboardDto {
  stats: ModerationStatsDto;
  pendingKDoms: KDomModerationDto[];
  recentActions: ModerationActionDto[];
}

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

export interface RejectAndDeleteDto {
  reason: string;
}

export interface ForceDeleteReasonDto {
  reason: string;
}

// Pentru utilizatori
export interface ModerationHistoryDto {
  allSubmissions: UserKDomStatusDto[];
  userStats: ModerationStatsDto;
  recentDecisions: ModerationActionDto[];
}

// Pentru permisiuni
export interface KDomAccessCheckResult {
  hasAccess: boolean;
  reason?: string;
  status?: KDomModerationStatus;
  redirectTo?: string;
  showMessage?: boolean;
}

// Actualizare pentru KDomReadDto - adăugăm statusul de moderare
export interface KDomReadDtoWithModeration {
  id: string;
  parentId?: string | null;
  title: string;
  slug: string;
  description: string;
  hub: string;
  theme: string;
  contentHtml: string;
  language: string;
  isForKids: boolean;
  userId: number;
  authorUsername: string;
  createdAt: string;
  updatedAt?: string;
  lastEditedAt?: string;
  collaborators?: number[];

  // ✅ Statusuri de moderare
  isApproved: boolean;
  isRejected: boolean;
  rejectionReason?: string;
  moderationStatus: KDomModerationStatus; // computed field
  moderatedAt?: string;
  moderatorUsername?: string;
}
