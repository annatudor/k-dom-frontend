// src/api/moderation.ts - Actualizat conform backend-ului
import API from "./axios";
import type {
  ModerationDashboardDto,
  ModerationStatsDto,
  ModerationActionDto,
  ModeratorActivityDto,
  BulkModerationDto,
  BulkModerationResultDto,
  RejectAndDeleteDto,
  ForceDeleteReasonDto,
  UserKDomStatusDto,
  ModerationHistoryDto,
  ModerationPriority,
} from "@/types/Moderation";

import type { KDomDisplayDto, KDomReadDto } from "@/types/KDom";

// ========================================
// ADMIN MODERATION ACTIONS
// ========================================

export const approveKDom = async (kdomId: string): Promise<void> => {
  await API.post(`/moderation/${kdomId}/approve`);
};

export const rejectKDom = async (
  kdomId: string,
  data: { reason: string },
  deleteAfterReject: boolean = true
): Promise<void> => {
  await API.post(
    `/moderation/${kdomId}/reject?deleteAfterReject=${deleteAfterReject}`,
    data
  );
};

export const rejectAndDeleteKDom = async (
  kdomId: string,
  data: RejectAndDeleteDto
): Promise<void> => {
  await API.post(`/moderation/reject-and-delete/${kdomId}`, data);
};

export const forceDeleteKDom = async (
  kdomId: string,
  data: ForceDeleteReasonDto
): Promise<void> => {
  await API.delete(`/moderation/${kdomId}/force-delete`, { data });
};

// ========================================
// BULK OPERATIONS
// ========================================

export const bulkModerate = async (
  data: BulkModerationDto
): Promise<BulkModerationResultDto> => {
  const response = await API.post("/moderation/bulk-action", data);
  return response.data;
};

export const bulkApproveKDoms = async (kdomIds: string[]): Promise<void> => {
  await API.post("/moderation/bulk-approve", { kdomIds });
};

export const bulkRejectKDoms = async (
  kdomIds: string[],
  reason: string,
  deleteAfterReject: boolean = true
): Promise<void> => {
  await API.post(
    `/moderation/bulk-reject?deleteAfterReject=${deleteAfterReject}`,
    {
      kdomIds,
      reason,
    }
  );
};

// ========================================
// ADMIN DASHBOARD & STATS
// ========================================

export const getModerationDashboard =
  async (): Promise<ModerationDashboardDto> => {
    const response = await API.get("/moderation/dashboard");
    return response.data.dashboard;
  };

export const getModerationStats = async (): Promise<ModerationStatsDto> => {
  const response = await API.get("/moderation/stats");
  return response.data;
};

export const getRecentModerationActions = async (
  limit: number = 20
): Promise<ModerationActionDto[]> => {
  const response = await API.get(`/moderation/recent-actions?limit=${limit}`);
  return response.data.actions;
};

export const getTopModerators = async (
  days: number = 30,
  limit: number = 10
): Promise<ModeratorActivityDto[]> => {
  const response = await API.get(
    `/moderation/top-moderators?days=${days}&limit=${limit}`
  );
  return response.data.moderators;
};

// ========================================
// K-DOM PRIORITY & STATUS CHECKS
// ========================================

export const getKDomPriority = async (
  kdomId: string
): Promise<{
  kdomId: string;
  priority: ModerationPriority;
  priorityLevel: number;
  message: string;
}> => {
  const response = await API.get(`/moderation/priority/${kdomId}`);
  return response.data;
};

export const canViewKDomStatus = async (
  kdomId: string
): Promise<{
  kdomId: string;
  canView: boolean;
  message: string;
}> => {
  const response = await API.get(`/moderation/can-view-status/${kdomId}`);
  return response.data;
};

// ========================================
// USER MODERATION HISTORY (pentru utilizatori normali)
// ========================================

export const getUserModerationHistory =
  async (): Promise<ModerationHistoryDto> => {
    const response = await API.get("/user/moderation/history");
    return response.data.history;
  };

export const getUserKDomStatuses = async (): Promise<UserKDomStatusDto[]> => {
  const response = await API.get("/user/moderation/my-kdoms-status");
  return response.data.statuses;
};

export const getMyPendingKDoms = async (): Promise<UserKDomStatusDto[]> => {
  const response = await API.get("/user/moderation/pending-kdoms");
  return response.data.pendingKDoms;
};

