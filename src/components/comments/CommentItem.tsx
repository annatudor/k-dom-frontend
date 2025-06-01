// src/components/comments/CommentItem.tsx

import { useState } from "react";
import {
  VStack,
  HStack,
  Box,
  Text,
  Avatar,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Textarea,
  useColorModeValue,
  Collapse,
  useDisclosure,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiMoreVertical,
  FiHeart,
  FiCornerUpRight,
  FiEdit3,
  FiTrash2,
  FiUser,
  FiCheck,
  FiClock,
} from "react-icons/fi";

import { useAuth } from "@/context/AuthContext";
import { CommentForm } from "./CommentForm";
import { DeleteCommentDialog } from "./DeleteCommentDialog"; // ← Import dialog-ul
import { formatRelativeTime } from "@/utils/commentUtils";
import { FlagMenuItem } from "@/components/flag/FlagButton";
import type {
  CommentWithReplies,
  CommentPermissions,
  CommentsConfig,
  CommentFormData,
} from "@/types/CommentSystem";

interface CommentItemProps {
  comment: CommentWithReplies;
  permissions: CommentPermissions;
  config: CommentsConfig;
  depth?: number;
  onReply?: (data: CommentFormData) => Promise<void>;
  onEdit?: (commentId: string, text: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  onLike?: (commentId: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function CommentItem({
  comment,
  permissions,
  config,
  depth = 0,
  onReply,
  onEdit,
  onDelete,
  onLike,
  isSubmitting = false,
}: CommentItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [editError, setEditError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // ← State pentru delete loading

  const {
    isOpen: isReplying,
    onOpen: startReplying,
    onClose: stopReplying,
  } = useDisclosure();

  // ← State pentru delete dialog
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: openDeleteDialog,
    onClose: closeDeleteDialog,
  } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const replyBgColor = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const metaColor = useColorModeValue("gray.500", "gray.400");

  const isOwner = user?.id === comment.userId;
  const canEdit = permissions.canEdit && isOwner;
  const canDelete =
    permissions.canDelete && (isOwner || permissions.canModerate);
  const canReply =
    permissions.canReply &&
    config.allowReplies &&
    depth < (config.maxReplyDepth || 3);
  const showReplies = comment.replies && comment.replies.length > 0;
  const maxDepthReached = depth >= (config.maxReplyDepth || 3);

  const handleEdit = async () => {
    if (!editText.trim()) {
      setEditError("Comment cannot be empty");
      return;
    }

    try {
      await onEdit?.(comment.id, editText.trim());
      setIsEditing(false);
      setEditError(null);
    } catch {
      setEditError("Failed to update comment");
    }
  };

  const handleCancelEdit = () => {
    setEditText(comment.text);
    setIsEditing(false);
    setEditError(null);
  };

  const handleReply = async (data: CommentFormData) => {
    await onReply?.({
      ...data,
      parentCommentId: comment.id,
    });
    stopReplying();
  };

  // ← STEP 1: Actualizează handleDelete să nu mai folosească window.confirm
  const handleDelete = () => {
    openDeleteDialog(); // Doar deschide dialog-ul personalizat
  };

  // ← STEP 2: Adaugă handleConfirmDelete pentru confirmarea efectivă
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.(comment.id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setIsDeleting(false);
      closeDeleteDialog();
    }
  };

  return (
    <>
      <Box>
        <Box
          bg={depth > 0 ? replyBgColor : bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={4}
          ml={depth > 0 ? 4 : 0}
          borderLeftWidth={depth > 0 ? "3px" : "1px"}
          borderLeftColor={depth > 0 ? "blue.400" : borderColor}
        >
          <VStack align="stretch" spacing={3}>
            {/* Header */}
            <HStack justify="space-between" align="start">
              <HStack spacing={3} flex="1">
                <Avatar size="sm" name={comment.username} icon={<FiUser />} />

                <VStack align="start" spacing={1} flex="1">
                  <HStack spacing={2} align="center" flexWrap="wrap">
                    <Text fontWeight="semibold" fontSize="sm" color={textColor}>
                      {comment.username}
                    </Text>

                    {comment.isEdited && config.showEditTimestamp && (
                      <Badge colorScheme="gray" size="sm">
                        edited
                      </Badge>
                    )}
                  </HStack>

                  <HStack spacing={2} align="center">
                    <Text fontSize="xs" color={metaColor}>
                      {formatRelativeTime(comment.createdAt)}
                    </Text>

                    {comment.isEdited &&
                      comment.editedAt &&
                      config.showEditTimestamp && (
                        <Tooltip
                          label={`Edited ${formatRelativeTime(
                            comment.editedAt
                          )}`}
                        >
                          <HStack spacing={1}>
                            <Icon as={FiClock} boxSize={3} color={metaColor} />
                            <Text fontSize="xs" color={metaColor}>
                              {formatRelativeTime(comment.editedAt)}
                            </Text>
                          </HStack>
                        </Tooltip>
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
                  aria-label="Comment options"
                />
                <MenuList>
                  {canEdit && (
                    <MenuItem
                      icon={<FiEdit3 />}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </MenuItem>
                  )}
                  {canDelete && (
                    <MenuItem
                      icon={<FiTrash2 />}
                      color="red.500"
                      onClick={handleDelete} // ← STEP 3: Acum doar deschide dialog-ul
                    >
                      Delete
                    </MenuItem>
                  )}
                  <FlagMenuItem
                    contentType="Comment"
                    contentId={comment.id}
                    contentTitle={`Comment by ${comment.username}`}
                    contentOwnerId={comment.userId} // ← IMPORTANT: Adaugă ID-ul autorului
                    onClose={() => {}} // Pentru a închide menu-ul
                  />
                </MenuList>
              </Menu>
            </HStack>

            {/* Content */}
            {isEditing ? (
              <VStack align="stretch" spacing={3}>
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  minH="80px"
                  isInvalid={Boolean(editError)}
                />
                {editError && (
                  <Text color="red.500" fontSize="sm">
                    {editError}
                  </Text>
                )}
                <HStack justify="end" spacing={2}>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    leftIcon={<FiCheck />}
                    onClick={handleEdit}
                    isLoading={isSubmitting}
                  >
                    Save
                  </Button>
                </HStack>
              </VStack>
            ) : (
              <Text color={textColor} whiteSpace="pre-wrap">
                {comment.text}
              </Text>
            )}

            {/* Actions */}
            {!isEditing && (
              <HStack spacing={4}>
                {config.showLikes && permissions.canLike && (
                  <Button
                    leftIcon={<FiHeart />}
                    variant="ghost"
                    size="sm"
                    colorScheme={comment.isLikedByUser ? "red" : "gray"}
                    onClick={() => onLike?.(comment.id)}
                    isLoading={isSubmitting}
                  >
                    {comment.likeCount || 0}
                  </Button>
                )}

                {canReply && (
                  <Button
                    leftIcon={<FiCornerUpRight />}
                    variant="ghost"
                    size="sm"
                    onClick={startReplying}
                    isDisabled={maxDepthReached}
                  >
                    Reply
                  </Button>
                )}

                {maxDepthReached && canReply && (
                  <Text fontSize="xs" color={metaColor}>
                    Max reply depth reached
                  </Text>
                )}
              </HStack>
            )}

            {/* Reply Form */}
            <Collapse in={isReplying} animateOpacity>
              <Box pt={3}>
                <CommentForm
                  config={config}
                  onSubmit={handleReply}
                  onCancel={stopReplying}
                  parentCommentId={comment.id}
                  parentUsername={comment.username}
                  isSubmitting={isSubmitting}
                  autoFocus
                />
              </Box>
            </Collapse>
          </VStack>
        </Box>

        {/* Replies */}
        {showReplies && (
          <VStack align="stretch" spacing={3} mt={3}>
            {comment.replies!.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                permissions={permissions}
                config={config}
                depth={depth + 1}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onLike={onLike}
                isSubmitting={isSubmitting}
              />
            ))}
          </VStack>
        )}
      </Box>

      {/* ← STEP 4: Adaugă DeleteCommentDialog */}
      <DeleteCommentDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        commentText={comment.text}
        username={comment.username}
      />
    </>
  );
}
