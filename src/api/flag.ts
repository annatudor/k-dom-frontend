// src/api/flag.ts - API functions pentru flag
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
    message: response.data.message || "Content flagged successfully",
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

export const useFlagOperations = () => {
  const queryClient = useQueryClient();

  const createFlagMutation = useMutation({
    mutationFn: createFlag,
    onSuccess: () => {
      // Invalidate any relevant queries
      queryClient.invalidateQueries({ queryKey: ["flags"] });
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
