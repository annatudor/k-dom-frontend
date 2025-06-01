// src/components/comments/CommentForm.tsx

import { useState, useRef, useEffect } from "react";
import {
  VStack,
  HStack,
  Box,
  Textarea,
  Button,
  Avatar,
  Text,
  Alert,
  AlertIcon,
  FormControl,
  FormErrorMessage,
  useColorModeValue,
  Flex,
  Badge,
  Icon,
} from "@chakra-ui/react";
import {
  FiSend,
  FiX,
  FiUser,
  FiCornerUpRight,
  FiAlertCircle,
} from "react-icons/fi";

import { useAuth } from "@/context/AuthContext";
import { validateCommentText } from "@/utils/commentUtils";
import type { CommentFormData, CommentsConfig } from "@/types/CommentSystem";

interface CommentFormProps {
  config: CommentsConfig;
  onSubmit: (data: CommentFormData) => Promise<void>;
  onCancel?: () => void;
  parentCommentId?: string | null;
  parentUsername?: string;
  isSubmitting?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

export function CommentForm({
  config,
  onSubmit,
  onCancel,
  parentCommentId = null,
  parentUsername,
  isSubmitting = false,
  autoFocus = false,
  placeholder,
}: CommentFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");

  const isReply = Boolean(parentCommentId);
  const characterLimit = config.maxCommentLength || 2000;
  const remainingChars = characterLimit - text.length;

  // Auto-focus pentru replies
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Resetează eroarea când textul se schimbă
  useEffect(() => {
    if (error && text.trim()) {
      setError(null);
    }
  }, [text, error]);

  const handleSubmit = async () => {
    // Validare
    const validation = validateCommentText(text, characterLimit);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    try {
      await onSubmit({
        text: text.trim(),
        parentCommentId,
      });

      // Reset form doar dacă nu e reply (reply-urile se închid automat)
      if (!isReply) {
        setText("");
        setError(null);
      }
    } catch {
      setError("Failed to post comment. Please try again.");
    }
  };

  const handleCancel = () => {
    setText("");
    setError(null);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape" && isReply) {
      handleCancel();
    }
  };

  // Nu afișa nimic dacă utilizatorul nu e autentificat
  if (!isAuthenticated) {
    return (
      <Alert status="info" borderRadius="lg">
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontWeight="semibold">Join the conversation</Text>
          <Text fontSize="sm">Please log in to post comments.</Text>
        </VStack>
      </Alert>
    );
  }

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      boxShadow={isReply ? "md" : "sm"}
    >
      <VStack spacing={4} align="stretch">
        {/* Header pentru replies */}
        {isReply && parentUsername && (
          <HStack spacing={2} align="center">
            <Icon as={FiCornerUpRight} color="blue.500" boxSize={4} />
            <Text fontSize="sm" color="blue.600" fontWeight="medium">
              Replying to @{parentUsername}
            </Text>
            {onCancel && (
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<FiX />}
                onClick={handleCancel}
                ml="auto"
              >
                Cancel
              </Button>
            )}
          </HStack>
        )}

        {/* Form content */}
        <HStack align="start" spacing={3}>
          {/* Avatar */}
          <Avatar
            size="sm"
            name={user?.username}
            src={user?.avatarUrl}
            icon={<FiUser />}
          />

          {/* Input area */}
          <VStack align="stretch" spacing={3} flex="1">
            <FormControl isInvalid={Boolean(error)}>
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  placeholder ||
                  config.placeholderText ||
                  (isReply
                    ? `Reply to @${parentUsername}...`
                    : "Write a comment...")
                }
                resize="vertical"
                minH={isReply ? "80px" : "100px"}
                maxH="300px"
                bg="white"
                _dark={{ bg: "gray.700" }}
                _placeholder={{ color: placeholderColor }}
                borderColor={error ? "red.300" : borderColor}
                _hover={{
                  borderColor: error ? "red.400" : "blue.300",
                }}
                _focus={{
                  borderColor: error ? "red.500" : "blue.500",
                  boxShadow: error ? "0 0 0 1px red.500" : "0 0 0 1px blue.500",
                }}
              />
              <FormErrorMessage>
                <HStack spacing={1}>
                  <Icon as={FiAlertCircle} boxSize={4} />
                  <Text>{error}</Text>
                </HStack>
              </FormErrorMessage>
            </FormControl>

            {/* Footer */}
            <Flex justify="space-between" align="center">
              {/* Character counter */}
              <HStack spacing={2}>
                <Text fontSize="xs" color={placeholderColor}>
                  {text.length}/{characterLimit}
                </Text>
                {remainingChars < 100 && (
                  <Badge
                    colorScheme={remainingChars < 20 ? "red" : "orange"}
                    size="sm"
                  >
                    {remainingChars} left
                  </Badge>
                )}
              </HStack>

              {/* Action buttons */}
              <HStack spacing={2}>
                {isReply && onCancel && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancel}
                    isDisabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  leftIcon={<FiSend />}
                  colorScheme="blue"
                  size="sm"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  loadingText="Posting..."
                  isDisabled={!text.trim() || remainingChars < 0}
                >
                  {isReply ? "Reply" : "Comment"}
                </Button>
              </HStack>
            </Flex>

            {/* Helper text */}
            {!isReply && (
              <Text fontSize="xs" color={placeholderColor}>
                Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to post quickly
              </Text>
            )}
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}
