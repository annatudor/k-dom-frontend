// src/components/kdom/KDomComments.tsx
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Textarea,
  Avatar,
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
  FiCornerUpRight,
  FiHeart,
  FiFlag,
} from "react-icons/fi";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getCommentsByTarget,
  createComment,
  toggleLikeComment,
} from "@/api/comment";
import { useAuth } from "@/context/AuthContext";
import type { CommentReadDto } from "@/types/Comment";

interface KDomCommentsProps {
  kdomId: string;
}

export function KDomComments({ kdomId }: KDomCommentsProps) {
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const toast = useToast();
  const queryClient = useQueryClient();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Query pentru comentarii
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", "KDom", kdomId],
    queryFn: () => getCommentsByTarget("KDom", kdomId),
  });

  // Mutation pentru crearea comentariilor
  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", "KDom", kdomId] });
      setNewComment("");
      setReplyingTo(null);
      setReplyText("");
      toast({
        title: "Comment posted!",
        status: "success",
        duration: 3000,
      });
    },
  });

  // Mutation pentru like/unlike comentarii
  const likeCommentMutation = useMutation({
    mutationFn: toggleLikeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", "KDom", kdomId] });
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim() || !isAuthenticated) return;

    createCommentMutation.mutate({
      targetType: "KDom",
      targetId: kdomId,
      text: newComment.trim(),
    });
  };

  const handleReply = (parentId: string) => {
    if (!replyText.trim() || !isAuthenticated) return;

    createCommentMutation.mutate({
      targetType: "KDom",
      targetId: kdomId,
      text: replyText.trim(),
      parentCommentId: parentId,
    });
  };

  const handleLikeComment = (commentId: string) => {
    if (!isAuthenticated) return;
    likeCommentMutation.mutate(commentId);
  };

  // Separăm comentariile principale de răspunsuri
  const mainComments = (comments as CommentReadDto[]).filter(
    (comment) => !comment.parentCommentId
  );
  const replies = (comments as CommentReadDto[]).filter(
    (comment) => comment.parentCommentId
  );

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
    <Box id="comments">
      <Heading size="lg" mb={6}>
        Comments ({comments.length})
      </Heading>

      {/* Form pentru comentariu nou */}
      {isAuthenticated ? (
        <Box
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={4}
          mb={6}
        >
          <VStack align="stretch" spacing={3}>
            <HStack align="start">
              <Avatar size="sm" name={user?.username} />
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                resize="vertical"
                minH="100px"
              />
            </HStack>
            <HStack justify="end">
              <Button
                colorScheme="blue"
                onClick={handleSubmitComment}
                isLoading={createCommentMutation.isPending}
                isDisabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </HStack>
          </VStack>
        </Box>
      ) : (
        <Box
          textAlign="center"
          py={8}
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          mb={6}
        >
          <Text>Please log in to comment.</Text>
        </Box>
      )}

      {/* Lista de comentarii */}
      <VStack align="stretch" spacing={4}>
        {mainComments.map((comment) => (
          <Box key={comment.id}>
            {/* Comentariul principal */}
            <Box
              bg={bgColor}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              p={4}
            >
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
                          <MenuItem>Edit</MenuItem>
                          <MenuItem color="red.500">Delete</MenuItem>
                        </>
                      )}
                    </MenuList>
                  </Menu>
                </HStack>

                {/* Conținutul comentariului */}
                <Text>{comment.text}</Text>

                {/* Acțiuni comentariu */}
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

                {/* Form pentru răspuns */}
                {replyingTo === comment.id && (
                  <Box pl={8} pt={2}>
                    <VStack align="stretch" spacing={2}>
                      <HStack align="start">
                        <Avatar size="xs" name={user?.username} />
                        <Textarea
                          placeholder={`Reply to ${comment.username}...`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          size="sm"
                          minH="80px"
                        />
                      </HStack>
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
                      borderWidth="1px"
                      borderColor={borderColor}
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
                                  <MenuItem>Edit</MenuItem>
                                  <MenuItem color="red.500">Delete</MenuItem>
                                </>
                              )}
                            </MenuList>
                          </Menu>
                        </HStack>

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
          <Box
            textAlign="center"
            py={12}
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
          >
            <Text color="gray.500">No comments yet.</Text>
            <Text fontSize="sm" color="gray.400">
              Be the first to share your thoughts!
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
