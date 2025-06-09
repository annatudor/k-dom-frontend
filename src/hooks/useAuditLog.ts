// src/hooks/useAuditLog.ts - FIXED VERSION
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getAllAuditLogs, getFilteredAuditLogs } from "@/api/auditLog";
import type {
  AuditLogFilterDto,
  AuditLogReadDto,
  AuditAction,
  AuditTargetType,
} from "@/types/AuditLog";
import { useToast } from "@chakra-ui/react";

// ========================================
// BASIC HOOKS
// ========================================

/**
 * Hook pentru obținerea tuturor audit logs
 */
export const useAuditLogs = () => {
  return useQuery({
    queryKey: ["auditLogs"],
    queryFn: getAllAuditLogs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pentru audit logs cu filtrare și paginare
 */
export const useFilteredAuditLogs = (
  initialFilters?: Partial<AuditLogFilterDto>
) => {
  const [filters, setFilters] = useState<AuditLogFilterDto>(() => ({
    page: 1,
    pageSize: 20,
    ...initialFilters,
  }));

  const {
    data: auditData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["auditLogs", "filtered", filters],
    queryFn: () => getFilteredAuditLogs(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const updateFilters = (newFilters: Partial<AuditLogFilterDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      pageSize: 20,
      ...initialFilters,
    });
  };

  const goToPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const changePageSize = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  return {
    data: auditData,
    isLoading,
    isFetching,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch,
    goToPage,
    changePageSize,
  };
};

/**
 * Hook pentru audit log manager - combinează toate funcționalitățile
 */
export const useAuditLogManager = (
  initialFilters?: Partial<AuditLogFilterDto>
) => {
  const {
    data: auditData,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch,
    goToPage: internalGoToPage,
  } = useFilteredAuditLogs(initialFilters);

  // Safe accessors pentru data
  const logs = auditData?.items || [];
  const totalCount = auditData?.totalCount || 0;
  const currentPage = auditData?.currentPage || 1;
  const totalPages = auditData?.totalPages || 1;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const isEmpty = logs.length === 0;

  const updateFilter = (newFilters: Partial<AuditLogFilterDto>) => {
    updateFilters(newFilters);
  };

  const goToPage = (page: number) => {
    internalGoToPage(page);
  };

  const nextPage = () => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      goToPage(currentPage - 1);
    }
  };

  return {
    logs,
    totalCount,
    currentPage,
    totalPages,
    filters,
    isLoading,
    error,
    updateFilter,
    resetFilters,
    refetch,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    isEmpty,
  };
};

/**
 * Hook pentru export audit logs
 */
export const useAuditLogExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const toast = useToast();

  const exportAuditLogs = async (exportFilters?: AuditLogFilterDto) => {
    setIsExporting(true);
    setExportError(null);

    try {
      // Pentru demonstrație, simulez un export
      // În implementarea reală, ai apela API-ul de export
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulez crearea unui CSV - folosesc exportFilters pentru a genera numele fișierului
      const csvContent =
        "ID,User ID,Action,Target Type,Target ID,Details,Created At\n";

      // Folosesc filters pentru a personaliza numele fișierului
      const filterSuffix = exportFilters?.action
        ? `-${exportFilters.action}`
        : "";
      const dateSuffix = new Date().toISOString().split("T")[0];

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `audit-logs${filterSuffix}-${dateSuffix}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: "Audit logs have been exported successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Export failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Export failed";
      setExportError(errorMessage);

      toast({
        title: "Export failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportAuditLogs,
    isExporting,
    exportError,
    clearError: () => setExportError(null),
  };
};

/**
 * Hook pentru statistici audit
 */
export const useAuditStats = () => {
  return useQuery({
    queryKey: ["auditStats"],
    queryFn: async () => {
      // Pentru demonstrație, returnez date mock
      // În implementarea reală, ai apela API-ul pentru statistici
      return {
        totalLogs: 15420,
        todayCount: 89,
        weekCount: 567,
        monthCount: 2340,
        topActions: [
          {
            action: "LoginSuccess" as AuditAction,
            count: 4521,
            percentage: 29.3,
          },
          {
            action: "CreateKDom" as AuditAction,
            count: 2341,
            percentage: 15.2,
          },
          { action: "EditKDom" as AuditAction, count: 1876, percentage: 12.2 },
          {
            action: "ApproveKDom" as AuditAction,
            count: 1234,
            percentage: 8.0,
          },
          { action: "LoginFailed" as AuditAction, count: 567, percentage: 3.7 },
        ],
        topUsers: [
          { userId: 1, username: "admin", actionCount: 1234 },
          { userId: 5, username: "moderator1", actionCount: 876 },
          { userId: 12, username: "power_user", actionCount: 543 },
        ],
        securityEvents: 23,
        failedLogins: 167,
        lastActivity: new Date().toISOString(),
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook pentru căutare în audit logs
 */
export const useAuditSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<AuditLogReadDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchFilters = useMemo(
    () => ({
      page: 1,
      pageSize: 50,
      search: searchTerm,
    }),
    [searchTerm]
  );

  const { data: searchData, isFetching } = useQuery({
    queryKey: ["auditLogs", "search", searchFilters],
    queryFn: () => getFilteredAuditLogs(searchFilters),
    enabled: searchTerm.length >= 2,
  });

  const search = (term: string) => {
    setSearchTerm(term);
    setIsSearching(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
  };

  // Update results when data changes
  useMemo(() => {
    if (searchData?.items) {
      setSearchResults(searchData.items);
      setIsSearching(false);
    }
  }, [searchData]);

  return {
    searchTerm,
    searchResults,
    isSearching: isSearching || isFetching,
    search,
    clearSearch,
    hasResults: searchResults.length > 0,
    resultCount: searchResults.length,
  };
};

/**
 * Hook pentru filtrare avansată cu state local
 */
export const useAuditFilters = () => {
  const [activeFilters, setActiveFilters] = useState<
    Partial<AuditLogFilterDto>
  >({});

  const setActionFilter = (action?: AuditAction) => {
    setActiveFilters((prev) => ({ ...prev, action }));
  };

  const setUserFilter = (userId?: number) => {
    setActiveFilters((prev) => ({ ...prev, userId }));
  };

  const setTargetTypeFilter = (targetType?: AuditTargetType) => {
    setActiveFilters((prev) => ({ ...prev, targetType }));
  };

  const setDateRangeFilter = (from?: string, to?: string) => {
    setActiveFilters((prev) => ({ ...prev, from, to }));
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return {
    activeFilters,
    setActionFilter,
    setUserFilter,
    setTargetTypeFilter,
    setDateRangeFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
  };
};

/**
 * Hook pentru real-time audit monitoring
 */
export const useAuditMonitoring = (refreshInterval = 30000) => {
  // Obține statistici cu refresh automat
  const { data: stats } = useAuditStats();

  // Obține ultimele log-uri
  const { data: recentLogs } = useQuery({
    queryKey: ["auditLogs", "recent"],
    queryFn: () => getFilteredAuditLogs({ page: 1, pageSize: 10 }),
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
  });

  return {
    stats,
    recentLogs: recentLogs?.items || [],
    isMonitoring: true,
  };
};

/**
 * Hook pentru permisiuni audit log
 */
export const useAuditPermissions = () => {
  // În implementarea reală, acestea ar veni din contextul de auth
  // const { user } = useAuth();

  // Pentru demonstrație, returnez permisiuni statice
  const canViewAuditLogs = true; // user?.role === 'admin'
  const canExportAuditLogs = true; // user?.role === 'admin'
  const canViewUserActivity = true; // user?.role === 'admin' || user?.role === 'moderator'

  return {
    canViewAuditLogs,
    canExportAuditLogs,
    canViewUserActivity,
  };
};

/**
 * Hook pentru timeline view
 */
export const useAuditTimeline = (filters?: Partial<AuditLogFilterDto>) => {
  const { data: auditData, isLoading } = useFilteredAuditLogs(
    createAuditFilter({ ...filters, pageSize: 100 })
  );

  const timelineData = useMemo(() => {
    if (!auditData?.items) return [];

    return auditData.items.map((log: AuditLogReadDto) => ({
      id: log.id,
      timestamp: log.createdAt,
      action: log.action,
      userName: log.userId ? `User ${log.userId}` : "System",
      description: generateLogSummary(log),
      details: log.details,
      targetInfo: log.targetId
        ? {
            type: log.targetType,
            id: log.targetId,
          }
        : undefined,
    }));
  }, [auditData]);

  return {
    timelineData,
    isLoading,
    isEmpty: timelineData.length === 0,
  };
};

// Helper functions pentru timeline
const createAuditFilter = (
  overrides: Partial<AuditLogFilterDto> = {}
): AuditLogFilterDto => {
  return {
    page: 1,
    pageSize: 20,
    ...overrides,
  };
};

const generateLogSummary = (log: AuditLogReadDto): string => {
  const actionLabels: Record<string, string> = {
    CreateUser: "created a new user account",
    LoginSuccess: "logged in successfully",
    LoginFailed: "failed to log in",
    ChangePassword: "changed their password",
    ResetPassword: "reset their password",
    ResolveFlag: "resolved a content flag",
    DeleteFlag: "deleted a content flag",
    CreateKDom: "created a new K-Dom",
    ApproveKDom: "approved a K-Dom",
    RejectKDom: "rejected a K-Dom",
    EditKDom: "edited a K-Dom",
    DeletePost: "deleted a post",
    DeleteComment: "deleted a comment",
    ChangeRole: "changed a user's role",
    ApproveCollaboration: "approved a collaboration request",
    RejectCollaboration: "rejected a collaboration request",
    RemoveCollaborator: "removed a collaborator",
    DeleteKDom: "deleted a K-Dom",
    BulkApproveKDom: "bulk approved K-Doms",
    BulkRejectKDom: "bulk rejected K-Doms",
    ForceDeleteKDom: "force deleted a K-Dom",
    ViewModerationDashboard: "accessed the moderation dashboard",
    ViewUserModerationHistory: "viewed user moderation history",
    ResubmitKDom: "resubmitted a K-Dom",
  };

  const action = actionLabels[log.action] || log.action;
  const user = log.userId ? `User ${log.userId}` : "System";
  const target = log.targetId
    ? ` (${log.targetType}: ${log.targetId.substring(0, 8)}...)`
    : "";

  return `${user} ${action}${target}`;
};
