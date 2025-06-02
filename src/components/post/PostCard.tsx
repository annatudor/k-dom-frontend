// src/components/post/PostCard.tsx - Cu restricții pentru view tracking
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
  Icon,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  FiHeart,
  FiMessageCircle,
  FiMoreVertical,
  FiEdit3,
  FiTrash2,
  FiShare,
  FiBookmark,
  FiExternalLink,
  FiHash,
  FiTag,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

import { toggleLikePost, deletePost } from "@/api/post";
import { useAuth } from "@/context/AuthContext";
import { UniversalComments } from "@/components/comments/UniversalComments";
import { EditPostForm } from "@/components/post/EditPostForm";
import { DeletePostDialog } from "@/components/post/DeletePostDialog";
import { FlagMenuItem } from "@/components/flag/FlagButton";
import { ViewCounter } from "@/components/view-tracking/ViewCounter";
import type { PostReadDto } from "@/types/Post";

interface PostCardProps {
  post: PostReadDto;
  showComments?: boolean;
  onUpdate?: () => void;
  enableViewTracking?: boolean;
}

export function PostCard({
  post,
  showComments = false,
  onUpdate,
  enableViewTracking = true,
}: PostCardProps) {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [showCommentsSection, setShowCommentsSection] = useState(showComments);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  const {
    isOpen: isEditing,
    onOpen: startEditing,
    onClose: stopEditing,
  } = useDisclosure();

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: openDeleteDialog,
    onClose: closeDeleteDialog,
  } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");

  // ✅ LOGICA DE PERMISIUNI pentru stats
  const canViewStats =
    user &&
    (user.id === post.userId || // Owner-ul postării
      user.role === "admin" ||
      user.role === "moderator");

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

  const handleDeleteConfirm = async () => {
    setIsDeletingPost(true);
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to delete post:", error);
    } finally {
      setIsDeletingPost(false);
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
    <>
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
                  <HStack spacing={3} fontSize="sm" color="gray.500">
                    <Text>
                      {new Date(post.createdAt).toLocaleString()}
                      {post.isEdited && post.editedAt && (
                        <>
                          {" "}
                          • Last edited{" "}
                          {new Date(post.editedAt).toLocaleString()}
                        </>
                      )}
                    </Text>
                    {/* ✅ VIEW COUNTER doar pentru owner/admin */}
                    {enableViewTracking && canViewStats && (
                      <ViewCounter
                        contentType="Post"
                        contentId={post.id}
                        variant="minimal"
                        size="sm"
                        enableTracking={true}
                      />
                    )}
                  </HStack>
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
                        onClick={openDeleteDialog}
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
                  <FlagMenuItem
                    contentType="Post"
                    contentId={post.id}
                    contentTitle={`Post by ${post.username}`}
                    contentOwnerId={post.userId}
                    onClose={() => {}}
                  />
                </MenuList>
              </Menu>
            </HStack>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <Box p={4} borderRadius="lg" borderWidth="1px">
                <VStack spacing={3} align="stretch">
                  <HStack spacing={2} align="center">
                    <Icon as={FiTag} color="blue.500" boxSize={4} />
                    <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                      Tagged in {post.tags.length} K-Dom
                      {post.tags.length > 1 ? "s" : ""}:
                    </Text>
                  </HStack>
                  <Wrap spacing={2}>
                    {post.tags.map((tag) => (
                      <WrapItem key={tag}>
                        <Badge
                          as={RouterLink}
                          to={`/kdoms/${tag}`}
                          colorScheme="blue"
                          variant="solid"
                          px={4}
                          py={2}
                          borderRadius="full"
                          fontSize="sm"
                          fontWeight="semibold"
                          _hover={{
                            bg: "blue.600",
                            textDecoration: "none",
                            transform: "translateY(-1px)",
                            boxShadow: "md",
                          }}
                          cursor="pointer"
                          transition="all 0.2s"
                          display="flex"
                          alignItems="center"
                          gap={2}
                        >
                          <Icon as={FiHash} boxSize={3} />
                          {tag}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
              </Box>
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
                    mb: 4,
                    pl: 6,
                  },
                  "& li": {
                    mb: 2,
                    lineHeight: "1.6",
                  },
                  "& blockquote": {
                    borderLeft: "4px solid",
                    borderColor: "blue.400",
                    pl: 4,
                    my: 4,
                    fontStyle: "italic",
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
                    my: 4,
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
                as={RouterLink}
                to={`/post/${post.id}`}
                leftIcon={<FiExternalLink />}
                variant="ghost"
                size="sm"
                colorScheme="gray"
                _hover={{ bg: "purple.50", color: "purple.600" }}
              >
                View Details
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

            <Collapse in={showCommentsSection} animateOpacity>
              <Box pt={4} borderTop="1px solid" borderColor={borderColor}>
                <UniversalComments targetType="Post" targetId={post.id} />
              </Box>
            </Collapse>
          </VStack>
        </CardBody>
      </Card>

      <DeletePostDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeletingPost}
        post={post}
      />
    </>
  );
}
