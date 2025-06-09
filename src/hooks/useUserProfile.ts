// src/hooks/useUserProfile.ts - VERSIUNEA ACTUALIZATĂ conform API-ului nou
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  // ✅ ACTUALIZAT: Import-uri conform noului API
  getMyProfile,
  updateMyProfile,
  getUserProfile,
  getMyKdoms,
  getRecentlyViewedKdoms,
  getMyPrivateInfo,
  addRecentlyViewedKdom,
  canUpdateProfile,
  getMyDetailedStats,
  isCurrentUserAdmin,
  isCurrentUserAdminOrModerator,
  getRecentlyViewedKDomIds,
  validateUpdatePermissions,
} from "@/api/user";
import { getSentRequests, getReceivedRequests } from "@/api/collaboration";
import { getFollowers, getFollowing } from "@/api/follow";
import type { UserProfileUpdateDto, UserProfileReadDto } from "@/types/User";

// ✅ HOOK 1: Profilul utilizatorului curent - folosește noul endpoint
export function useMyProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery<UserProfileReadDto>({
    queryKey: ["user-profile", "me"],
    queryFn: getMyProfile, // ✅ Folosește "/profile/my-profile"
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

// ✅ HOOK 2: Profilul oricărui utilizator (prin ID) - endpoint public
export function useUserProfile(userId?: number) {
  return useQuery<UserProfileReadDto>({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile(userId!), // ✅ Folosește "/users/{userId}/profile"
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ✅ HOOK 3: Actualizarea profilului - folosește noul endpoint
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UserProfileUpdateDto>({
    mutationFn: (data: UserProfileUpdateDto) => updateMyProfile(data), // ✅ Folosește "/profile/edit-profile"
    onSuccess: () => {
      // Invalidează cache-ul pentru profil
      queryClient.invalidateQueries({ queryKey: ["user-profile", "me"] });
      queryClient.invalidateQueries({ queryKey: ["user-kdoms", "me"] });
      queryClient.invalidateQueries({ queryKey: ["recently-viewed-kdoms"] });
      queryClient.invalidateQueries({ queryKey: ["profile-private-info"] });
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    },
  });
}

// ✅ HOOK 4: K-Dom-urile utilizatorului curent
export function useMyKdoms() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["user-kdoms", "me"],
    queryFn: getMyKdoms, // ✅ Folosește "/profile/my-kdoms"
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  });
}

// ✅ HOOK 5: K-Dom-urile recent vizualizate
export function useRecentlyViewedKdoms() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["recently-viewed-kdoms"],
    queryFn: getRecentlyViewedKdoms, // ✅ Folosește "/profile/recently-viewed-kdoms"
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

// ✅ HOOK 6 NOU: Informații private ale utilizatorului curent
export function useMyPrivateInfo() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["profile-private-info"],
    queryFn: getMyPrivateInfo, // ✅ NOU: "/profile/private"
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  });
}

// ✅ HOOK 7 NOU: Statistici detaliate pentru utilizatorul curent
export function useMyDetailedStats() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["profile-detailed-stats"],
    queryFn: getMyDetailedStats, // ✅ NOU: "/profile/detailed-stats"
    enabled: isAuthenticated,
    staleTime: 15 * 60 * 1000, // Cache mai lung pentru statistici
  });
}

// ✅ HOOK 8 NOU: Verifică dacă utilizatorul curent este admin
export function useIsAdmin() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["user-is-admin"],
    queryFn: isCurrentUserAdmin, // ✅ NOU: "/profile/is-admin"
    enabled: isAuthenticated,
    staleTime: 30 * 60 * 1000, // Cache lung pentru roluri
  });
}

// ✅ HOOK 9 NOU: Verifică dacă utilizatorul curent este admin sau moderator
export function useIsAdminOrModerator() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["user-is-admin-or-moderator"],
    queryFn: isCurrentUserAdminOrModerator, // ✅ NOU: "/profile/is-admin-or-moderator"
    enabled: isAuthenticated,
    staleTime: 30 * 60 * 1000, // Cache lung pentru roluri
  });
}

