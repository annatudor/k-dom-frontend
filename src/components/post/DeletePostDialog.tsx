// src/components/post/DeletePostDialog.tsx

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Badge,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiTrash2, FiAlertTriangle, FiUser } from "react-icons/fi";
import type { PostReadDto } from "@/types/Post";

interface DeletePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  post?: PostReadDto;
}

export function DeletePostDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  post,
}: DeletePostDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const warningColor = useColorModeValue("orange.500", "orange.400");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Extract text content from HTML (simple approach)
  const getTextFromHtml = (html: string): string => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const postPreviewText = post ? getTextFromHtml(post.contentHtml) : "";
  const truncatedText =
    postPreviewText.length > 150
      ? postPreviewText.substring(0, 150) + "..."
      : postPreviewText;

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      motionPreset="slideInBottom"
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent mx={4} borderRadius="xl" boxShadow="xl">
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            borderBottomWidth="1px"
            pb={4}
          >
            <HStack spacing={3} align="center">
              <Icon as={FiAlertTriangle} color={warningColor} boxSize={6} />
              <Text>Delete Post</Text>
            </HStack>
          </AlertDialogHeader>

          <AlertDialogBody py={6}>
            <VStack spacing={4} align="start">
              <Text color={textColor} lineHeight="tall">
                Are you sure you want to delete this post? This action will also
                remove all comments and interactions associated with it.
              </Text>

              {/* Preview del post si es disponible */}
              {post && (
                <VStack
                  align="stretch"
                  spacing={3}
                  w="full"
                  p={4}
                  bg="gray.50"
                  _dark={{ bg: "gray.700" }}
                  borderRadius="lg"
                  borderLeftWidth="4px"
                  borderLeftColor="blue.400"
                >
                  {/* Author info */}
                  <HStack spacing={2} align="center">
                    <Icon as={FiUser} boxSize={4} color={mutedTextColor} />
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={mutedTextColor}
                    >
                      Post by {post.username}
                    </Text>
                    <Text fontSize="xs" color={mutedTextColor}>
                      • {new Date(post.createdAt).toLocaleDateString()}
                    </Text>
                  </HStack>

                  {/* Content preview */}
                  <Text fontSize="sm" color={textColor} whiteSpace="pre-wrap">
                    {truncatedText}
                  </Text>

                  {/* Tags if any */}
                  {post.tags && post.tags.length > 0 && (
                    <VStack align="start" spacing={2}>
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={mutedTextColor}
                      >
                        Tagged in:
                      </Text>
                      <Wrap spacing={1}>
                        {post.tags.slice(0, 3).map((tag) => (
                          <WrapItem key={tag}>
                            <Badge colorScheme="blue" size="sm" fontSize="xs">
                              #{tag}
                            </Badge>
                          </WrapItem>
                        ))}
                        {post.tags.length > 3 && (
                          <WrapItem>
                            <Badge colorScheme="gray" size="sm" fontSize="xs">
                              +{post.tags.length - 3} more
                            </Badge>
                          </WrapItem>
                        )}
                      </Wrap>
                    </VStack>
                  )}

                  {/* Stats */}
                  <HStack spacing={4} fontSize="xs" color={mutedTextColor}>
                    <Text>{post.likeCount || 0} likes</Text>
                    {post.isEdited && <Text>• edited</Text>}
                  </HStack>
                </VStack>
              )}

              <VStack spacing={2} align="start" w="full">
                <Text fontSize="sm" color={warningColor} fontWeight="medium">
                  ⚠️ This will permanently delete:
                </Text>
                <VStack
                  spacing={1}
                  align="start"
                  pl={4}
                  fontSize="sm"
                  color={mutedTextColor}
                >
                  <Text>• The post content and media</Text>
                  <Text>• All comments and replies</Text>
                  <Text>• All likes and interactions</Text>
                  <Text>• Any notifications related to this post</Text>
                </VStack>
              </VStack>

              <Text fontSize="sm" color="red.500" fontWeight="medium">
                This action cannot be undone.
              </Text>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter borderTopWidth="1px" pt={4}>
            <HStack spacing={3} w="full" justify="end">
              <Button
                ref={cancelRef}
                onClick={onClose}
                variant="outline"
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                leftIcon={<FiTrash2 />}
                colorScheme="red"
                onClick={handleConfirm}
                isLoading={isLoading}
                loadingText="Deleting..."
              >
                Delete Post
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
