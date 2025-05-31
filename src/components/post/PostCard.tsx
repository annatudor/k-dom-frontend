// src/components/post/PostCard.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Button,
  IconButton,
  Badge,
  Card,
  CardBody,
  useColorModeValue,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiHeart,
  FiMessageCircle,
  FiMoreVertical,
  FiEdit3,
  FiTrash2,
  FiFlag,
  FiShare,
  FiBookmark,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

import { toggleLikePost, deletePost } from "@/api/post";
import { useAuth } from "@/context/AuthContext";
import { PostComments } from "@/components/post/PostComments";
import { EditPostForm } from "@/components/post/EditPostForm";
import type { PostReadDto } from "@/types/Post";

interface PostCardProps {
  post: PostReadDto;
  showComments?: boolean;
  onUpdate?: () => void;
}

export function PostCard({
  post,
  showComments = false,
  onUpdate,
}: PostCardProps) {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [showCommentsSection, setShowCommentsSection] = useState(showComments);
  const [isLiked, setIsLiked] = useState(false); // TODO: Get from user data
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const {
    isOpen: isEditing,
    onOpen: startEditing,
    onClose: stopEditing,
  } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");

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
    // TODO: Implement sharing functionality
    toast({
      title: "Share functionality coming soon!",
      status: "info",
      duration: 3000,
    });
  };

  if (isEditing) {
    return (
      <EditPostForm
        post={post}
        onCancel={stopEditing}
        onSuccess={() => {
          stopEditing();
          onUpdate?.();
        }}
      />
    );
  }

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      transition="box-shadow 0.2s"
    >
      <CardBody p={6}>
        <VStack spacing={4} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="start">
            <HStack spacing={3} flex="1">
              <Avatar size="md" name={post.username} />
              <VStack align="start" spacing={1} flex="1">
                <HStack spacing={2} align="center">
                  <Text fontWeight="bold" fontSize="md">
                    {post.username}
                  </Text>
                  {post.isEdited && (
                    <Badge colorScheme="gray" size="sm">
                      edited
                    </Badge>
                  )}
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  {new Date(post.createdAt).toLocaleString()}
                  {post.isEdited && post.editedAt && (
                    <>
                      {" "}
                      • Last edited {new Date(post.editedAt).toLocaleString()}
                    </>
                  )}
                </Text>
              </VStack>
            </HStack>

            {/* Actions Menu */}
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
                aria-label="Post options"
              />
              <MenuList>
                {canModify && (
                  <>
                    <MenuItem icon={<FiEdit3 />} onClick={startEditing}>
                      Edit Post
                    </MenuItem>
                    <MenuItem
                      icon={<FiTrash2 />}
                      onClick={handleDelete}
                      color="red.500"
                    >
                      Delete Post
                    </MenuItem>
                    <Divider />
                  </>
                )}
                <MenuItem icon={<FiBookmark />}>Save Post</MenuItem>
                <MenuItem icon={<FiShare />} onClick={handleShare}>
                  Share
                </MenuItem>
                <MenuItem icon={<FiFlag />} color="red.500">
                  Report
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <HStack spacing={2} flexWrap="wrap">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  as={RouterLink}
                  to={`/kdom/${tag}`}
                  colorScheme="blue"
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="medium"
                  _hover={{ bg: "blue.100", textDecoration: "none" }}
                  cursor="pointer"
                >
                  #{tag}
                </Badge>
              ))}
            </HStack>
          )}

          {/* Content */}
          <Box color={textColor}>
            <Box
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              sx={{
                "& h1, & h2, & h3, & h4, & h5, & h6": {
                  fontWeight: "bold",
                  mb: 3,
                  mt: 4,
                  _first: { mt: 0 },
                },
                "& p": {
                  mb: 3,
                  lineHeight: "1.6",
                  _last: { mb: 0 },
                },
                "& ul, & ol": {
                  mb: 3,
                  pl: 6,
                },
                "& li": {
                  mb: 1,
                },
                "& blockquote": {
                  borderLeft: "4px solid",
                  borderColor: "blue.400",
                  pl: 4,
                  my: 3,
                  fontStyle: "italic",
                  bg: "blue.50",
                  py: 2,
                  borderRadius: "0 8px 8px 0",
                },
                "& code": {
                  bg: "gray.100",
                  px: 2,
                  py: 1,
                  borderRadius: "md",
                  fontSize: "sm",
                },
                "& pre": {
                  bg: "gray.100",
                  p: 4,
                  borderRadius: "md",
                  overflow: "auto",
                  my: 3,
                  "& code": {
                    bg: "transparent",
                    p: 0,
                  },
                },
                "& img": {
                  maxW: "100%",
                  borderRadius: "md",
                  my: 3,
                },
                "& a": {
                  color: "blue.500",
                  textDecoration: "underline",
                  _hover: { color: "blue.600" },
                },
              }}
            />
          </Box>

          {/* Action Buttons */}
          <HStack spacing={6} pt={2}>
            <Button
              leftIcon={<FiHeart />}
              variant="ghost"
              size="sm"
              colorScheme={isLiked ? "red" : "gray"}
              onClick={handleLike}
              isLoading={likeMutation.isPending}
              _hover={{
                bg: isLiked ? "red.50" : "gray.50",
                color: isLiked ? "red.600" : "gray.600",
              }}
            >
              {likeCount}
            </Button>

            <Button
              leftIcon={<FiMessageCircle />}
              variant="ghost"
              size="sm"
              colorScheme="gray"
              onClick={() => setShowCommentsSection(!showCommentsSection)}
              _hover={{ bg: "blue.50", color: "blue.600" }}
            >
              Comments
            </Button>

            <Button
              leftIcon={<FiShare />}
              variant="ghost"
              size="sm"
              colorScheme="gray"
              onClick={handleShare}
              _hover={{ bg: "green.50", color: "green.600" }}
            >
              Share
            </Button>
          </HStack>

          {/* Comments Section */}
          <Collapse in={showCommentsSection} animateOpacity>
            <Box pt={4} borderTop="1px solid" borderColor={borderColor}>
              <PostComments postId={post.id} />
            </Box>
          </Collapse>
        </VStack>
      </CardBody>
    </Card>
  );
}
