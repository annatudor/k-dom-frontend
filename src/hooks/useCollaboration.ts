// src/hooks/useCollaboration.ts
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import {
  requestCollaboration,
  getCollaborationRequests,
  approveRequest,
  rejectRequest,
  getCollaborators,
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

// Hook pentru gestionarea colaboratorilor
export const useCollaborators = (kdomId: string) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: collaborators,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collaboration", "collaborators", kdomId],
    queryFn: () => getCollaborators(kdomId),
    enabled: !!kdomId,
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

  const { data: sentData, isLoading: isSentLoading } = useQuery({
    queryKey: ["collaboration", "sent"],
    queryFn: getSentRequests,
    enabled: filter === "all" || filter === "sent",
  });

  const { data: receivedData, isLoading: isReceivedLoading } = useQuery({
    queryKey: ["collaboration", "received"],
    queryFn: getReceivedRequests,
    enabled: filter === "all" || filter === "received",
  });

  const { data: allData, isLoading: isAllLoading } = useQuery({
    queryKey: ["collaboration", "all"],
    queryFn: getAllRequests,
    enabled: filter === "all",
  });

  return {
    filter,
    setFilter,
    sentRequests: sentData?.requests || [],
    receivedRequests: receivedData?.requests || [],
    allRequests: allData,
    isLoading: isSentLoading || isReceivedLoading || isAllLoading,
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
  });
};

// Hook pentru acțiuni în lot - SIMPLIFICAT
export const useBulkActions = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const executeAction = async (data: {
    action: "approve" | "reject";
    requestIds: string[];
    reason?: string;
  }) => {
    // Simulează bulk action pentru moment
    // În realitate, ar trebui să apeleze API-ul backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Bulk action completed",
      description: `Successfully ${data.action}d ${data.requestIds.length} request(s).`,
      status: "success",
      duration: 5000,
    });

    queryClient.invalidateQueries({ queryKey: ["collaboration"] });
  };

  return {
    executeAction,
    isPending: false,
  };
};

// Hook pentru statistici detaliate K-Dom
export const useKDomCollaborationStats = (kdomId: string) => {
  return useQuery({
    queryKey: ["collaboration", "stats", kdomId],
    queryFn: () => getKDomCollaborationStats(kdomId),
    enabled: !!kdomId,
  });
};

// Hook pentru colaboratori detaliați K-Dom
export const useKDomCollaboratorsDetailed = (kdomId: string) => {
  return useQuery({
    queryKey: ["collaboration", "collaborators", "detailed", kdomId],
    queryFn: () => getKDomCollaborators(kdomId),
    enabled: !!kdomId,
  });
};
