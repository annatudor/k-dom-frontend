// hooks/useKDomData.ts
import { useQuery } from "@tanstack/react-query";
import { getLanguages, getThemes, getHubs } from "@/api/kdom";
import type { Language, Hub, KDomTheme } from "@/types/KDom";

// Hook pentru limbile disponibile
export const useLanguages = () => {
  return useQuery<Language[]>({
    queryKey: ["kdom", "languages"],
    queryFn: getLanguages,
    staleTime: 5 * 60 * 1000, // 5 minute // 10 minute
    retry: 2,
  });
};

// Hook pentru temele disponibile
export const useThemes = () => {
  return useQuery<KDomTheme[]>({
    queryKey: ["kdom", "themes"],
    queryFn: getThemes,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Hook pentru hub-urile disponibile
export const useHubs = () => {
  const result = useQuery<Hub[]>({
    queryKey: ["kdom", "hubs"],
    queryFn: getHubs,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  console.log("useThemes result:", result);
  return result;
};
