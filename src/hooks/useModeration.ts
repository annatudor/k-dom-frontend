// src/hooks/useModeration.ts - Actualizat conform backend-ului
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import {
  getModerationDashboard,
  getModerationStats,
  getRecentModerationActions,
  getTopModerators,
  approveKDom,
  rejectKDom,
  rejectAndDeleteKDom,
  forceDeleteKDom,
  bulkModerate,
  getUserModerationHistory,
  getUserKDomStatuses,
  getMyPendingKDoms,
  getMyRejectedKDoms,
  getMyQuickStats,
  getKDomStatus,
  getKDomPriority,
  canViewKDomStatus,
} from "@/api/moderation";
import type { BulkModerationDto } from "@/types/Moderation";

// ========================================
// ADMIN DASHBOARD HOOKS
// ========================================

export function useModerationDashboard() {
  const { user } = useAuth();
  const isModeratorOrAdmin =
    user?.role === "admin" || user?.role === "moderator";

  return useQuery({
    queryKey: ["moderation", "dashboard"],
    queryFn: getModerationDashboard,
    enabled: isModeratorOrAdmin,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useModerationStats() {
  const { user } = useAuth();
  const isModeratorOrAdmin =
    user?.role === "admin" || user?.role === "moderator";

  return useQuery({
    queryKey: ["moderation", "stats"],
    queryFn: getModerationStats,
    enabled: isModeratorOrAdmin,
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecentModerationActions(limit: number = 20) {
  const { user } = useAuth();
  const isModeratorOrAdmin =
    user?.role === "admin" || user?.role === "moderator";

  return useQuery({
    queryKey: ["moderation", "recent-actions", limit],
    queryFn: () => getRecentModerationActions(limit),
    enabled: isModeratorOrAdmin,
    refetchInterval: 2 * 60 * 1000, // 2 minutes
    staleTime: 60 * 1000,
  });
}

export function useTopModerators(days: number = 30, limit: number = 10) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["moderation", "top-moderators", days, limit],
    queryFn: () => getTopModerators(days, limit),
    enabled: isAdmin,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// ========================================
// ADMIN MODERATION ACTIONS
// ========================================

export function useModerationActions() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: approveKDom,
    onSuccess: () => {
      toast({
        title: "K-DOM Approved",
        description:
          "The K-DOM has been successfully approved and is now live.",
        status: "success",
        duration: 5000,
      });
      invalidateModerationQueries(queryClient);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Approval Failed",
        description: error.response?.data?.error || "Failed to approve K-DOM",
        status: "error",
        duration: 5000,
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      kdomId,
      reason,
      deleteAfterReject,
    }: {
      kdomId: string;
      reason: string;
      deleteAfterReject?: boolean;
    }) => rejectKDom(kdomId, { reason }, deleteAfterReject),
    onSuccess: (_, { deleteAfterReject }) => {
      toast({
        title: "K-DOM Rejected",
        description: deleteAfterReject
          ? "The K-DOM has been rejected and removed."
          : "The K-DOM has been rejected.",
        status: "info",
        duration: 5000,
      });
      invalidateModerationQueries(queryClient);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Rejection Failed",
        description: error.response?.data?.error || "Failed to reject K-DOM",
        status: "error",
        duration: 5000,
      });
    },
  });

  const rejectAndDeleteMutation = useMutation({
    mutationFn: ({ kdomId, reason }: { kdomId: string; reason: string }) =>
      rejectAndDeleteKDom(kdomId, { reason }),
    onSuccess: () => {
      toast({
        title: "K-DOM Rejected and Deleted",
        description: "The K-DOM has been rejected and permanently removed.",
        status: "warning",
        duration: 5000,
      });
      invalidateModerationQueries(queryClient);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Action Failed",
        description:
          error.response?.data?.error || "Failed to reject and delete K-DOM",
        status: "error",
        duration: 5000,
      });
    },
  });

  const forceDeleteMutation = useMutation({
    mutationFn: ({ kdomId, reason }: { kdomId: string; reason: string }) =>
      forceDeleteKDom(kdomId, { reason }),
    onSuccess: () => {
      toast({
        title: "K-DOM Force Deleted",
        description: "The K-DOM has been permanently removed by administrator.",
        status: "warning",
        duration: 5000,
      });
      invalidateModerationQueries(queryClient);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Force Delete Failed",
        description:
          error.response?.data?.error || "Failed to force delete K-DOM",
        status: "error",
        duration: 5000,
      });
    },
  });

  return {
    approveKDom: approveMutation.mutate,
    rejectKDom: rejectMutation.mutate,
    rejectAndDeleteKDom: rejectAndDeleteMutation.mutate,
    forceDeleteKDom: forceDeleteMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isRejectingAndDeleting: rejectAndDeleteMutation.isPending,
    isForceDeleting: forceDeleteMutation.isPending,
    isProcessing:
      approveMutation.isPending ||
      rejectMutation.isPending ||
      rejectAndDeleteMutation.isPending ||
      forceDeleteMutation.isPending,
  };
}

