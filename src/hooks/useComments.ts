// src/hooks/useComments.ts

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";

import {
  getCommentsByTarget,
  createComment,
  editComment,
  deleteComment,
  toggleLikeComment,
} from "@/api/comment";
import { useAuth } from "@/context/AuthContext";

import type {
  CommentTargetType,
  CommentSortOption,
  CommentWithLikes,
  CommentWithReplies,
  CommentFormData,
  CommentPermissions,
  CommentsConfig,
  CommentContextType,
} from "@/types/CommentSystem";

import {
  organizeComments,
  sortComments,
  calculateCommentStats,
  updateCommentInTree,
  removeCommentFromTree,
} from "@/utils/commentUtils";

interface UseCommentsProps {
  targetType: CommentTargetType;
  targetId: string;
  config?: Partial<CommentsConfig>;
}

const defaultConfig: CommentsConfig = {
  allowReplies: true,
  maxReplyDepth: 3,
  showLikes: true,
  showEditTimestamp: true,
  sortOptions: ["newest", "oldest", "mostLiked"],
  defaultSort: "newest",
  enableMentions: true,
  maxCommentLength: 2000,
  placeholderText: "Write a comment...",
};

export function useComments({
  targetType,
  targetId,
  config: userConfig = {},
}: UseCommentsProps): CommentContextType {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Configurația finală
  const config = useMemo(
    () => ({
      ...defaultConfig,
      ...userConfig,
    }),
    [userConfig]
  );

  // State local
  const [sortBy, setSortBy] = useState<CommentSortOption>(config.defaultSort!);
  const [optimisticComments, setOptimisticComments] = useState<
    CommentWithReplies[]
  >([]);

  // Query pentru comentarii
  const {
    data: rawComments = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["comments", targetType, targetId],
    queryFn: () => getCommentsByTarget(targetType, targetId),
    staleTime: 30000, // 30 secunde
  });

  // Organizează și sortează comentariile
  const organizedComments = useMemo(() => {
    const comments = rawComments as CommentWithLikes[];
    const organized = organizeComments(comments);
    return sortComments(organized, sortBy);
  }, [rawComments, sortBy]);

  // Folosește comentariile optimiste dacă sunt disponibile
  const comments =
    optimisticComments.length > 0 ? optimisticComments : organizedComments;

  // Calculează statisticile
  const stats = useMemo(() => calculateCommentStats(comments), [comments]);

  // Permisiunile utilizatorului
  const permissions = useMemo((): CommentPermissions => {
    const isAdmin = user?.role === "admin";
    const isModerator = user?.role === "moderator";

    return {
      canComment: isAuthenticated,
      canEdit: isAuthenticated,
      canDelete: isAuthenticated || isAdmin || isModerator,
      canLike: isAuthenticated,
      canReply: isAuthenticated && config.allowReplies!,
      canModerate: isAdmin || isModerator,
    };
  }, [isAuthenticated, user, config.allowReplies]);

  // Actualizează comentariile optimiste când se schimbă datele sau sortarea
  useEffect(() => {
    setOptimisticComments(organizedComments);
  }, [organizedComments]);

  // Mutation pentru crearea comentariilor
  const createMutation = useMutation({
    mutationFn: createComment,
    onMutate: async (newCommentData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["comments", targetType, targetId],
      });

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticComment: CommentWithReplies = {
        id: tempId,
        targetType,
        targetId,
        userId: user!.id,
        username: user!.username,
        text: newCommentData.text,
        createdAt: new Date().toISOString(),
        isEdited: false,
        parentCommentId: newCommentData.parentCommentId || null,
        likes: [],
        likeCount: 0,
        isLikedByUser: false,
        replies: [],
        replyCount: 0,
      };

      setOptimisticComments((prev) => {
        if (optimisticComment.parentCommentId) {
          // Este un reply
          return updateCommentInTree(prev, optimisticComment.parentCommentId, {
            replies: [
              ...(findCommentReplies(prev, optimisticComment.parentCommentId) ||
                []),
              optimisticComment,
            ],
          });
        } else {
          // Este un comentariu principal
          return [optimisticComment, ...prev];
        }
      });

      return { tempId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", targetType, targetId],
      });
      toast({
        title: "Comment posted!",
        status: "success",
        duration: 3000,
      });
    },
    onError: (error, variables, context) => {
      // Revert optimistic update
      if (context?.tempId) {
        setOptimisticComments((prev) =>
          removeCommentFromTree(prev, context.tempId)
        );
      }

      toast({
        title: "Failed to post comment",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
      });
    },
    onSettled: () => {
      // Reset optimistic state
      setOptimisticComments([]);
    },
  });

  // Mutation pentru editarea comentariilor
  const editMutation = useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      editComment(commentId, { text }),
    onMutate: async ({ commentId, text }) => {
      setOptimisticComments((prev) =>
        updateCommentInTree(prev, commentId, {
          text,
          isEdited: true,
          editedAt: new Date().toISOString(),
        })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", targetType, targetId],
      });
      toast({
        title: "Comment updated!",
        status: "success",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Failed to update comment",
        status: "error",
        duration: 3000,
      });
    },
    onSettled: () => {
      setOptimisticComments([]);
    },
  });

  // Mutation pentru ștergerea comentariilor
  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onMutate: async (commentId) => {
      setOptimisticComments((prev) => removeCommentFromTree(prev, commentId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", targetType, targetId],
      });
      toast({
        title: "Comment deleted!",
        status: "success",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete comment",
        status: "error",
        duration: 3000,
      });
    },
    onSettled: () => {
      setOptimisticComments([]);
    },
  });

  // Mutation pentru like/unlike
  const likeMutation = useMutation({
    mutationFn: toggleLikeComment,
    onMutate: async (commentId) => {
      const comment = findCommentInTree(comments, commentId);
      if (!comment) return;

      const isCurrentlyLiked = comment.isLikedByUser;
      const newLikeCount = isCurrentlyLiked
        ? comment.likeCount - 1
        : comment.likeCount + 1;

      setOptimisticComments((prev) =>
        updateCommentInTree(prev, commentId, {
          isLikedByUser: !isCurrentlyLiked,
          likeCount: newLikeCount,
        })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", targetType, targetId],
      });
    },
    onError: () => {
      toast({
        title: "Failed to update like status",
        status: "error",
        duration: 3000,
      });
    },
    onSettled: () => {
      setOptimisticComments([]);
    },
  });

  // Helper functions
  const findCommentReplies = (
    commentList: CommentWithReplies[],
    parentId: string
  ): CommentWithReplies[] | null => {
    for (const comment of commentList) {
      if (comment.id === parentId) {
        return comment.replies || [];
      }
      if (comment.replies) {
        const found = findCommentReplies(comment.replies, parentId);
        if (found) return found;
      }
    }
    return null;
  };

  const findCommentInTree = (
    commentList: CommentWithReplies[],
    commentId: string
  ): CommentWithReplies | null => {
    for (const comment of commentList) {
      if (comment.id === commentId) {
        return comment;
      }
      if (comment.replies) {
        const found = findCommentInTree(comment.replies, commentId);
        if (found) return found;
      }
    }
    return null;
  };

  // Public API
  const addComment = useCallback(
    async (data: CommentFormData) => {
      if (!isAuthenticated) {
        toast({
          title: "Please log in to comment",
          status: "info",
          duration: 3000,
        });
        return;
      }

      createMutation.mutate({
        targetType,
        targetId,
        text: data.text,
        parentCommentId: data.parentCommentId ?? undefined,
      });
    },
    [isAuthenticated, createMutation, targetType, targetId, toast]
  );

  const editCommentAction = useCallback(
    async (commentId: string, text: string) => {
      editMutation.mutate({ commentId, text });
    },
    [editMutation]
  );

  const deleteCommentAction = useCallback(
    async (commentId: string) => {
      if (window.confirm("Are you sure you want to delete this comment?")) {
        deleteMutation.mutate(commentId);
      }
    },
    [deleteMutation]
  );

  const toggleLike = useCallback(
    async (commentId: string) => {
      if (!isAuthenticated) {
        toast({
          title: "Please log in to like comments",
          status: "info",
          duration: 3000,
        });
        return;
      }

      likeMutation.mutate(commentId);
    },
    [isAuthenticated, likeMutation, toast]
  );

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    comments,
    isLoading,
    error: queryError?.message || null,
    stats,
    permissions,
    config,
    sortBy,
    setSortBy,
    addComment,
    editComment: editCommentAction,
    deleteComment: deleteCommentAction,
    toggleLike,
    refresh,
  };
}
