// src/components/comments/UniversalComments.tsx

import {
  VStack,
  Box,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";

import { useComments } from "@/hooks/useComments";
import { CommentsHeader } from "./CommentsHeader";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

import type { CommentTargetType, CommentsConfig } from "@/types/CommentSystem";

interface UniversalCommentsProps {
  targetType: CommentTargetType;
  targetId: string;
  config?: Partial<CommentsConfig>;
  showHeader?: boolean;
  showForm?: boolean;
  className?: string;
}

export function UniversalComments({
  targetType,
  targetId,
  config = {},
  showHeader = true,
  showForm = true,
  className,
}: UniversalCommentsProps) {
  const {
    comments,
    isLoading,
    error,
    stats,
    permissions,
    config: finalConfig,
    sortBy,
    setSortBy,
    addComment,
    editComment,
    deleteComment,
    toggleLike,
    refresh,
  } = useComments({
    targetType,
    targetId,
    config,
  });

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Loading state
  if (isLoading) {
    return (
      <Box
        className={className}
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        p={6}
      >
        <VStack spacing={6} align="center" justify="center" minH="200px">
          <Spinner size="lg" thickness="4px" color="blue.500" />
          <Text color="gray.500">Loading comments...</Text>
        </VStack>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        className={className}
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        p={6}
      >
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold">Failed to load comments</Text>
            <Text fontSize="sm">{error}</Text>
          </VStack>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      className={className}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={6}
      boxShadow="sm"
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        {showHeader && (
          <CommentsHeader
            stats={stats}
            config={finalConfig}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onRefresh={refresh}
            isLoading={isLoading}
          />
        )}

        {/* Comment Form */}
        {showForm && permissions.canComment && (
          <>
            <CommentForm config={finalConfig} onSubmit={addComment} />
            {comments.length > 0 && <Divider borderColor={borderColor} />}
          </>
        )}

        {/* Comments List */}
        {comments.length > 0 ? (
          <VStack spacing={4} align="stretch">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                permissions={permissions}
                config={finalConfig}
                depth={0}
                onReply={addComment}
                onEdit={editComment}
                onDelete={deleteComment}
                onLike={toggleLike}
              />
            ))}
          </VStack>
        ) : (
          // Empty state este handled în CommentsHeader
          !showHeader && (
            <Box
              textAlign="center"
              py={12}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              borderStyle="dashed"
            >
              <VStack spacing={3}>
                <Text fontSize="lg" fontWeight="semibold" color="gray.500">
                  No comments yet
                </Text>
                <Text fontSize="sm" color="gray.400" maxW="sm">
                  {permissions.canComment
                    ? "Be the first to share your thoughts!"
                    : "No one has commented yet."}
                </Text>
              </VStack>
            </Box>
          )
        )}

        {/* Additional Actions or Info */}
        {comments.length > 10 && (
          <Box textAlign="center" pt={4}>
            <Text fontSize="sm" color="gray.500">
              Showing {comments.length} comments • Scroll up to see more
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

// Export pentru ușurința utilizării
export default UniversalComments;
