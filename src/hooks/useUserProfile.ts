// src/hooks/useUserProfile.ts - VERSIUNEA CORECTĂ
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  getMyProfile,
  updateMyProfile,
  getUserProfile,
  getMyKdoms,
  getRecentlyViewedKdoms,
} from "@/api/user";
import { getSentRequests, getReceivedRequests } from "@/api/collaboration";
import { getFollowers, getFollowing } from "@/api/follow";
import type {
  UserProfileUpdateDto,
  UserProfileReadDto, // ✅ ADĂUGAT: Import corect pentru tipul de return
} from "@/types/User";

// ✅ FIX: Hook pentru profilul utilizatorului curent - returnează UserProfileReadDto
export function useMyProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery<UserProfileReadDto>({
    // ✅ EXPLICIT: Tip generic pentru claritate
    queryKey: ["user-profile", "me"],
    queryFn: getMyProfile, // Returnează UserProfileReadDto
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3, // ✅ ÎMBUNĂTĂȚIRE: Retry în caz de eroare
  });
}

// ✅ FIX: Hook pentru profilul oricărui utilizator (prin ID) - returnează UserProfileReadDto
export function useUserProfile(userId?: number) {
  return useQuery<UserProfileReadDto>({
    // ✅ EXPLICIT: Tip generic pentru claritate
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 2, // ✅ ÎMBUNĂTĂȚIRE: Mai puține retry-uri pentru profile externe
  });
}

// ✅ CORECT: Hook pentru actualizarea profilului - primește UserProfileUpdateDto
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UserProfileUpdateDto>({
    // ✅ EXPLICIT: Tipuri generice
    mutationFn: (data: UserProfileUpdateDto) => updateMyProfile(data),
    onSuccess: () => {
      // ✅ ÎMBUNĂTĂȚIRE: Invalidează cache-ul pentru profil
      queryClient.invalidateQueries({ queryKey: ["user-profile", "me"] });

      // ✅ BONUS: Invalidează și alte query-uri relevante
      queryClient.invalidateQueries({ queryKey: ["user-kdoms", "me"] });
      queryClient.invalidateQueries({ queryKey: ["recently-viewed-kdoms"] });
    },
    onError: (error) => {
      // ✅ ÎMBUNĂTĂȚIRE: Log pentru debugging
      console.error("Profile update failed:", error);
    },
  });
}

// ✅ CORECT: Hook pentru K-Dom-urile utilizatorului
export function useMyKdoms() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["user-kdoms", "me"],
    queryFn: getMyKdoms,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // ✅ ÎMBUNĂTĂȚIRE: Cache mai lung pentru K-Doms
  });
}

// ✅ CORECT: Hook pentru K-Dom-urile recent vizualizate
export function useRecentlyViewedKdoms() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["recently-viewed-kdoms"],
    queryFn: getRecentlyViewedKdoms,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // ✅ ÎMBUNĂTĂȚIRE: Cache mai scurt pentru recent viewed
  });
}

// ✅ ÎMBUNĂTĂȚIRE: Hook pentru statisticile de colaborare cu error handling
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
    // ✅ BONUS: Status individual pentru debugging
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

// ✅ ÎMBUNĂTĂȚIRE: Hook pentru followers/following cu tipare corecte
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
    // ✅ BONUS: Refresh functions
    refetchFollowers: followersQuery.refetch,
    refetchFollowing: followingQuery.refetch,
  };
}

// ✅ NOU: Hook pentru verificarea permisiunilor profilului
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

// ✅ FIX: Hook complex pentru gestionarea completă a profilului - FĂRĂ violarea Rules of Hooks
export function useCompleteProfile(userId?: number) {
  const { user: currentUser } = useAuth();
  const isOwnProfile = !userId || currentUser?.id === userId;

  // ✅ SOLUȚIE: Apelează TOATE hook-urile necondiționat
  const myProfileQuery = useMyProfile();
  const userProfileQuery = useUserProfile(userId);
  const kdomsQuery = useMyKdoms();
  const recentKdomsQuery = useRecentlyViewedKdoms();
  const collaborationStats = useCollaborationStats();
  const followStats = useFollowStats(userId || currentUser?.id);
  const permissions = useProfilePermissions(userId);

  // ✅ Alege rezultatul corect bazat pe logică, NU pe hook-uri condiționale
  const profileQuery = isOwnProfile ? myProfileQuery : userProfileQuery;

  return {
    // Date principale
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,

    // Date auxiliare (doar pentru profilul propriu)
    kdoms: isOwnProfile ? kdomsQuery.data : undefined,
    recentKdoms: isOwnProfile ? recentKdomsQuery.data : undefined,
    collaborationStats: isOwnProfile ? collaborationStats : undefined,

    // Follow stats
    followStats,

    // Permisiuni
    permissions,

    // Funcții de refresh
    refetch: profileQuery.refetch,
    refetchAll: () => {
      // ✅ Refresh toate query-urile relevante
      if (isOwnProfile) {
        myProfileQuery.refetch();
        kdomsQuery.refetch();
        recentKdomsQuery.refetch();
      } else {
        userProfileQuery.refetch();
      }
      followStats.refetchFollowers();
      followStats.refetchFollowing();
    },

    // ✅ BONUS: Acces la query-urile individuale pentru debugging
    queries: {
      myProfile: myProfileQuery,
      userProfile: userProfileQuery,
      kdoms: kdomsQuery,
      recentKdoms: recentKdomsQuery,
      collaboration: collaborationStats,
      follow: followStats,
    },
  };
}

// ✅ ALTERNATIVĂ: Hook-uri separate pentru cazuri specifice
export function useMyCompleteProfile() {
  const myProfileQuery = useMyProfile();
  const kdomsQuery = useMyKdoms();
  const recentKdomsQuery = useRecentlyViewedKdoms();
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
    collaborationStats,
    followStats,
    permissions,
    refetchAll: () => {
      myProfileQuery.refetch();
      kdomsQuery.refetch();
      recentKdomsQuery.refetch();
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
