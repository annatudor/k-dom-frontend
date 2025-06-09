// src/api/auditLog.ts - FIXED VERSION
import API from "./axios";
import type {
  AuditLogReadDto,
  AuditLogFilterDto,
  AuditLogFilterResponse,
  AuditStatsDto,
  AuditActivityData,
  AuditExportOptions,
  AuditAction,
  AuditTargetType,
} from "@/types/AuditLog";

// ✅ IMPORT REGULAR (nu type) pentru constantele care sunt folosite ca valori
import {
  AUDIT_ACTION_LABELS,
  AUDIT_TARGET_TYPE_LABELS,
  AUDIT_ACTION_COLORS,
} from "@/types/AuditLog";

// ========================================
// AUDIT LOG OPERATIONS
// ========================================

/**
 * Obține toate audit log-urile (admin only)
 */
export const getAllAuditLogs = async (): Promise<AuditLogReadDto[]> => {
  const response = await API.get("/audit-log");
  return response.data;
};

/**
 * Obține audit log-urile cu filtrare și paginare (admin only)
 */
export const getFilteredAuditLogs = async (
  filters: AuditLogFilterDto
): Promise<AuditLogFilterResponse> => {
  const params = new URLSearchParams();

  // Adaugă parametrii de filtrare
  if (filters.action) params.append("action", filters.action);
  if (filters.userId) params.append("userId", filters.userId.toString());
  if (filters.from) params.append("from", filters.from);
  if (filters.to) params.append("to", filters.to);
  if (filters.targetType) params.append("targetType", filters.targetType);
  if (filters.search) params.append("search", filters.search);

  // Parametrii de paginare
  params.append("page", filters.page.toString());
  params.append("pageSize", filters.pageSize.toString());

  const response = await API.get(`/audit-log/filter?${params.toString()}`);
  return response.data;
};

/**
 * Obține statistici pentru audit logs (admin only)
 */
export const getAuditStats = async (): Promise<AuditStatsDto> => {
  const response = await API.get("/audit-log/stats");
  return response.data;
};

/**
 * Obține activitatea pe zile pentru un interval (admin only)
 */
export const getAuditActivity = async (
  fromDate: string,
  toDate: string
): Promise<AuditActivityData[]> => {
  const response = await API.get("/audit-log/activity", {
    params: { from: fromDate, to: toDate },
  });
  return response.data;
};

/**
 * Exportă audit logs în format CSV sau JSON (admin only)
 */
export const exportAuditLogs = async (
  options: AuditExportOptions
): Promise<Blob> => {
  const params = new URLSearchParams();

  params.append("format", options.format);

  if (options.filters) {
    if (options.filters.action) params.append("action", options.filters.action);
    if (options.filters.userId)
      params.append("userId", options.filters.userId.toString());
    if (options.filters.targetType)
      params.append("targetType", options.filters.targetType);
  }

  if (options.dateRange) {
    params.append("from", options.dateRange.from);
    params.append("to", options.dateRange.to);
  }

  if (options.includeUserDetails) {
    params.append("includeUserDetails", "true");
  }

  const response = await API.get(`/audit-log/export?${params.toString()}`, {
    responseType: "blob",
  });

  return response.data;
};

/**
 * Obține audit logs pentru un utilizator specific (admin only)
 */
export const getUserAuditLogs = async (
  userId: number,
  filters?: Partial<AuditLogFilterDto>
): Promise<AuditLogFilterResponse> => {
  const params = new URLSearchParams();

  params.append("userId", userId.toString());

  if (filters) {
    if (filters.action) params.append("action", filters.action);
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);
    params.append("page", (filters.page || 1).toString());
    params.append("pageSize", (filters.pageSize || 20).toString());
  }

  const response = await API.get(`/audit-log/user?${params.toString()}`);
  return response.data;
};

/**
 * Obține audit logs pentru un target specific (admin only)
 */
