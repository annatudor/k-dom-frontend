// src/hooks/useUserAdmin.ts - Hooks pentru administrarea utilizatorilor
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import {
  getAllUsers,
  changeUserRole,
  getUserProfile,
  getUserKdoms,
  updateUserProfile,
  getUserPrivateInfo,
  getUserDetailedStats,
  quickSearchUsers,
} from "@/api/userAdmin";
import type {
  UserFilterDto,
  ChangeUserRoleDto,
  UserPublicDto,
} from "@/types/User";

// ========================================
// USER LISTING & SEARCH
// ========================================

/**
 * Hook pentru obținerea utilizatorilor cu paginare și filtrare
 */
export function useUsers(initialFilter: UserFilterDto) {
  const { user } = useAuth();
  const [filter, setFilter] = useState<UserFilterDto>(initialFilter);

  const isAdmin = user?.role === "admin";

  const query = useQuery({
    queryKey: ["admin", "users", filter],
    queryFn: () => getAllUsers(filter),
    enabled: isAdmin,
    staleTime: 30000, // 30 seconds
  });

  const updateFilter = (newFilter: Partial<UserFilterDto>) => {
    setFilter((prev) => ({
      ...prev,
      ...newFilter,
      page: newFilter.page ?? 1, // Reset to page 1 when filtering
    }));
  };

  const goToPage = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  const resetFilter = () => {
    setFilter({
      page: 1,
      pageSize: 20,
    });
  };

  return {
    ...query,
    filter,
    updateFilter,
    goToPage,
    resetFilter,
  };
}

/**
 * Hook pentru căutarea rapidă de utilizatori
 */
export function useUserSearch() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserPublicDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const isAdmin = user?.role === "admin";

  const searchMutation = useMutation({
    mutationFn: ({ query, limit }: { query: string; limit?: number }) =>
      quickSearchUsers(query, limit),
    onMutate: () => {
      setIsSearching(true);
    },
    onSuccess: (data) => {
      setSearchResults(data.results);
      setIsSearching(false);
    },
    onError: () => {
      setSearchResults([]);
      setIsSearching(false);
    },
  });

  const search = (query: string, limit?: number) => {
    setSearchQuery(query);
    if (query.trim().length >= 2 && isAdmin) {
      searchMutation.mutate({ query: query.trim(), limit });
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
    search,
    clearSearch,
    canSearch: isAdmin,
  };
}

// ========================================
// USER DETAILS & PROFILE
// ========================================

/**
 * Hook pentru obținerea detaliilor unui utilizator
 */
export function useUserDetails(userId: number | null) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const profileQuery = useQuery({
    queryKey: ["admin", "user", userId, "profile"],
    queryFn: () => getUserProfile(userId!),
    enabled: isAdmin && userId !== null,
  });

  const kdomsQuery = useQuery({
    queryKey: ["admin", "user", userId, "kdoms"],
    queryFn: () => getUserKdoms(userId!),
    enabled: isAdmin && userId !== null,
  });

  const privateInfoQuery = useQuery({
    queryKey: ["admin", "user", userId, "private"],
    queryFn: () => getUserPrivateInfo(userId!),
    enabled: isAdmin && userId !== null,
  });

  const statsQuery = useQuery({
    queryKey: ["admin", "user", userId, "stats"],
    queryFn: () => getUserDetailedStats(userId!),
    enabled: isAdmin && userId !== null,
  });

  return {
    profile: profileQuery.data,
    kdoms: kdomsQuery.data,
    privateInfo: privateInfoQuery.data,
    stats: statsQuery.data,
    isLoading:
      profileQuery.isLoading ||
      kdomsQuery.isLoading ||
      privateInfoQuery.isLoading ||
      statsQuery.isLoading,
    error:
      profileQuery.error ||
      kdomsQuery.error ||
      privateInfoQuery.error ||
      statsQuery.error,
  };
}

// ========================================
// USER ACTIONS
// ========================================

/**
 * Hook pentru acțiunile administrative asupra utilizatorilor
 */
export function useUserActions() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const changeRoleMutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number;
      data: ChangeUserRoleDto;
    }) => changeUserRole(userId, data),
    onSuccess: (_, variables) => {
      toast({
        title: "Role Updated",
        description: `User's role has been successfully changed to ${variables.data.newRole}.`,
        status: "success",
        duration: 5000,
      });
      invalidateUserQueries(queryClient);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Role Change Failed",
        description:
          error.response?.data?.error || "Failed to change user role",
        status: "error",
        duration: 5000,
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: unknown }) =>
      updateUserProfile(userId, data),
    onSuccess: (_, variables) => {
      toast({
        title: "Profile Updated",
        description: `User profile has been updated successfully.`,
        status: "success",
        duration: 4000,
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "user", variables.userId],
      });
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast({
        title: "Profile Update Failed",
        description:
          error.response?.data?.error || "Failed to update user profile",
        status: "error",
        duration: 5000,
      });
    },
  });

  return {
    changeRole: changeRoleMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    isChangingRole: changeRoleMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isProcessing:
      changeRoleMutation.isPending || updateProfileMutation.isPending,
  };
}

// ========================================
// USER PERMISSIONS
// ========================================

/**
 * Hook pentru verificarea permisiunilor de administrare utilizatori
 */
export function useUserAdminPermissions() {
  const { user } = useAuth();

  return {
    canViewUsers: user?.role === "admin",
    canEditUsers: user?.role === "admin",
    canChangeRoles: user?.role === "admin",
    canViewPrivateInfo: user?.role === "admin",
    canViewDetailedStats: user?.role === "admin",
    isAdmin: user?.role === "admin",
  };
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Invalidează toate query-urile legate de utilizatori
 */
function invalidateUserQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
}

/**
 * Hook pentru statistici rapide despre utilizatori
 */
export function useUserStatsQuick() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Folosim primul rezultat din lista de utilizatori pentru statistici rapide
  const { data: usersData } = useQuery({
    queryKey: ["admin", "users", { page: 1, pageSize: 1 }],
    queryFn: () =>
      getAllUsers({
        page: 1,
        pageSize: 1,
      }),
    enabled: isAdmin,
    staleTime: 60000, // 1 minute
  });

  return {
    totalUsers: usersData?.totalCount || 0,
    isLoading: !usersData,
  };
}
