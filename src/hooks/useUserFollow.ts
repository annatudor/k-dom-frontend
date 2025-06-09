// src/hooks/useUserFollow.ts - FIXED VERSION
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowersCount,
  getFollowingCount,
} from "@/api/follow";
import { useAuth } from "@/context/AuthContext";

export function useUserFollow(targetUserId: number) {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  // ✅ Query pentru a verifica dacă urmărește utilizatorul
  const { data: isFollowing = false } = useQuery({
    queryKey: ["user-follow-status", targetUserId],
    queryFn: async () => {
      if (!isAuthenticated || user?.id === targetUserId) return false;

      const following = await getFollowing(user!.id);
      return following.some((u) => u.id === targetUserId);
    },
    enabled: isAuthenticated && user?.id !== targetUserId,
  });

  // ✅ FIX: Acum API-ul returnează direct numărul
  const { data: followersCountData = 0 } = useQuery({
    queryKey: ["user-followers-count", targetUserId],
    queryFn: () => getFollowersCount(targetUserId),
  });

  // ✅ FIX: Acum API-ul returnează direct numărul
  const { data: followingCountData = 0 } = useQuery({
    queryKey: ["user-following-count", targetUserId],
    queryFn: () => getFollowingCount(targetUserId),
  });

  // ✅ Mutation pentru follow/unfollow
  const followMutation = useMutation({
    mutationFn: (action: "follow" | "unfollow") =>
      action === "follow"
        ? followUser(targetUserId)
        : unfollowUser(targetUserId),
    onMutate: async (action) => {
      console.log(`[useUserFollow] ${action} mutation started`);

      // Optimistic update
      const newIsFollowing = action === "follow";
      const newFollowersCount = newIsFollowing
        ? followersCountData + 1
        : Math.max(0, followersCountData - 1);

      // Update cache optimistically
      queryClient.setQueryData(
        ["user-follow-status", targetUserId],
        newIsFollowing
      );
      queryClient.setQueryData(
        ["user-followers-count", targetUserId],
        newFollowersCount
      );

      return {
        previousIsFollowing: isFollowing,
        previousCount: followersCountData,
      };
    },
    onSuccess: (_, action) => {
      console.log(`[useUserFollow] ${action} mutation succeeded`);

      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["user-follow-status", targetUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-followers-count", targetUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-following-count", user?.id],
      });

      // ✅ FIX: Invalidează și profilul utilizatorului
      queryClient.invalidateQueries({
        queryKey: ["user-profile", targetUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", "me"],
      });

      toast({
        title: action === "follow" ? "Now following!" : "Unfollowed",
        description:
          action === "follow"
            ? "You are now following this user"
            : "You unfollowed this user",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error, action, context) => {
      console.error(`[useUserFollow] ${action} mutation failed:`, error);

      // Revert optimistic update
      if (context) {
        queryClient.setQueryData(
          ["user-follow-status", targetUserId],
          context.previousIsFollowing
        );
        queryClient.setQueryData(
          ["user-followers-count", targetUserId],
          context.previousCount
        );
      }

      toast({
        title: "Action failed",
        description: "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleToggleFollow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to follow users",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (user?.id === targetUserId) {
      toast({
        title: "Cannot follow yourself",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    followMutation.mutate(isFollowing ? "unfollow" : "follow");
  };

  const canFollow = isAuthenticated && user?.id !== targetUserId;

  // ✅ FIX: Asigură-te că returnezi primitive values, nu obiecte
  return {
    isFollowing,
    followersCount: followersCountData, // Asigură-te că este number
    followingCount: followingCountData, // Asigură-te că este number
    handleToggleFollow,
    isLoading: followMutation.isPending,
    canFollow,
  };
}

// Hook pentru lista de urmăritori/urmăriri
export function useUserFollowLists(userId: number) {
  const { data: followers = [] } = useQuery({
    queryKey: ["user-followers", userId],
    queryFn: () => getFollowers(userId),
  });

  const { data: following = [] } = useQuery({
    queryKey: ["user-following", userId],
    queryFn: () => getFollowing(userId),
  });

  return {
    followers,
    following,
  };
}
