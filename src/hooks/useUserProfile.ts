// src/hooks/useUserProfile.ts
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
import type { UserProfileUpdateDto } from "@/types/User";

// Hook pentru profilul utilizatorului curent
export function useMyProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["user-profile", "me"],
    queryFn: getMyProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pentru profilul oricărui utilizator (prin ID)
export function useUserProfile(userId?: number) {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pentru actualizarea profilului
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserProfileUpdateDto) => updateMyProfile(data),
    onSuccess: () => {
      // Invalidează cache-ul pentru profil
      queryClient.invalidateQueries({ queryKey: ["user-profile", "me"] });
    },
  });
}

// Hook pentru K-Dom-urile utilizatorului
export function useMyKdoms() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["user-kdoms", "me"],
    queryFn: getMyKdoms,
    enabled: isAuthenticated,
  });
}

// Hook pentru K-Dom-urile recent vizualizate
export function useRecentlyViewedKdoms() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["recently-viewed-kdoms"],
    queryFn: getRecentlyViewedKdoms,
    enabled: isAuthenticated,
  });
}

// Hook pentru statisticile de colaborare
export function useCollaborationStats() {
  const { isAuthenticated } = useAuth();

  const sentRequestsQuery = useQuery({
    queryKey: ["collaboration-requests", "sent"],
    queryFn: getSentRequests,
    enabled: isAuthenticated,
  });

  const receivedRequestsQuery = useQuery({
    queryKey: ["collaboration-requests", "received"],
    queryFn: getReceivedRequests,
    enabled: isAuthenticated,
  });

  return {
    sentRequests: sentRequestsQuery.data,
    receivedRequests: receivedRequestsQuery.data,
    isLoading: sentRequestsQuery.isLoading || receivedRequestsQuery.isLoading,
    error: sentRequestsQuery.error || receivedRequestsQuery.error,
  };
}

// Hook pentru followers/following
export function useFollowStats(userId?: number) {
  const followersQuery = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getFollowers(userId!),
    enabled: !!userId,
  });

  const followingQuery = useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowing(userId!),
    enabled: !!userId,
  });

  return {
    followers: followersQuery.data || [],
    following: followingQuery.data || [],
    followersCount: followersQuery.data?.length || 0,
    followingCount: followingQuery.data?.length || 0,
    isLoading: followersQuery.isLoading || followingQuery.isLoading,
    error: followersQuery.error || followingQuery.error,
  };
}
