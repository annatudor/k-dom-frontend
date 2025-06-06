// src/hooks/useFlags.ts - Hooks pentru flag management
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import {
  createFlag,
  getAllFlags,
  resolveFlag,
  removeFlaggedContent,
  deleteFlag,
  getFlagStats,
} from "@/api/flag";
import type { FlagCreateDto, ContentRemovalDto } from "@/types/Flag";

// ========================================
// BASIC FLAG OPERATIONS
// ========================================

/**
 * Hook pentru obținerea tuturor flag-urilor (admin/moderator)
 */
export function useFlags() {
  const { user } = useAuth();
  const isModeratorOrAdmin =
    user?.role === "admin" || user?.role === "moderator";

  return useQuery({
    queryKey: ["flags"],
    queryFn: getAllFlags,
    enabled: isModeratorOrAdmin,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider stale after 10 seconds
  });
}

/**
 * Hook pentru obținerea statisticilor flag-urilor
 */
export function useFlagStats() {
  const { user } = useAuth();
  const isModeratorOrAdmin =
    user?.role === "admin" || user?.role === "moderator";

  return useQuery({
    queryKey: ["flags", "stats"],
    queryFn: getFlagStats,
    enabled: isModeratorOrAdmin,
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Consider stale after 30 seconds
  });
}

// ========================================
// FLAG ACTIONS
// ========================================

/**
 * Hook pentru acțiunile de moderare a flag-urilor
 */
export function useFlagActions() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const resolveMutation = useMutation({
    mutationFn: resolveFlag,
    onSuccess: () => {
      toast({
        title: "Flag Resolved",
        description:
          "The flag has been marked as resolved. Content remains available.",
        status: "success",
        duration: 4000,
      });
      invalidateFlagQueries(queryClient);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Resolution Failed",
        description: error.response?.data?.error || "Failed to resolve flag",
        status: "error",
        duration: 5000,
      });
    },
  });

  const removeContentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContentRemovalDto }) =>
      removeFlaggedContent(id, data),
    onSuccess: () => {
      toast({
        title: "Content Removed",
        description:
          "The flagged content has been removed and the author has been notified.",
        status: "warning",
        duration: 5000,
      });
      invalidateFlagQueries(queryClient);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Removal Failed",
        description: error.response?.data?.error || "Failed to remove content",
        status: "error",
        duration: 5000,
      });
    },
  });

  const deleteFlagMutation = useMutation({
    mutationFn: deleteFlag,
    onSuccess: () => {
      toast({
        title: "Flag Deleted",
        description: "The flag has been permanently deleted.",
        status: "info",
        duration: 4000,
      });
      invalidateFlagQueries(queryClient);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Deletion Failed",
        description: error.response?.data?.error || "Failed to delete flag",
        status: "error",
        duration: 5000,
      });
    },
  });

  const createFlagMutation = useMutation({
    mutationFn: createFlag,
    onSuccess: (data) => {
      toast({
        title: "Content Reported",
        description: data.message,
        status: "success",
        duration: 5000,
      });
      invalidateFlagQueries(queryClient);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Report Failed",
        description: error.response?.data?.error || "Failed to report content",
        status: "error",
        duration: 5000,
      });
    },
  });

  return {
    resolveFlag: resolveMutation.mutate,
    removeContent: removeContentMutation.mutate,
    deleteFlag: deleteFlagMutation.mutate,
    createFlag: createFlagMutation.mutate,
    isResolving: resolveMutation.isPending,
    isRemoving: removeContentMutation.isPending,
    isDeleting: deleteFlagMutation.isPending,
    isCreating: createFlagMutation.isPending,
    isProcessing:
      resolveMutation.isPending ||
      removeContentMutation.isPending ||
      deleteFlagMutation.isPending ||
      createFlagMutation.isPending,
  };
}

// ========================================
// ENHANCED FLAG OPERATIONS
// ========================================

/**
 * Hook pentru crearea unui flag cu opțiuni avansate
 */
export function useCreateFlag() {
  const { createFlag, isCreating } = useFlagActions();

  const submitFlag = (data: FlagCreateDto) => {
    // Validări suplimentare
    if (!data.contentId || !data.contentType || !data.reason.trim()) {
      throw new Error("All fields are required");
    }

    if (data.reason.trim().length < 10) {
      throw new Error(
        "Please provide a more detailed reason (at least 10 characters)"
      );
    }

    createFlag(data);
  };

  return {
    submitFlag,
    isSubmitting: isCreating,
  };
}

/**
 * Hook pentru permissions de flag
 */
export function useFlagPermissions() {
  const { user } = useAuth();

  return {
    canViewFlags: user?.role === "admin" || user?.role === "moderator",
    canResolveFlags: user?.role === "admin" || user?.role === "moderator",
    canRemoveContent: user?.role === "admin" || user?.role === "moderator",
    canDeleteFlags: user?.role === "admin",
    canCreateFlags: !!user, // Orice utilizator autentificat
    isAdmin: user?.role === "admin",
    isModerator: user?.role === "moderator",
    isModeratorOrAdmin: user?.role === "admin" || user?.role === "moderator",
  };
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Invalidează toate query-urile legate de flag-uri
 */
function invalidateFlagQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["flags"] });
}

/**
 * Hook pentru filtrarea flag-urilor
 */
export function useFilteredFlags(
  statusFilter?: "pending" | "resolved" | "all"
) {
  const { data: flagsData, ...rest } = useFlags();

  const filteredFlags = flagsData
    ? statusFilter === "pending"
      ? flagsData.pending
      : statusFilter === "resolved"
      ? flagsData.resolved
      : [...flagsData.pending, ...flagsData.resolved]
    : [];

  return {
    flags: filteredFlags,
    summary: flagsData?.summary,
    ...rest,
  };
}