export const getTargetAuditLogs = async (
  targetType: AuditTargetType,
  targetId: string
): Promise<AuditLogReadDto[]> => {
  const response = await API.get("/audit-log/target", {
    params: { targetType, targetId },
  });
  return response.data;
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Obține label-ul pentru o acțiune
 */
export const getActionLabel = (action: AuditAction): string => {
  return AUDIT_ACTION_LABELS[action] || action;
};

/**
 * Obține label-ul pentru un tip de target
 */
export const getTargetTypeLabel = (targetType: AuditTargetType): string => {
  return AUDIT_TARGET_TYPE_LABELS[targetType] || targetType;
};

/**
 * Obține culoarea pentru o acțiune
 */
export const getActionColor = (action: AuditAction): string => {
  return AUDIT_ACTION_COLORS[action] || "gray";
};

/**
 * Obține culoarea pentru un tip de target
 */
export const getTargetTypeColor = (targetType: AuditTargetType): string => {
  const targetTypeColors: Record<AuditTargetType, string> = {
    User: "purple",
    Post: "blue",
    Comment: "cyan",
    KDom: "teal",
    Flag: "orange",
  };
  return targetTypeColors[targetType] || "gray";
};

/**
 * Formatează o acțiune pentru afișare
 */
export const formatAction = (action: string): string => {
  return action.replace(/([A-Z])/g, " $1").trim();
};

/**
 * Formatează data pentru afișare în audit logs
 */
export const formatAuditDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

/**
 * Obține timpul relativ (ex: "2 hours ago")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * Creează un obiect pentru filtrare cu valori default
 */
export const createAuditFilter = (
  overrides: Partial<AuditLogFilterDto> = {}
): AuditLogFilterDto => {
  return {
    page: 1,
    pageSize: 20,
    ...overrides,
  };
};

/**
 * Validează intervalul de date
 */
export const validateDateRange = (from?: string, to?: string): boolean => {
  if (!from || !to) return true;

  const fromDate = new Date(from);
  const toDate = new Date(to);

  return fromDate <= toDate;
};

/**
 * Obține lista de acțiuni disponibile pentru filtru
 */
export const getAvailableActions = (): Array<{
  value: AuditAction;
  label: string;
}> => {
  return Object.entries(AUDIT_ACTION_LABELS).map(([value, label]) => ({
    value: value as AuditAction,
    label,
  }));
};

/**
 * Obține lista de tipuri de target disponibile pentru filtru
 */
export const getAvailableTargetTypes = (): Array<{
  value: AuditTargetType;
  label: string;
}> => {
  return Object.entries(AUDIT_TARGET_TYPE_LABELS).map(([value, label]) => ({
    value: value as AuditTargetType,
    label,
  }));
};

/**
 * Grupează audit logs pe categorii pentru afișare
 */
export const groupAuditLogsByAction = (
  logs: AuditLogReadDto[]
): Record<AuditAction, AuditLogReadDto[]> => {
  return logs.reduce((groups, log) => {
    if (!groups[log.action]) {
      groups[log.action] = [];
    }
    groups[log.action].push(log);
    return groups;
  }, {} as Record<AuditAction, AuditLogReadDto[]>);
};

/**
 * Filtrează logs pe severitate
 */
export const filterLogsBySeverity = (
  logs: AuditLogReadDto[],
  severity: "low" | "medium" | "high" | "critical"
): AuditLogReadDto[] => {
  const severityMap: Record<
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

  return logs.filter((log) => severityMap[log.action] === severity);
};

/**
 * Descarcă un fișier export
 */
export const downloadExportFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Calculează statistici rapide din logs
 */
export const calculateQuickStats = (logs: AuditLogReadDto[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const todayLogs = logs.filter((log) => new Date(log.createdAt) >= today);
  const weekLogs = logs.filter((log) => new Date(log.createdAt) >= weekAgo);
  const monthLogs = logs.filter((log) => new Date(log.createdAt) >= monthAgo);

  const securityEvents = logs.filter((log) =>
    ["LoginFailed", "ChangeRole", "ForceDeleteKDom"].includes(log.action)
  );

  const failedLogins = logs.filter((log) => log.action === "LoginFailed");

  return {
    totalLogs: logs.length,
    todayCount: todayLogs.length,
    weekCount: weekLogs.length,
    monthCount: monthLogs.length,
    securityEvents: securityEvents.length,
    failedLogins: failedLogins.length,
  };
};

/**
 * Formatează mărimea fișierului pentru export
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Generează un rezumat textual pentru un audit log
 */
export const generateLogSummary = (log: AuditLogReadDto): string => {
  const action = AUDIT_ACTION_LABELS[log.action] || log.action;
  const user = log.userId ? `User ${log.userId}` : "System";
  const target = log.targetId ? ` on ${log.targetType} ${log.targetId}` : "";
  const time = getRelativeTime(log.createdAt);

  return `${user} performed ${action}${target} ${time}`;
};
