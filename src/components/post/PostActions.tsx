// src/components/post/PostActions.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  VStack,
  Button,
  Card,
  CardBody,
  CardHeader,
  Text,
  useToast,
  useColorModeValue,
  Divider,
  Badge,
} from "@chakra-ui/react";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiBookmark,
  FiEdit3,
  FiTrash2,
  FiCopy,
} from "react-icons/fi";

import { toggleLikePost, deletePost } from "@/api/post";
import { useAuth } from "@/context/AuthContext";
import type { PostReadDto } from "@/types/Post";
import { FlagButton } from "@/components/flag/FlagButton";

interface PostActionsProps {
  post: PostReadDto;
  onEdit?: () => void;
  onUpdate?: () => void;
}

export function PostActions({ post, onEdit, onUpdate }: PostActionsProps) {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState(false); // TODO: Get from user data
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Check if current user can edit/delete this post
  const canModify =
    user &&
    (user.id === post.userId ||
      user.role === "admin" ||
      user.role === "moderator");

  // Mutation pentru like/unlike
  const likeMutation = useMutation({
    mutationFn: () => toggleLikePost(post.id),
    onSuccess: (response) => {
      setIsLiked(response.liked);
      setLikeCount(response.likeCount);
      queryClient.invalidateQueries({ queryKey: ["post", post.id] });
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
    mutationFn: () => deletePost(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post deleted successfully",
        status: "success",
        duration: 3000,
      });
      onUpdate?.();
    },
    onError: () => {
      toast({
        title: "Failed to delete post",
        status: "error",
        duration: 3000,
      });
    },
  });

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

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      deleteMutation.mutate();
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied to clipboard!",
      status: "success",
      duration: 3000,
    });
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Post link copied!",
      status: "success",
      duration: 2000,
    });
  };

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="sm"
      position="sticky"
      top="100px"
    >
      <CardHeader pb={3}>
        <Text fontSize="lg" fontWeight="bold">
          Actions
        </Text>
      </CardHeader>
      <CardBody pt={3}>
        <VStack spacing={4} align="stretch">
          {/* Primary Actions */}
          <VStack spacing={3} align="stretch">
            <Button
              leftIcon={<FiHeart />}
              colorScheme={isLiked ? "red" : "gray"}
              variant={isLiked ? "solid" : "outline"}
              onClick={handleLike}
              isLoading={likeMutation.isPending}
              justifyContent="flex-start"
              rightIcon={
                <Badge colorScheme={isLiked ? "red" : "gray"}>
                  {likeCount}
                </Badge>
              }
            >
              {isLiked ? "Liked" : "Like"}
            </Button>

            <Button
              leftIcon={<FiMessageCircle />}
              variant="outline"
              colorScheme="blue"
              justifyContent="flex-start"
              onClick={() => {
                const commentsSection = document.getElementById("comments");
                commentsSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Jump to Comments
            </Button>

            <Button
              leftIcon={<FiShare2 />}
              variant="outline"
              colorScheme="green"
              onClick={handleShare}
              justifyContent="flex-start"
            >
              Share Post
            </Button>
          </VStack>

          <Divider />

          {/* Secondary Actions */}
          <VStack spacing={2} align="stretch">
            <Button
              leftIcon={<FiCopy />}
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              justifyContent="flex-start"
            >
              Copy Link
            </Button>

            <Button
              leftIcon={<FiBookmark />}
              variant="ghost"
              size="sm"
              justifyContent="flex-start"
            >
              Save Post
            </Button>

            <FlagButton
              contentType="Post"
              contentId={post.id}
              contentTitle={`Post by ${post.username}`}
              contentOwnerId={post.userId} // ← IMPORTANT: Adaugă ID-ul autorului
              variant="ghost"
              size="sm"
              showLabel={true}
            />
          </VStack>

          {/* Moderation Actions */}
          {canModify && (
            <>
              <Divider />
              <VStack spacing={2} align="stretch">
                <Text fontSize="sm" fontWeight="semibold" color="orange.600">
                  Moderation
                </Text>
                <Button
                  leftIcon={<FiEdit3 />}
                  variant="outline"
                  colorScheme="orange"
                  size="sm"
                  onClick={onEdit}
                  justifyContent="flex-start"
                >
                  Edit Post
                </Button>
                <Button
                  leftIcon={<FiTrash2 />}
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  onClick={handleDelete}
                  isLoading={deleteMutation.isPending}
                  justifyContent="flex-start"
                >
                  Delete Post
                </Button>
              </VStack>
            </>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
