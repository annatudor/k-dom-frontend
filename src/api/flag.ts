// src/api/flag.ts - Complet refăcut pentru backend
import API from "./axios";
import type {
  FlagCreateDto,
  FlagReadDto,
  FlagResponse,
  FlagStatsDto,
  ContentRemovalDto,
} from "@/types/Flag";

// ========================================
// FLAG OPERATIONS
// ========================================

/**
 * Creează un flag pentru conținut
 */
export const createFlag = async (
  data: FlagCreateDto
): Promise<FlagResponse> => {
  const response = await API.post("/flags", data);
  return {
    success: true,
    message: response.data.message || "Content reported successfully!",
  };
};

/**
 * Obține toate flag-urile (admin/moderator only)
 */
export const getAllFlags = async (): Promise<{
  pending: FlagReadDto[];
  resolved: FlagReadDto[];
  summary: {
    totalPending: number;
    totalResolved: number;
    total: number;
  };
  message: string;
}> => {
  const response = await API.get("/flags");
  return response.data;
};

/**
 * Rezolvă un flag (conținutul e ok) - admin/moderator only
 */
export const resolveFlag = async (id: number): Promise<void> => {
  await API.post(`/flags/${id}/resolve`);
};

/**
 * Șterge conținutul flagged - admin/moderator only
 */
export const removeFlaggedContent = async (
  id: number,
  data: ContentRemovalDto
): Promise<void> => {
  await API.post(`/flags/${id}/remove-content`, data);
};

/**
 * Șterge un flag (admin only)
 */
export const deleteFlag = async (id: number): Promise<void> => {
  await API.delete(`/flags/${id}`);
};

/**
 * Obține statistici flag-uri (admin/moderator only)
 */
export const getFlagStats = async (): Promise<FlagStatsDto> => {
  const response = await API.get("/flags/stats");
  return response.data;
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Obține culoarea corespunzătoare pentru categoria de flag
 */
export const getFlagCategoryColor = (category: string): string => {
  switch (category) {
    case "spam":
      return "orange";
    case "inappropriate":
      return "yellow";
    case "harmful":
      return "red";
    case "other":
      return "gray";
    default:
      return "gray";
  }
};

/**
 * Obține textul pentru statusul flag-ului
 */
export const getFlagStatusText = (isResolved: boolean): string => {
  return isResolved ? "Resolved" : "Pending";
};

/**
 * Obține culoarea pentru statusul flag-ului
 */
export const getFlagStatusColor = (isResolved: boolean): string => {
  return isResolved ? "green" : "orange";
};

/**
 * Formatează data pentru afișare
 */
export const formatFlagDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

/**
 * Obține textul descriptiv pentru tipul de conținut
 */
export const getContentTypeLabel = (contentType: string): string => {
  switch (contentType) {
    case "KDom":
      return "K-Dom";
    case "Post":
      return "Post";
    case "Comment":
      return "Comment";
    default:
      return contentType;
  }
};

/**
 * Truncate text pentru afișare
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
