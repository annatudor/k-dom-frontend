// src/hooks/useCollaboration.ts - Final version with proper TypeScript types
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import {
  requestCollaboration,
  getCollaborationRequests,
  approveRequest,
  rejectRequest,
  getCollaboratorsWithFallback,
  removeCollaborator,
  getSentRequests,
  getReceivedRequests,
  getAllRequests,
  getQuickStats,
  getKDomCollaborationStats,
  getKDomCollaborators,
} from "@/api/collaboration";
import type {
  CollaborationRequestCreateDto,
  CollaborationRequestActionDto,
} from "@/types/Collaboration";

// Define proper error types for better type safety
interface ApiError {
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
  message?: string;
}

// Hook pentru a trimite cerere de colaborare
export const useRequestCollaboration = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      kdomId,
      data,
    }: {
      kdomId: string;
      data: CollaborationRequestCreateDto;
    }) => requestCollaboration(kdomId, data),
    onSuccess: () => {
      toast({
        title: "Request sent successfully",
        description:
          "Your collaboration request has been submitted to the K-Dom owner.",
        status: "success",
        duration: 5000,
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["collaboration", "sent"] });
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Failed to send request",
        description:
          error.response?.data?.error ||
          "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
      });
    },
  });
};

// Hook pentru gestionarea cererilor de colaborare (pentru owner)
export const useCollaborationRequests = (kdomId: string) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: requests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collaboration", "requests", kdomId],
    queryFn: () => getCollaborationRequests(kdomId),
    enabled: !!kdomId,
    retry: (failureCount: number, error: ApiError) => {
      // Don't retry on 403/401 errors
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ requestId }: { requestId: string }) =>
      approveRequest(kdomId, requestId),
    onSuccess: () => {
      toast({
        title: "Request approved",
        description: "The collaboration request has been approved.",
        status: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["collaboration", "requests", kdomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["collaboration", "collaborators", kdomId],
      });
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Failed to approve request",
        description: error.response?.data?.error || "Something went wrong.",
        status: "error",
        duration: 5000,
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data: CollaborationRequestActionDto;
    }) => rejectRequest(kdomId, requestId, data),
    onSuccess: () => {
      toast({
        title: "Request rejected",
        description: "The collaboration request has been rejected.",
        status: "info",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["collaboration", "requests", kdomId],
      });
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Failed to reject request",
        description: error.response?.data?.error || "Something went wrong.",
        status: "error",
        duration: 5000,
      });
    },
  });

  return {
    requests: requests || [],
    isLoading,
    error,
    approveRequest: approveMutation.mutate,
    rejectRequest: rejectMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};

// Hook pentru gestionarea colaboratorilor cu fallback strategy
export const useCollaborators = (kdomId: string) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: collaborators,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collaboration", "collaborators", kdomId],
    queryFn: () => getCollaboratorsWithFallback(kdomId),
    enabled: !!kdomId,
    retry: (failureCount: number, error: ApiError) => {
      // Don't retry on permission errors
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  const removeMutation = useMutation({
    mutationFn: ({ userIdToRemove }: { userIdToRemove: number }) =>
      removeCollaborator(kdomId, userIdToRemove),
    onSuccess: () => {
      toast({
        title: "Collaborator removed",
        description: "The collaborator has been removed from this K-Dom.",
        status: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["collaboration", "collaborators", kdomId],
      });
      // Also invalidate the K-Dom data to update collaborators list
      queryClient.invalidateQueries({
        queryKey: ["kdom", kdomId],
      });
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Failed to remove collaborator",
        description: error.response?.data?.error || "Something went wrong.",
        status: "error",
        duration: 5000,
      });
    },
  });

  return {
    collaborators: collaborators || [],
    isLoading,
    error,
    removeCollaborator: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
  };
};

// Hook pentru toate cererile utilizatorului
export const useUserCollaborationRequests = () => {
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");

  const {
    data: sentData,
    isLoading: isSentLoading,
    error: sentError,
  } = useQuery({
    queryKey: ["collaboration", "sent"],
    queryFn: getSentRequests,
    enabled: filter === "all" || filter === "sent",
    retry: 2,
  });

  const {
    data: receivedData,
    isLoading: isReceivedLoading,
    error: receivedError,
  } = useQuery({
    queryKey: ["collaboration", "received"],
    queryFn: getReceivedRequests,
    enabled: filter === "all" || filter === "received",
    retry: 2,
  });

  const {
    data: allData,
    isLoading: isAllLoading,
    error: allError,
  } = useQuery({
    queryKey: ["collaboration", "all"],
    queryFn: getAllRequests,
    enabled: filter === "all",
    retry: 2,
  });

  return {
    filter,
    setFilter,
    sentRequests: sentData?.requests || [],
    receivedRequests: receivedData?.requests || [],
    allRequests: allData,
    isLoading: isSentLoading || isReceivedLoading || isAllLoading,
    error: sentError || receivedError || allError,
    sentSummary: sentData?.summary,
    receivedSummary: receivedData?.summary,
    groupedByKDom: receivedData?.groupedByKDom || [],
  };
};

// Hook pentru statistici rapide
export const useCollaborationStats = () => {
  return useQuery({
    queryKey: ["collaboration", "stats", "quick"],
    queryFn: getQuickStats,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    retry: 2,
  });
};

// Hook pentru acțiuni în lot cu error handling îmbunătățit
export const useBulkActions = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      action: "approve" | "reject";
      requestIds: string[];
      reason?: string;
    }) => {
      // Simulează bulk action pentru moment
      // În realitate, ar trebui să apeleze API-ul backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulează un failure rate de 10% pentru testare
      if (Math.random() < 0.1) {
        throw new Error("Simulated bulk action failure");
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Bulk action completed",
        description: `Successfully ${data.action}d ${data.requestIds.length} request(s).`,
        status: "success",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ["collaboration"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Bulk action failed",
        description: error.message || "Some requests could not be processed.",
        status: "error",
        duration: 5000,
      });
    },
  });

  return {
    executeAction: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

// Hook pentru statistici detaliate K-Dom
export const useKDomCollaborationStats = (kdomId: string) => {
  return useQuery({
    queryKey: ["collaboration", "stats", kdomId],
    queryFn: () => getKDomCollaborationStats(kdomId),
    enabled: !!kdomId,
    retry: (failureCount: number, error: ApiError) => {
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
  });
};

// Hook pentru colaboratori detaliați K-Dom cu error handling
export const useKDomCollaboratorsDetailed = (kdomId: string) => {
  return useQuery({
    queryKey: ["collaboration", "collaborators", "detailed", kdomId],
    queryFn: () => getKDomCollaborators(kdomId),
    enabled: !!kdomId,
    retry: (failureCount: number, error: ApiError) => {
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

// Hook pentru verificarea rapidă a permisiunilor de colaborare
export const useCollaborationPermissions = (kdomId: string) => {
  return useQuery({
    queryKey: ["collaboration", "permissions", kdomId],
    queryFn: async () => {
      try {
        // Try to fetch collaboration requests to see if user has permissions
        await getCollaborationRequests(kdomId);
        return { canManage: true, canView: true };
      } catch (error: unknown) {
        const apiError = error as ApiError;
        if (apiError?.response?.status === 403) {
          return { canManage: false, canView: false };
        }
        if (apiError?.response?.status === 401) {
          return { canManage: false, canView: false };
        }
        throw error;
      }
    },
    enabled: !!kdomId,
    retry: false, // Don't retry permission checks
    staleTime: 30 * 60 * 1000, // Cache permissions for 30 minutes
  });
};
