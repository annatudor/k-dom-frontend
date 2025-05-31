// src/hooks/usePostData.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { getPostById, toggleLikePost, deletePost } from "@/api/post";
import { useAuth } from "@/context/AuthContext";

export function usePostData(postId: string) {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query pentru postare
  const {
    data: post,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
    retry: false,
  });

  // Mutation pentru like/unlike
  const likeMutation = useMutation({
    mutationFn: () => toggleLikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast({
        title: "Failed to update like status",
        status: "error",
        duration: 3000,
      });
    },
  });

  // Mutation pentru ștergerea postării
  const deleteMutation = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post deleted successfully",
        status: "success",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete post",
        status: "error",
        duration: 3000,
      });
    },
  });

  // Helper functions
  const handleLike = () => {
    if (!user) {
      toast({
        title: "Please log in to like posts",
        status: "info",
        duration: 3000,
      });
      return;
    }
    likeMutation.mutate();
  };

  const handleDelete = (onSuccess?: () => void) => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      deleteMutation.mutate(undefined, {
        onSuccess,
      });
    }
  };

  const canModify =
    user &&
    post &&
    (user.id === post.userId ||
      user.role === "admin" ||
      user.role === "moderator");

  return {
    post,
    isLoading,
    error,
    refetch,
    likeMutation,
    deleteMutation,
    handleLike,
    handleDelete,
    canModify,
  };
}
