// src/components/comments/DeleteCommentDialog.tsx

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
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiTrash2, FiAlertTriangle } from "react-icons/fi";

interface DeleteCommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  commentText?: string;
  username?: string;
}

export function DeleteCommentDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  commentText,
  username,
}: DeleteCommentDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const warningColor = useColorModeValue("orange.500", "orange.400");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const truncatedText =
    commentText && commentText.length > 100
      ? commentText.substring(0, 100) + "..."
      : commentText;

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
              <Text>Delete Comment</Text>
            </HStack>
          </AlertDialogHeader>

          <AlertDialogBody py={6}>
            <VStack spacing={4} align="start">
              <Text color={textColor} lineHeight="tall">
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </Text>

              {/* Preview del comentario si es disponible */}
              {commentText && (
                <VStack
                  align="stretch"
                  spacing={2}
                  w="full"
                  p={4}
                  bg="gray.50"
                  _dark={{ bg: "gray.700" }}
                  borderRadius="lg"
                  borderLeftWidth="4px"
                  borderLeftColor="gray.300"
                >
                  {username && (
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={mutedTextColor}
                    >
                      Comment by {username}:
                    </Text>
                  )}
                  <Text
                    fontSize="sm"
                    color={mutedTextColor}
                    fontStyle="italic"
                    whiteSpace="pre-wrap"
                  >
                    "{truncatedText}"
                  </Text>
                </VStack>
              )}

              <Text fontSize="sm" color={warningColor} fontWeight="medium">
                ⚠️ This action is permanent and cannot be reversed.
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
                Delete Comment
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