// ========================================
// BULK MODERATION
// ========================================

export function useBulkModeration() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedKDoms, setSelectedKDoms] = useState<string[]>([]);

  const bulkMutation = useMutation({
    mutationFn: bulkModerate,
    onSuccess: (result) => {
      const { successCount, failureCount, totalProcessed } = result;

      if (failureCount > 0) {
        toast({
          title: "Bulk Action Completed with Errors",
          description: `${successCount}/${totalProcessed} K-DOMs processed successfully. ${failureCount} failed.`,
          status: "warning",
          duration: 7000,
        });
      } else {
        toast({
          title: "Bulk Action Completed",
          description: `Successfully processed ${successCount} K-DOM(s).`,
          status: "success",
          duration: 5000,
        });
      }

      invalidateModerationQueries(queryClient);
      setSelectedKDoms([]);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Bulk Action Failed",
        description:
          error.response?.data?.error || "Failed to process bulk action",
        status: "error",
        duration: 5000,
      });
    },
  });

  const executeBulkAction = useCallback(
    (data: BulkModerationDto) => {
      if (data.kdomIds.length === 0) {
        toast({
          title: "No K-DOMs Selected",
          description: "Please select at least one K-DOM to moderate.",
          status: "warning",
          duration: 3000,
        });
        return;
      }

      bulkMutation.mutate(data);
    },
    [bulkMutation, toast]
  );

  const selectKDom = useCallback((kdomId: string, selected: boolean) => {
    setSelectedKDoms((prev) =>
      selected ? [...prev, kdomId] : prev.filter((id) => id !== kdomId)
    );
  }, []);

  const selectAllKDoms = useCallback((kdomIds: string[], selected: boolean) => {
    setSelectedKDoms((prev) =>
      selected
        ? [...new Set([...prev, ...kdomIds])]
        : prev.filter((id) => !kdomIds.includes(id))
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedKDoms([]);
  }, []);

  return {
    selectedKDoms,
    selectKDom,
    selectAllKDoms,
    clearSelection,
    executeBulkAction,
    isProcessing: bulkMutation.isPending,
    bulkResult: bulkMutation.data,
  };
}

// ========================================
// USER MODERATION HOOKS
// ========================================

export function useUserModerationHistory() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["moderation", "user-history", user?.id],
    queryFn: getUserModerationHistory,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUserKDomStatuses() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["moderation", "user-kdom-statuses", user?.id],
    queryFn: getUserKDomStatuses,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMyPendingKDoms() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["moderation", "my-pending-kdoms", user?.id],
    queryFn: getMyPendingKDoms,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useMyRejectedKDoms() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["moderation", "my-rejected-kdoms", user?.id],
    queryFn: getMyRejectedKDoms,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMyQuickStats() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["moderation", "my-quick-stats", user?.id],
    queryFn: getMyQuickStats,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useKDomModerationStatus(kdomId: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["moderation", "kdom-status", kdomId],
    queryFn: () => getKDomStatus(kdomId),
    enabled: isAuthenticated && !!kdomId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ========================================
// K-DOM PRIORITY & STATUS CHECKS
// ========================================

export function useKDomPriority(kdomId: string) {
  const { user } = useAuth();
  const isModeratorOrAdmin =
    user?.role === "admin" || user?.role === "moderator";

  return useQuery({
    queryKey: ["moderation", "priority", kdomId],
    queryFn: () => getKDomPriority(kdomId),
    enabled: isModeratorOrAdmin && !!kdomId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCanViewKDomStatus(kdomId: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["moderation", "can-view-status", kdomId],
    queryFn: () => canViewKDomStatus(kdomId),
    enabled: isAuthenticated && !!kdomId,
    staleTime: 10 * 60 * 1000,
  });
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function invalidateModerationQueries(
  queryClient: ReturnType<typeof useQueryClient>
) {
  // Invalidate all moderation-related queries
  queryClient.invalidateQueries({ queryKey: ["moderation"] });
  queryClient.invalidateQueries({ queryKey: ["kdom"] }); // Also refresh K-DOM data
}

// ========================================
// MODERATION PERMISSIONS
// ========================================

export function useModerationPermissions() {
  const { user } = useAuth();

  return {
    canModerate: user?.role === "admin" || user?.role === "moderator",
    canApprove: user?.role === "admin" || user?.role === "moderator",
    canReject: user?.role === "admin" || user?.role === "moderator",
    canForceDelete: user?.role === "admin",
    canViewStats: user?.role === "admin" || user?.role === "moderator",
    canViewDashboard: user?.role === "admin" || user?.role === "moderator",
    canBulkModerate: user?.role === "admin" || user?.role === "moderator",
    canManageFlags: user?.role === "admin" || user?.role === "moderator",
    canManageUsers: user?.role === "admin",
    isAdmin: user?.role === "admin",
    isModerator: user?.role === "moderator",
    isModeratorOrAdmin: user?.role === "admin" || user?.role === "moderator",
  };
}
