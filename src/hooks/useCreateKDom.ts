// hooks/useCreateKDom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createKDom } from "@/api/kdom";
import type { KDomCreateDto } from "@/types/KDom";
import { useKDomToasts } from "@/utils/toastUtils";

interface CreateKDomOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreateKDom = (options?: CreateKDomOptions) => {
  const queryClient = useQueryClient();
  const { showCreateSuccess, showApiError } = useKDomToasts();

  return useMutation({
    mutationFn: (data: KDomCreateDto) => createKDom(data),
    onSuccess: (_, variables) => {
      // Invalidez cache-ul pentru K-Dom-urile utilizatorului
      queryClient.invalidateQueries({ queryKey: ["kdoms"] });

      // Afișez toast de succes
      showCreateSuccess(variables.title);

      // Callback custom
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Failed to create K-Dom:", error);

      // Afișez toast de eroare
      const errorMessage =
        error.message || "Failed to create K-Dom. Please try again.";
      showApiError(errorMessage);

      // Callback custom
      options?.onError?.(error);
    },
  });
};
