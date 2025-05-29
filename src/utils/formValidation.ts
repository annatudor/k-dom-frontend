// utils/formValidation.ts
import type { FormData } from "@/components/kdom/start-kdom/StartKDomForm";
import type { KDomCreateDto, Language, Hub, KDomTheme } from "@/types/KDom";

// Validare pentru Step 1 - KDomNameStep
export const validateNameStep = (
  formData: Pick<FormData, "kdomName" | "kdomUrl" | "language">
): string[] => {
  const errors: string[] = [];

  if (!formData.kdomName.trim()) {
    errors.push("K-Dom name is required");
  } else if (formData.kdomName.trim().length < 3) {
    errors.push("K-Dom name must be at least 3 characters");
  }

  if (!formData.kdomUrl.trim()) {
    errors.push("K-Dom URL is required");
  } else if (formData.kdomUrl.trim().length < 3) {
    errors.push("K-Dom URL must be at least 3 characters");
  } else {
    // Validare format URL (doar litere, cifre, cratimi și underscore)
    const urlRegex = /^[a-zA-Z0-9_-]+$/;
    if (!urlRegex.test(formData.kdomUrl.trim())) {
      errors.push(
        "K-Dom URL can only contain letters, numbers, hyphens and underscores"
      );
    }
  }

  if (!formData.language) {
    errors.push("Language selection is required");
  }

  return errors;
};

// Validare pentru Step 2 - KDomAboutStep
export const validateAboutStep = (
  formData: Pick<FormData, "description" | "hub">
): string[] => {
  const errors: string[] = [];

  if (!formData.description.trim()) {
    errors.push("Description is required");
  } else if (formData.description.trim().length < 50) {
    errors.push("Description must be at least 50 characters");
  }

  if (!formData.hub) {
    errors.push("Hub selection is required");
  }

  return errors;
};

// Validare pentru Step 3 - ThemeSelectionStep
export const validateThemeStep = (
  formData: Pick<FormData, "theme">
): string[] => {
  const errors: string[] = [];

  if (!formData.theme) {
    errors.push("Theme selection is required");
  }

  return errors;
};

// Verificare completare step
export const isStepComplete = (step: number, formData: FormData): boolean => {
  switch (step) {
    case 0: // Name step
      return validateNameStep(formData).length === 0;

    case 1: // About step
      return validateAboutStep(formData).length === 0;

    case 2: // Theme step
      return validateThemeStep(formData).length === 0;

    default:
      return false;
  }
};

// Transformă FormData în KDomCreateDto
export const mapFormDataToCreateDto = (formData: FormData): KDomCreateDto => {
  const dto = {
    title: formData.kdomName.trim(),
    slug: formData.kdomUrl.trim(),
    description: formData.description.trim(),
    hub: formData.hub as Hub,
    language: formData.language as Language,
    theme: formData.theme as KDomTheme,
    contentHtml: "",
    isForKids: formData.isForChildren,
  };
  console.log("Mapped DTO:", dto);
  return dto;
};

// Validare completă înainte de submit
export const validateCompleteForm = (formData: FormData): string[] => {
  return [
    ...validateNameStep(formData),
    ...validateAboutStep(formData),
    ...validateThemeStep(formData),
  ];
};

// Helper pentru calcularea progresului formularului
export const getFormProgress = (formData: FormData): number => {
  const completedSteps = [0, 1, 2].filter((step) =>
    isStepComplete(step, formData)
  );
  return Math.round((completedSteps.length / 3) * 100);
};
