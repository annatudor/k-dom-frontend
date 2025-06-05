// src/api/moderation.ts
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

// ========================================
// MODERATION ACTIONS
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

export const bulkModerate = async (
  data: BulkModerationDto
): Promise<BulkModerationResultDto> => {
  const response = await API.post("/moderation/bulk-action", data);
  return response.data;
};

// ========================================
// DASHBOARD & STATS
// ========================================

export const getModerationDashboard =
  async (): Promise<ModerationDashboardDto> => {
    const response = await API.get("/moderation/dashboard");
    return response.data;
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
// K-DOM STATUS & PRIORITY
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
// USER MODERATION HISTORY
// ========================================

export const getUserModerationHistory =
  async (): Promise<ModerationHistoryDto> => {
    const response = await API.get("/moderation/user/history");
    return response.data;
  };

export const getUserKDomStatuses = async (): Promise<UserKDomStatusDto[]> => {
  const response = await API.get("/moderation/user/kdom-status");
  return response.data;
};

export const getKDomStatus = async (
  kdomId: string
): Promise<UserKDomStatusDto> => {
  const response = await API.get(`/moderation/user/kdom-status/${kdomId}`);
  return response.data;
};

// ========================================
// HELPER FUNCTIONS
// ========================================

export const formatProcessingTime = (duration: string): string => {
  try {
    // Dacă e deja formatat, returnează direct
    if (duration.includes("hours") || duration.includes("days")) {
      return duration;
    }

    // Parsează ISO duration (PT1H30M) sau milisecunde
    const ms =
      typeof duration === "string" && duration.startsWith("PT")
        ? parsePTDuration(duration)
        : parseFloat(duration);

    const hours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ${hours % 24} hour${
        hours % 24 !== 1 ? "s" : ""
      }`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    } else {
      const minutes = Math.floor(ms / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
  } catch {
    return "Unknown";
  }
};

function parsePTDuration(duration: string): number {
  // Parsează PT1H30M -> milisecunde
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return 0;

  const hours = parseInt(matches[1] || "0");
  const minutes = parseInt(matches[2] || "0");
  const seconds = parseInt(matches[3] || "0");

  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}

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
