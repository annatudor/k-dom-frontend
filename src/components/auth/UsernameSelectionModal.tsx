// src/components/auth/UsernameSelectionModal.tsx
// Modal pentru alegerea username-ului în timpul înregistrării OAuth

import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  VStack,
  Text,
  Avatar,
  HStack,
  Badge,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { FiCheck } from "react-icons/fi";
import { GrFormClose } from "react-icons/gr";
import { OAuthService } from "@/api/oauth";
import {
  validateUsername,
  generateUsernameVariants,
} from "@/utils/usernameGenerator";

interface UsernameSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (username: string) => void;
  userInfo: {
    name: string;
    email: string;
    picture?: string;
    suggestedUsername: string;
  };
}

export function UsernameSelectionModal({
  isOpen,
  onClose,
  onComplete,
  userInfo,
}: UsernameSelectionModalProps) {
  const [username, setUsername] = useState(userInfo.suggestedUsername);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const toast = useToast();

  // Verifică disponibilitatea username-ului când se schimbă
  useEffect(() => {
    const checkAvailability = async () => {
      if (!username) {
        setIsAvailable(null);
        return;
      }

      // Validează format
      const validation = validateUsername(username);
      if (!validation.isValid) {
        setValidationError(validation.error || "");
        setIsAvailable(false);
        return;
      }

      setValidationError("");
      setIsChecking(true);

      try {
        const available = await OAuthService.checkUsernameAvailability(
          username
        );
        setIsAvailable(available);

        // Generează sugestii dacă nu este disponibil
        if (!available) {
          const variants = generateUsernameVariants(username, 3);
          setSuggestions(variants.slice(1, 4)); // Exclude primul care e același
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error checking username:", error);
        setIsAvailable(false);
        toast({
          title: "Error checking username",
          description: "Please try again",
          status: "error",
          duration: 3000,
        });
      } finally {
        setIsChecking(false);
      }
    };

    // Debounce pentru a evita prea multe cereri
    const timeout = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeout);
  }, [username, toast]);

  const handleSubmit = () => {
    if (isAvailable && username && !validationError) {
      onComplete(username);
    }
  };

  const handleSuggestionClick = (suggestedUsername: string) => {
    setUsername(suggestedUsername);
  };

  const getUsernameStatus = () => {
    if (isChecking) {
      return { color: "gray", icon: <Spinner size="xs" /> };
    }
    if (validationError) {
      return { color: "red", icon: <GrFormClose w={3} h={3} /> };
    }
    if (isAvailable === true) {
      return { color: "green", icon: <FiCheck w={3} h={3} /> };
    }
    if (isAvailable === false) {
      return { color: "red", icon: <CloseIcon w={3} h={3} /> };
    }
    return { color: "gray", icon: null };
  };

  const status = getUsernameStatus();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size="md"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Complete Your Profile</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6}>
            {/* User Info Display */}
            <VStack spacing={3}>
              <Avatar size="lg" src={userInfo.picture} name={userInfo.name} />
              <VStack spacing={1}>
                <Text fontWeight="semibold" fontSize="lg">
                  {userInfo.name}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {userInfo.email}
                </Text>
              </VStack>
            </VStack>

            {/* Username Selection */}
            <FormControl isInvalid={!!validationError || isAvailable === false}>
              <FormLabel>Choose a username</FormLabel>
              <HStack>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="Enter your username"
                  autoFocus
                />
                {status.icon && (
                  <Badge colorScheme={status.color} variant="subtle">
                    {status.icon}
                  </Badge>
                )}
              </HStack>

              {validationError && (
                <FormErrorMessage>{validationError}</FormErrorMessage>
              )}

              {isAvailable === false && !validationError && (
                <FormErrorMessage>
                  This username is already taken
                </FormErrorMessage>
              )}

              {isAvailable === true && (
                <FormHelperText color="green.600">
                  Great! This username is available
                </FormHelperText>
              )}

              {!validationError && (
                <FormHelperText>
                  Username must be 3-20 characters, letters, numbers, and
                  underscores only
                </FormHelperText>
              )}
            </FormControl>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <VStack align="stretch" w="full">
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  Suggestions:
                </Text>
                <HStack flexWrap="wrap" spacing={2}>
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      size="sm"
                      variant="outline"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </HStack>
              </VStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={!isAvailable || !!validationError || isChecking}
            isLoading={isChecking}
          >
            Complete Registration
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
