// utils/toastUtils.ts
import { useToast } from "@chakra-ui/react";

export const useKDomToasts = () => {
  const toast = useToast();

  return {
    // Toast pentru erori de validare
    showValidationErrors: (errors: string[]) => {
      errors.forEach((error, index) => {
        toast({
          title: "Validation Error",
          description: error,
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-right",
          id: `validation-error-${index}`, // Previne duplicate
        });
      });
    },

    // Toast pentru erori de API
    showApiError: (
      message: string = "Something went wrong. Please try again."
    ) => {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        id: "api-error",
      });
    },

    // Toast pentru succes la crearea K-Dom-ului
    showCreateSuccess: (kdomName: string) => {
      toast({
        title: "K-Dom Created Successfully!",
        description: `${kdomName} will go live once a moderator reviews it.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        id: "create-success",
      });
    },

    // Toast pentru loading (dacă e nevoie)
    showLoading: (message: string = "Creating your K-Dom...") => {
      toast({
        title: "Please wait",
        description: message,
        status: "info",
        duration: null, // Nu se închide automat
        isClosable: false,
        position: "top-right",
        id: "loading-toast",
      });
    },

    // Închide loading toast
    closeLoading: () => {
      toast.close("loading-toast");
    },

    // Toast pentru avertismente (step incomplet)
    showStepIncomplete: (stepName: string) => {
      toast({
        title: "Step Incomplete",
        description: `Please complete all required fields in ${stepName} step.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        id: "step-incomplete",
      });
    },
  };
};