// ✅ HOOK 10 NOU: ID-urile K-Dom-urilor recent vizualizate
export function useRecentlyViewedKDomIds() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["recently-viewed-kdom-ids"],
    queryFn: getRecentlyViewedKDomIds, // ✅ NOU: "/profile/recently-viewed-ids"
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

// ✅ HOOK 11 NOU: Mutation pentru adăugarea unui K-Dom la recent vizualizate
export function useAddRecentlyViewedKdom() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (kdomId: string) => addRecentlyViewedKdom(kdomId), // ✅ NOU: POST "/profile/recently-viewed/{kdomId}"
    onSuccess: () => {
      // Invalidează cache-ul pentru recent viewed
      queryClient.invalidateQueries({ queryKey: ["recently-viewed-kdoms"] });
      queryClient.invalidateQueries({ queryKey: ["recently-viewed-kdom-ids"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile", "me"] });
    },
  });
}

// ✅ HOOK 12 NOU: Verifică dacă utilizatorul poate actualiza un profil
export function useCanUpdateProfile(targetUserId?: number) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["can-update-profile", targetUserId],
    queryFn: () => canUpdateProfile(targetUserId!), // ✅ NOU: "/profile/can-update/{targetUserId}"
    enabled: isAuthenticated && !!targetUserId,
    staleTime: 10 * 60 * 1000,
  });
}

// ✅ HOOK 13: Statisticile de colaborare cu error handling îmbunătățit
export function useCollaborationStats() {
  const { isAuthenticated } = useAuth();

  const sentRequestsQuery = useQuery({
    queryKey: ["collaboration-requests", "sent"],
    queryFn: getSentRequests,
    enabled: isAuthenticated,
    retry: 2,
  });

  const receivedRequestsQuery = useQuery({
    queryKey: ["collaboration-requests", "received"],
    queryFn: getReceivedRequests,
    enabled: isAuthenticated,
    retry: 2,
  });

  return {
    sentRequests: sentRequestsQuery.data,
    receivedRequests: receivedRequestsQuery.data,
    isLoading: sentRequestsQuery.isLoading || receivedRequestsQuery.isLoading,
    error: sentRequestsQuery.error || receivedRequestsQuery.error,
    sentStatus: {
      isLoading: sentRequestsQuery.isLoading,
      error: sentRequestsQuery.error,
      isSuccess: sentRequestsQuery.isSuccess,
    },
    receivedStatus: {
      isLoading: receivedRequestsQuery.isLoading,
      error: receivedRequestsQuery.error,
      isSuccess: receivedRequestsQuery.isSuccess,
    },
  };
}

