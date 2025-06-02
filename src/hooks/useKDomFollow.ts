import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import {
  followKDom,
  unfollowKDom,
  isKDomFollowed,
  getFollowedKdoms,
  getKDomFollowersCount,
} from "@/api/kdomFollow";
import { useAuth } from "@/context/AuthContext";

export function useKDomFollow(kdomId: string) {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query pentru a verifica dacă urmărește K-Dom-ul
  const { data: isFollowing = false } = useQuery({
    queryKey: ["kdom-follow-status", kdomId],
    queryFn: () => isKDomFollowed(kdomId),
    enabled: isAuthenticated && !!kdomId,
  });

  // Query pentru numărul de urmăritori K-Dom
  const { data: followersCount = 0 } = useQuery({
    queryKey: ["kdom-followers-count", kdomId],
    queryFn: () => getKDomFollowersCount(kdomId),
    enabled: !!kdomId,
  });

  // Mutation pentru follow/unfollow K-Dom
  const followMutation = useMutation({
    mutationFn: (action: "follow" | "unfollow") =>
      action === "follow" ? followKDom(kdomId) : unfollowKDom(kdomId),
    onMutate: async (action) => {
      // Optimistic update
      const newIsFollowing = action === "follow";
      const newFollowersCount = newIsFollowing
        ? followersCount + 1
        : followersCount - 1;

      queryClient.setQueryData(["kdom-follow-status", kdomId], newIsFollowing);
      queryClient.setQueryData(
        ["kdom-followers-count", kdomId],
        newFollowersCount
      );

      return {
        previousIsFollowing: isFollowing,
        previousCount: followersCount,
      };
    },
    onSuccess: (_, action) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["kdom-follow-status", kdomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["kdom-followers-count", kdomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["followed-kdoms"],
      });

      toast({
        title: action === "follow" ? "Following K-Dom!" : "Unfollowed K-Dom",
        description:
          action === "follow"
            ? "You are now following this K-Dom"
            : "You unfollowed this K-Dom",
        status: "success",
        duration: 3000,
      });
    },
    onError: (error, action, context) => {
      // Revert optimistic update
      if (context) {
        queryClient.setQueryData(
          ["kdom-follow-status", kdomId],
          context.previousIsFollowing
        );
        queryClient.setQueryData(
          ["kdom-followers-count", kdomId],
          context.previousCount
        );
      }

      toast({
        title: "Action failed",
        description: "Please try again later",
        status: "error",
        duration: 3000,
      });
    },
  });

  const handleToggleFollow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to follow K-Doms",
        status: "info",
        duration: 3000,
      });
      return;
    }

    followMutation.mutate(isFollowing ? "unfollow" : "follow");
  };

  return {
    isFollowing,
    followersCount,
    handleToggleFollow,
    isLoading: followMutation.isPending,
    canFollow: isAuthenticated,
  };
}

// Hook pentru K-Dom-urile urmărite
export function useFollowedKDoms() {
  const { isAuthenticated } = useAuth();

  const { data: followedKDoms = [], isLoading } = useQuery({
    queryKey: ["followed-kdoms"],
    queryFn: getFollowedKdoms,
    enabled: isAuthenticated,
  });

  return {
    followedKDoms,
    isLoading,
  };
}