export const getMyRejectedKDoms = async (): Promise<UserKDomStatusDto[]> => {
  const response = await API.get("/user/moderation/rejected-kdoms");
  return response.data.rejectedKDoms;
};

export const getMyQuickStats = async (): Promise<{
  totalSubmitted: number;
  pending: number;
  approved: number;
  rejected: number;
  approvalRate: number;
  averageProcessingTime: number;
  lastSubmission: string | null;
  hasNotifications: boolean;
}> => {
  const response = await API.get("/user/moderation/quick-stats");
  return response.data;
};

export const getKDomStatus = async (
  kdomId: string
): Promise<UserKDomStatusDto> => {
  const response = await API.get(`/user/moderation/kdom-status/${kdomId}`);
  return response.data.status;
};

export const isKDomPending = (kdom: KDomReadDto): boolean => {
  return kdom.status === "Pending" || kdom.isPending;
};

export const isKDomApproved = (kdom: KDomReadDto): boolean => {
  return kdom.status === "Approved" || kdom.isApproved;
};

export const isKDomRejected = (kdom: KDomReadDto): boolean => {
  return kdom.status === "Rejected" || kdom.isRejected;
};

export const canUserAccessKDom = (
  kdom: KDomReadDto,
  userId?: number
): boolean => {
  // K-Dom-uri aprobate sunt accesibile tuturor
  if (isKDomApproved(kdom)) {
    return true;
  }

  // K-Dom-uri pending sau rejected sunt accesibile doar autorului
  if (userId && kdom.userId === userId) {
    return true;
  }

  return false;
};

export const getKDomModerationStatusDisplay = (
  kdom: KDomReadDto
): {
  status: string;
  color: string;
  message: string;
} => {
  if (isKDomApproved(kdom)) {
    return {
      status: "Live",
      color: "green",
      message: "Your K-Dom is live and visible to everyone",
    };
  }

  if (isKDomPending(kdom)) {
    return {
      status: "Pending Review",
      color: "yellow",
      message: "Your K-Dom is being reviewed by moderators",
    };
  }

  if (isKDomRejected(kdom)) {
    return {
      status: "Rejected",
      color: "red",
      message: kdom.rejectionReason || "Your K-Dom was rejected by moderators",
    };
  }

  return {
    status: "Unknown",
    color: "gray",
    message: "Unknown moderation status",
  };
};

export const formatProcessingTime = (timespan: string): string => {
  try {
    // Parseaza TimeSpan din C# (format: "days.hours:minutes:seconds")
    const parts = timespan.split(/[.:]/).map(Number);

    if (parts.length >= 4) {
      const [days, hours, minutes] = parts;

      if (days > 0) {
        return `${days} day${days !== 1 ? "s" : ""} ${hours}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    }

    return timespan;
  } catch {
    return "Unknown";
  }
};

export const getModerationStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "yellow";
    case "Approved":
      return "green";
    case "Rejected":
      return "red";
    case "Deleted":
      return "gray";
    default:
      return "gray";
  }
};

export const getPriorityColor = (priority: ModerationPriority) => {
  switch (priority) {
    case "Urgent":
      return "red";
    case "High":
      return "orange";
    case "Normal":
      return "blue";
    case "Low":
      return "gray";
    default:
      return "gray";
  }
};

export const getPriorityLabel = (priority: ModerationPriority): string => {
  switch (priority) {
    case "Urgent":
      return "Urgent";
    case "High":
      return "High Priority";
    case "Normal":
      return "Normal";
    case "Low":
      return "Low Priority";
    default:
      return "Unknown";
  }
};
// ========================================
// MODERATION (pentru administratori)
// ========================================

export const getPendingKdoms = async (): Promise<KDomDisplayDto[]> => {
  const res = await API.get("/kdoms/pending");
  return res.data;
};
// ========================================
// USER MODERATION STATUS (pentru utilizatori normali)
// ========================================

export const getMyKDomModerationStatus = async (): Promise<
  UserKDomStatusDto[]
> => {
  const res = await API.get("/user/moderation/my-kdoms-status");
  return res.data.statuses;
};

export const getKDomModerationStatus = async (
  kdomId: string
): Promise<UserKDomStatusDto> => {
  const res = await API.get(`/user/moderation/kdom-status/${kdomId}`);
  return res.data.status;
};
