// src/components/post/PostComments.tsx
import {
  VStack,
  HStack,
  Box,
  Text,
  Avatar,
  Button,
  Textarea,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Spinner,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiMoreVertical,
  FiHeart,
  FiCornerUpRight,
  FiFlag,
  FiEdit3,
  FiTrash2,
  FiSend,
} from "react-icons/fi";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getCommentsByTarget,
  createComment,
  toggleLikeComment,
  editComment,
  deleteComment,
} from "@/api/comment";
import { useAuth } from "@/context/AuthContext";
import type { CommentCreateDto, CommentEditDto } from "@/types/Comment";

interface PostCommentsProps {
  postId: string;
}

export function PostComments({ postId }: PostCommentsProps) {
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const toast = useToast();
  const queryClient = useQueryClient();

  const bgColor = useColorModeValue("gray.50", "gray.700");

  // Query pentru comentarii
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", "Post", postId],
    queryFn: () => getCommentsByTarget("Post", postId),
  });

  // Mutation pentru crearea comentariilor
  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", "Post", postId] });
      setNewComment("");
      setReplyingTo(null);
      setReplyText("");
      toast({
        title: "Comment posted!",
        status: "success",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Failed to post comment",
        status: "error",
        duration: 3000,
      });
    },
  });

  // Mutation pentru like/unlike comentarii
  const likeCommentMutation = useMutation({
    mutationFn: toggleLikeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", "Post", postId] });
    },
  });

  // Mutation pentru editarea comentariilor
  const editCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string;
      data: CommentEditDto;
    }) => editComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", "Post", postId] });
      setEditingComment(null);
      setEditText("");
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
  });

  // Mutation pentru ștergerea comentariilor
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", "Post", postId] });
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
  });

  const handleSubmitComment = () => {
    if (!newComment.trim() || !isAuthenticated) return;

    const commentData: CommentCreateDto = {
      targetType: "Post",
      targetId: postId,
      text: newComment.trim(),
    };

    createCommentMutation.mutate(commentData);
  };

  const handleReply = (parentId: string) => {
    if (!replyText.trim() || !isAuthenticated) return;

    const commentData: CommentCreateDto = {
      targetType: "Post",
      targetId: postId,
      text: replyText.trim(),
      parentCommentId: parentId,
    };

    createCommentMutation.mutate(commentData);
  };

  const handleEditComment = (commentId: string, text: string) => {
    setEditingComment(commentId);
    setEditText(text);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editText.trim()) return;

    editCommentMutation.mutate({
      commentId,
      data: { text: editText.trim() },
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const handleLikeComment = (commentId: string) => {
    if (!isAuthenticated) return;
    likeCommentMutation.mutate(commentId);
  };

  // Separăm comentariile principale de răspunsuri
  const mainComments = comments.filter((comment) => !comment.parentCommentId);
  const replies = comments.filter((comment) => comment.parentCommentId);

  const getRepliesForComment = (commentId: string) => {
    return replies.filter((reply) => reply.parentCommentId === commentId);
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner />
        <Text mt={2}>Loading comments...</Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={6}>
      {/* Form pentru comentariu nou */}
      {isAuthenticated ? (
        <Box bg={bgColor} borderRadius="lg" p={4}>
          <VStack align="stretch" spacing={3}>
            <HStack align="start">
              <Avatar size="sm" name={user?.username} />
              <VStack align="stretch" flex="1" spacing={2}>
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  resize="vertical"
                  minH="80px"
                  bg="white"
                />
                <HStack justify="end">
                  <Button
                    leftIcon={<FiSend />}
                    colorScheme="blue"
                    size="sm"
                    onClick={handleSubmitComment}
                    isLoading={createCommentMutation.isPending}
                    isDisabled={!newComment.trim()}
                  >
                    Comment
                  </Button>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      ) : (
        <Box textAlign="center" py={6} bg={bgColor} borderRadius="lg">
          <Text>Please log in to comment.</Text>
        </Box>
      )}

      {/* Lista de comentarii */}
      <VStack align="stretch" spacing={4}>
        {mainComments.map((comment) => (
          <Box key={comment.id}>
            {/* Comentariul principal */}
            <Box bg={bgColor} borderRadius="lg" p={4}>
              <VStack align="stretch" spacing={3}>
                {/* Header comentariu */}
                <HStack justify="space-between">
                  <HStack>
                    <Avatar size="sm" name={comment.username} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold" fontSize="sm">
                        {comment.username}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                        {comment.isEdited && " (edited)"}
                      </Text>
                    </VStack>
                  </HStack>

                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem icon={<FiFlag />}>Report</MenuItem>
                      {user?.id === comment.userId && (
                        <>
                          <MenuItem
                            icon={<FiEdit3 />}
                            onClick={() =>
                              handleEditComment(comment.id, comment.text)
                            }
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            icon={<FiTrash2 />}
                            color="red.500"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Delete
                          </MenuItem>
                        </>
                      )}
                    </MenuList>
                  </Menu>
                </HStack>

                {/* Conținutul comentariului */}
                {editingComment === comment.id ? (
                  <VStack align="stretch" spacing={2}>
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      size="sm"
                      minH="60px"
                    />
                    <HStack justify="end" spacing={2}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingComment(null);
                          setEditText("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleSaveEdit(comment.id)}
                        isLoading={editCommentMutation.isPending}
                        isDisabled={!editText.trim()}
                      >
                        Save
                      </Button>
                    </HStack>
                  </VStack>
                ) : (
                  <Text>{comment.text}</Text>
                )}

                {/* Acțiuni comentariu */}
                {editingComment !== comment.id && (
                  <HStack spacing={4}>
                    <Button
                      leftIcon={<FiHeart />}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikeComment(comment.id)}
                      isDisabled={!isAuthenticated}
                    >
                      Like
                    </Button>
                    <Button
                      leftIcon={<FiCornerUpRight />}
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment.id ? null : comment.id
                        )
                      }
                      isDisabled={!isAuthenticated}
                    >
                      Reply
                    </Button>
                  </HStack>
                )}

                {/* Form pentru răspuns */}
                {replyingTo === comment.id && (
                  <Box pl={8} pt={2}>
                    <VStack align="stretch" spacing={2}>
                      <HStack align="start">
                        <Avatar size="xs" name={user?.username} />
                        <VStack align="stretch" flex="1" spacing={2}>
                          <Textarea
                            placeholder={`Reply to ${comment.username}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            size="sm"
                            minH="60px"
                          />
                          <HStack justify="end" spacing={2}>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleReply(comment.id)}
                              isLoading={createCommentMutation.isPending}
                              isDisabled={!replyText.trim()}
                            >
                              Reply
                            </Button>
                          </HStack>
                        </VStack>
                      </HStack>
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Box>

            {/* Răspunsurile la acest comentariu */}
            {getRepliesForComment(comment.id).length > 0 && (
              <Box pl={8} mt={2}>
                <VStack align="stretch" spacing={2}>
                  {getRepliesForComment(comment.id).map((reply) => (
                    <Box
                      key={reply.id}
                      bg={bgColor}
                      borderRadius="md"
                      p={3}
                      borderLeftWidth="3px"
                      borderLeftColor="blue.400"
                    >
                      <VStack align="stretch" spacing={2}>
                        <HStack justify="space-between">
                          <HStack>
                            <Avatar size="xs" name={reply.username} />
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="semibold" fontSize="sm">
                                {reply.username}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {new Date(reply.createdAt).toLocaleDateString()}
                                {reply.isEdited && " (edited)"}
                              </Text>
                            </VStack>
                          </HStack>

                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<FiMoreVertical />}
                              variant="ghost"
                              size="xs"
                            />
                            <MenuList>
                              <MenuItem icon={<FiFlag />}>Report</MenuItem>
                              {user?.id === reply.userId && (
                                <>
                                  <MenuItem
                                    icon={<FiEdit3 />}
                                    onClick={() =>
                                      handleEditComment(reply.id, reply.text)
                                    }
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    icon={<FiTrash2 />}
                                    color="red.500"
                                    onClick={() =>
                                      handleDeleteComment(reply.id)
                                    }
                                  >
                                    Delete
                                  </MenuItem>
                                </>
                              )}
                            </MenuList>
                          </Menu>
                        </HStack>

                        {editingComment === reply.id ? (
                          <VStack align="stretch" spacing={2}>
                            <Textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              size="sm"
                              minH="60px"
                            />
                            <HStack justify="end" spacing={2}>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditText("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                colorScheme="blue"
                                onClick={() => handleSaveEdit(reply.id)}
                                isLoading={editCommentMutation.isPending}
                                isDisabled={!editText.trim()}
                              >
                                Save
                              </Button>
                            </HStack>
                          </VStack>
                        ) : (
                          <>
                            <Text fontSize="sm">{reply.text}</Text>
                            <HStack spacing={2}>
                              <Button
                                leftIcon={<FiHeart />}
                                variant="ghost"
                                size="xs"
                                onClick={() => handleLikeComment(reply.id)}
                                isDisabled={!isAuthenticated}
                              >
                                Like
                              </Button>
                            </HStack>
                          </>
                        )}
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            <Divider mt={4} />
          </Box>
        ))}

        {comments.length === 0 && (
          <Box textAlign="center" py={12} bg={bgColor} borderRadius="lg">
            <Text color="gray.500">No comments yet.</Text>
            <Text fontSize="sm" color="gray.400">
              Be the first to share your thoughts!
            </Text>
          </Box>
        )}
      </VStack>
    </VStack>
  );
}