export function useFollowStats(userId?: number) {
  const followersQuery = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getFollowers(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const followingQuery = useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowing(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    followers: followersQuery.data || [],
    following: followingQuery.data || [],
    followersCount: followersQuery.data?.length || 0,
    followingCount: followingQuery.data?.length || 0,
    isLoading: followersQuery.isLoading || followingQuery.isLoading,
    error: followersQuery.error || followingQuery.error,
    refetchFollowers: followersQuery.refetch,
    refetchFollowing: followingQuery.refetch,
  };
}

export function useProfilePermissions(targetUserId?: number) {
  const { user: currentUser } = useAuth();

  const isOwnProfile = !targetUserId || currentUser?.id === targetUserId;
  const canEdit = isOwnProfile || currentUser?.role === "admin";
  const canViewPrivateInfo =
    isOwnProfile || ["admin", "moderator"].includes(currentUser?.role || "");

  return {
    isOwnProfile,
    canEdit,
    canViewPrivateInfo,
    canViewStats: canViewPrivateInfo,
    canChangeRole: currentUser?.role === "admin",
  };
}

export function useCompleteProfile(userId?: number) {
  const { user: currentUser } = useAuth();
  const isOwnProfile = !userId || currentUser?.id === userId;

  const myProfileQuery = useMyProfile();
  const userProfileQuery = useUserProfile(userId);
  const kdomsQuery = useMyKdoms();
  const recentKdomsQuery = useRecentlyViewedKdoms();
  const privateInfoQuery = useMyPrivateInfo();
  const detailedStatsQuery = useMyDetailedStats();
  const collaborationStats = useCollaborationStats();
  const followStats = useFollowStats(userId || currentUser?.id);
  const permissions = useProfilePermissions(userId);

  const profileQuery = isOwnProfile ? myProfileQuery : userProfileQuery;

  return {
    // Date principale
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,

    // Date auxiliare (doar pentru profilul propriu)
    kdoms: isOwnProfile ? kdomsQuery.data : undefined,
    recentKdoms: isOwnProfile ? recentKdomsQuery.data : undefined,
    privateInfo: isOwnProfile ? privateInfoQuery.data : undefined,
    detailedStats: isOwnProfile ? detailedStatsQuery.data : undefined,
    collaborationStats: isOwnProfile ? collaborationStats : undefined,

    // Follow stats
    followStats,

    // Permisiuni
    permissions,

    // Funcții de refresh
    refetch: profileQuery.refetch,
    refetchAll: () => {
      if (isOwnProfile) {
        myProfileQuery.refetch();
        kdomsQuery.refetch();
        recentKdomsQuery.refetch();
        privateInfoQuery.refetch();
        detailedStatsQuery.refetch();
      } else {
        userProfileQuery.refetch();
      }
      followStats.refetchFollowers();
      followStats.refetchFollowing();
    },

    // ✅ Acces la query-urile individuale pentru debugging
    queries: {
      myProfile: myProfileQuery,
      userProfile: userProfileQuery,
      kdoms: kdomsQuery,
      recentKdoms: recentKdomsQuery,
      privateInfo: privateInfoQuery,
      detailedStats: detailedStatsQuery,
      collaboration: collaborationStats,
      follow: followStats,
    },
  };
}

// ✅ HOOK 17: Hook-uri separate pentru cazuri specifice - ACTUALIZATE
export function useMyCompleteProfile() {
  const myProfileQuery = useMyProfile();
  const kdomsQuery = useMyKdoms();
  const recentKdomsQuery = useRecentlyViewedKdoms();
  const privateInfoQuery = useMyPrivateInfo(); // ✅ NOU
  const detailedStatsQuery = useMyDetailedStats(); // ✅ NOU
  const collaborationStats = useCollaborationStats();
  const { user } = useAuth();
  const followStats = useFollowStats(user?.id);
  const permissions = useProfilePermissions();

  return {
    profile: myProfileQuery.data,
    isLoading: myProfileQuery.isLoading,
    error: myProfileQuery.error,
    kdoms: kdomsQuery.data,
    recentKdoms: recentKdomsQuery.data,
    privateInfo: privateInfoQuery.data, // ✅ NOU
    detailedStats: detailedStatsQuery.data, // ✅ NOU
    collaborationStats,
    followStats,
    permissions,
    refetchAll: () => {
      myProfileQuery.refetch();
      kdomsQuery.refetch();
      recentKdomsQuery.refetch();
      privateInfoQuery.refetch(); // ✅ NOU
      detailedStatsQuery.refetch(); // ✅ NOU
    },
  };
}

export function useOtherUserProfile(userId: number) {
  const userProfileQuery = useUserProfile(userId);
  const followStats = useFollowStats(userId);
  const permissions = useProfilePermissions(userId);

  return {
    profile: userProfileQuery.data,
    isLoading: userProfileQuery.isLoading,
    error: userProfileQuery.error,
    followStats,
    permissions,
    refetch: userProfileQuery.refetch,
  };
}

// ✅ HOOK 18 NOU: Hook specialized pentru validarea permisiunilor
export function useValidateUpdatePermissions() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, number>({
    mutationFn: (targetUserId: number) =>
      validateUpdatePermissions(targetUserId), // ✅ NOU
    onSuccess: () => {
      // Invalidează cache-ul pentru permisiuni
      queryClient.invalidateQueries({ queryKey: ["can-update-profile"] });
    },
  });
}
