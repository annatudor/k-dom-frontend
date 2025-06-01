// src/hooks/useProfileData.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import {
  getUserProfile,
  getUserProfileStats,
  getProfileTabData,
  updateMyProfile as updateUserProfile,
  checkIfFollowing,
} from "@/api/profile";
import { followUser, unfollowUser } from "@/api/follow";
import { useAuth } from "@/context/AuthContext";

export function useProfileData(userId: number) {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query pentru datele de bază ale profilului
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    retry: false,
  });

  // Query pentru statistici
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["profile-stats", userId],
    queryFn: () => getUserProfileStats(userId),
    enabled: !!userId,
  });

  // Query pentru tab data
  const { data: tabData, isLoading: isLoadingTabs } = useQuery({
    queryKey: ["profile-tabs", userId],
    queryFn: () => getProfileTabData(userId),
    enabled: !!userId,
  });

  // Query pentru verificarea follow status
  const { data: isFollowing = false } = useQuery({
    queryKey: ["is-following", userId],
    queryFn: () => checkIfFollowing(userId),
    enabled: !!user && !!userId && user.id !== userId,
  });

  // Mutation pentru follow/unfollow
  const followMutation = useMutation({
    mutationFn: (action: "follow" | "unfollow") =>
      action === "follow" ? followUser(userId) : unfollowUser(userId),
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["is-following", userId] });

      toast({
        title: action === "follow" ? "Now following!" : "Unfollowed",
        description:
          action === "follow"
            ? `You are now following ${profileData?.username}`
            : `You unfollowed ${profileData?.username}`,
        status: "success",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Action failed",
        description: "Please try again later",
        status: "error",
        duration: 3000,
      });
    },
  });

  // Mutation pentru actualizarea profilului
  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      toast({
        title: "Profile updated!",
        status: "success",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Please try again later",
        status: "error",
        duration: 3000,
      });
    },
  });

  // Helper functions
  const handleFollow = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to follow users",
        status: "info",
        duration: 3000,
      });
      return;
    }
    followMutation.mutate(isFollowing ? "unfollow" : "follow");
  };

  const canEdit = user && profileData && user.id === profileData.userId;
  const isOwnProfile = user && profileData && user.id === profileData.userId;

  return {
    // Data
    profileData,
    statsData,
    tabData,
    isFollowing,

    // Loading states
    isLoadingProfile,
    isLoadingStats,
    isLoadingTabs,
    isLoading: isLoadingProfile || isLoadingStats || isLoadingTabs,

    // Error states
    profileError,

    // Mutations
    followMutation,
    updateMutation,

    // Helper functions
    handleFollow,

    // Permissions
    canEdit,
    isOwnProfile,
  };
}
