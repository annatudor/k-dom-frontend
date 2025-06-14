// src/hooks/useExploreKDoms.ts
import { useQuery } from "@tanstack/react-query";
import { exploreKDoms } from "@/api/explore";
import type { ExploreFilterDto } from "@/types/Explore";

export function useExploreKDoms(filters: Partial<ExploreFilterDto> = {}) {
  return useQuery({
    queryKey: ["explore-kdoms", filters],
    queryFn: () => exploreKDoms(filters),
    staleTime: 300000, // 5 minutes
    placeholderData: (previousData) => previousData, // Replace keepPreviousData
  });
}
