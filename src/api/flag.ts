// src/api/flag.ts - Updated API functions with content-specific messages
import API from "./axios";
import type { FlagCreateDto, FlagReadDto, FlagResponse } from "@/types/Flag";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Creează un flag pentru conținut
 */
export const createFlag = async (
  data: FlagCreateDto
): Promise<FlagResponse> => {
  const response = await API.post("/flags", data);
  return {
    success: true,
    message:
      response.data.message || getDefaultSuccessMessage(data.contentType),
  };
};

/**
 * Obține toate flag-urile (admin/moderator only)
 */
export const getAllFlags = async (): Promise<FlagReadDto[]> => {
  const response = await API.get("/flags");
  return response.data;
};

/**
 * Rezolvă un flag (admin/moderator only)
 */
export const resolveFlag = async (id: number): Promise<void> => {
  await API.post(`/flags/${id}/resolve`);
};

/**
 * Șterge un flag (admin only)
 */
export const deleteFlag = async (id: number): Promise<void> => {
  await API.delete(`/flags/${id}`);
};

// Helper function for default success messages
const getDefaultSuccessMessage = (contentType: string): string => {
  switch (contentType) {
    case "KDom":
      return "K-Dom reported successfully. Thank you for helping maintain quality content!";
    case "Post":
      return "Post reported successfully. Thank you for keeping discussions respectful!";
    case "Comment":
      return "Comment reported successfully. Thank you for maintaining constructive conversations!";
    default:
      return "Content reported successfully. Thank you for your feedback!";
  }
};

// Hook for flag operations with enhanced success handling
export const useFlagOperations = () => {
  const queryClient = useQueryClient();

  const createFlagMutation = useMutation({
    mutationFn: createFlag,
    onSuccess: (data, variables) => {
      // Invalidate any relevant queries
      queryClient.invalidateQueries({ queryKey: ["flags"] });

      // You can add additional success handling here based on content type
      console.log(
        `Successfully flagged ${variables.contentType}:`,
        data.message
      );
    },
    onError: (error: unknown) => {
      console.error("Error creating flag:", error);
    },
  });

  const resolveFlagMutation = useMutation({
    mutationFn: resolveFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
    },
  });

  const deleteFlagMutation = useMutation({
    mutationFn: deleteFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
    },
  });

  return {
    createFlag: createFlagMutation,
    resolveFlag: resolveFlagMutation,
    deleteFlag: deleteFlagMutation,
  };
};

// Enhanced hook specifically for K-Dom flagging
export const useKDomFlag = () => {
  const { createFlag } = useFlagOperations();

  const flagKDom = useMutation({
    mutationFn: async ({
      kdomId,
      reason,
    }: {
      kdomId: string;
      reason: string;
      title?: string;
    }) => {
      return createFlag.mutateAsync({
        contentType: "KDom",
        contentId: kdomId,
        reason,
      });
    },
    onSuccess: (data, variables) => {
      console.log(
        `K-Dom "${variables.title || variables.kdomId}" flagged successfully`
      );
    },
  });

  return {
    flagKDom: flagKDom.mutateAsync,
    isLoading: flagKDom.isPending,
    error: flagKDom.error,
  };
};
