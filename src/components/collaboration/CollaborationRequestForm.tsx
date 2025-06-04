// src/components/collaboration/CollaborationRequestForm.tsx
import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Text,
  Alert,
  AlertIcon,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Heading,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiUserPlus, FiEdit3 } from "react-icons/fi";
import { useRequestCollaboration } from "@/hooks/useCollaboration";
import type {
  CollaborationRequestFormData,
  CollaborationRequestFormErrors,
} from "@/types/Collaboration";

interface CollaborationRequestFormProps {
  kdomId: string;
  kdomTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CollaborationRequestForm({
  kdomId,
  kdomTitle,
  onSuccess,
  onCancel,
}: CollaborationRequestFormProps) {
  const [formData, setFormData] = useState<CollaborationRequestFormData>({
    message: "",
  });
  const [errors, setErrors] = useState<CollaborationRequestFormErrors>({});

  const requestMutation = useRequestCollaboration();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const validateForm = (): boolean => {
    const newErrors: CollaborationRequestFormErrors = {};

    if (formData.message.trim().length < 10) {
      newErrors.message =
        "Please provide a message of at least 10 characters explaining why you want to collaborate.";
    }

    if (formData.message.trim().length > 500) {
      newErrors.message = "Message must be less than 500 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await requestMutation.mutateAsync({
        kdomId,
        data: { message: formData.message.trim() || undefined },
      });

      // Reset form
      setFormData({ message: "" });
      setErrors({});

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleInputChange = (
    field: keyof CollaborationRequestFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="lg"
      overflow="hidden"
    >
      <CardHeader bg="blue.50" borderBottom="1px" borderColor={borderColor}>
        <HStack spacing={3}>
          <Icon as={FiUserPlus} color="blue.500" boxSize={6} />
          <VStack align="start" spacing={1}>
            <Heading size="md" color="blue.700">
              Request Collaboration
            </Heading>
            <Text fontSize="sm" color="blue.600">
              Join as a collaborator for "{kdomTitle}"
            </Text>
          </VStack>
        </HStack>
      </CardHeader>

      <CardBody p={6}>
        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text fontWeight="semibold">What does collaboration mean?</Text>
                <Text fontSize="sm">
                  As a collaborator, you'll be able to edit the content of this
                  K-Dom, contribute to its development, and help maintain its
                  quality. The owner will review your request before granting
                  access.
                </Text>
              </VStack>
            </Alert>

            <FormControl isRequired isInvalid={!!errors.message}>
              <FormLabel fontWeight="semibold" color="gray.700">
                Why do you want to collaborate?
              </FormLabel>
              <Textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Explain your interest in collaborating on this K-Dom. What expertise, ideas, or contributions can you bring? What motivates you to help improve this content?"
                rows={5}
                maxLength={500}
                resize="vertical"
                bg={useColorModeValue("gray.50", "gray.700")}
                borderColor={errors.message ? "red.300" : "gray.300"}
                _hover={{
                  borderColor: errors.message ? "red.400" : "blue.300",
                }}
                _focus={{
                  borderColor: errors.message ? "red.500" : "blue.500",
                  boxShadow: `0 0 0 1px ${
                    errors.message ? "#E53E3E" : "#3182CE"
                  }`,
                }}
              />
              <HStack justify="space-between" mt={2}>
                <Text fontSize="sm" color="red.500">
                  {errors.message}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {formData.message.length}/500
                </Text>
              </HStack>
            </FormControl>

            {errors.general && (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <Text>{errors.general}</Text>
              </Alert>
            )}

            <HStack spacing={4} justify="flex-end">
              {onCancel && (
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  isDisabled={requestMutation.isPending}
                  size="lg"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                colorScheme="blue"
                leftIcon={<Icon as={FiEdit3} />}
                isLoading={requestMutation.isPending}
                loadingText="Sending Request..."
                size="lg"
                px={8}
              >
                Send Collaboration Request
              </Button>
            </HStack>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
}
