// src/components/community/KDomSearchDialog.tsx
import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Text,
  Avatar,
  IconButton,
  useColorModeValue,
  Icon,
  Box,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
} from "@chakra-ui/react";
import { FiSearch, FiHeart, FiCheck } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { searchKDomTags } from "@/api/kdom";
import { followKDom, isKDomFollowed } from "@/api/kdomFollow";
import { useDebounce } from "use-debounce";
import type { KDomTagSearchResultDto } from "@/types/KDom";

interface KDomSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KDomSearchDialog({ isOpen, onClose }: KDomSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const toast = useToast();
  const queryClient = useQueryClient();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  // Search K-Doms
  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kdom-search", debouncedQuery],
    queryFn: () => searchKDomTags(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 300000, // 5 minutes
  });

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: followKDom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followed-kdoms"] });
      queryClient.invalidateQueries({ queryKey: ["kdom-search"] });
      toast({
        title: "K-Dom followed successfully!",
        status: "success",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Failed to follow K-Dom",
        description: "Please try again later",
        status: "error",
        duration: 3000,
      });
    },
  });

  const handleFollow = (kdomId: string) => {
    followMutation.mutate(kdomId);
  };

  const handleClearAndClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClearAndClose}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent bg={cardBg} borderColor={borderColor} maxH="80vh">
        <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="bold">
              Add K-Doms to Follow
            </Text>
            <Text fontSize="sm" color="gray.500">
              Search for K-Doms by title or slug to follow them
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            {/* Search Input */}
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search K-Doms by title or slug..."
                focusBorderColor="purple.500"
                borderRadius="lg"
              />
            </InputGroup>

            {/* Search Help */}
            {searchQuery.length === 0 && (
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="semibold">
                    How to search:
                  </Text>
                  <Text fontSize="xs">
                    Type at least 2 characters to search for K-Doms by title or
                    slug
                  </Text>
                </VStack>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && searchQuery.length >= 2 && (
              <HStack justify="center" py={8}>
                <Spinner size="lg" color="purple.500" thickness="3px" />
                <Text color="gray.500">Searching K-Doms...</Text>
              </HStack>
            )}

            {/* No Results */}
            {!isLoading &&
              searchQuery.length >= 2 &&
              searchResults.length === 0 &&
              !error && (
                <Alert status="warning" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" fontWeight="semibold">
                      No K-Doms found
                    </Text>
                    <Text fontSize="xs">
                      Try a different search term or check the spelling
                    </Text>
                  </VStack>
                </Alert>
              )}

            {/* Error State */}
            {error && (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="semibold">
                    Search failed
                  </Text>
                  <Text fontSize="xs">
                    Please check your connection and try again
                  </Text>
                </VStack>
              </Alert>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <VStack spacing={3} align="stretch">
                <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                  Found {searchResults.length} K-Dom
                  {searchResults.length > 1 ? "s" : ""}:
                </Text>

                <VStack
                  spacing={2}
                  align="stretch"
                  maxH="400px"
                  overflowY="auto"
                >
                  {searchResults.map((kdom) => (
                    <KDomSearchItem
                      key={kdom.id}
                      kdom={kdom}
                      onFollow={handleFollow}
                      isFollowing={followMutation.isPending}
                      hoverBg={hoverBg}
                      borderColor={borderColor}
                    />
                  ))}
                </VStack>
              </VStack>
            )}

            {/* Search Suggestions */}
            {searchQuery.length > 0 && searchQuery.length < 2 && (
              <Box>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Type at least 2 characters to start searching...
                </Text>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
          <HStack spacing={3}>
            <Button variant="outline" onClick={handleClearAndClose} size="sm">
              Close
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleClearAndClose}
              size="sm"
              leftIcon={<Icon as={FiCheck} />}
            >
              Done
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Separate component for each search result item
interface KDomSearchItemProps {
  kdom: KDomTagSearchResultDto;
  onFollow: (kdomId: string) => void;
  isFollowing: boolean;
  hoverBg: string;
  borderColor: string;
}

function KDomSearchItem({
  kdom,
  onFollow,
  isFollowing,
  hoverBg,
  borderColor,
}: KDomSearchItemProps) {
  const [isFollowingThis, setIsFollowingThis] = useState(false);

  // Check if already following this K-Dom
  const { data: alreadyFollowing = false } = useQuery({
    queryKey: ["is-following", kdom.id],
    queryFn: () => isKDomFollowed(kdom.id),
    staleTime: 300000,
  });

  const handleFollowClick = () => {
    if (!alreadyFollowing && !isFollowingThis) {
      setIsFollowingThis(true);
      onFollow(kdom.id);
    }
  };

  const isCurrentlyFollowed = alreadyFollowing || isFollowingThis;

  return (
    <HStack
      spacing={4}
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      _hover={{ bg: hoverBg }}
      transition="background 0.2s"
    >
      <Avatar size="md" name={kdom.title} />

      <VStack align="start" spacing={1} flex="1">
        <Text fontWeight="semibold" fontSize="md" noOfLines={1}>
          {kdom.title}
        </Text>
        <HStack spacing={2}>
          <Badge colorScheme="blue" variant="subtle" size="sm">
            #{kdom.slug}
          </Badge>
          {kdom.description && (
            <Text fontSize="xs" color="gray.500" noOfLines={1}>
              {kdom.description}
            </Text>
          )}
        </HStack>
      </VStack>

      <IconButton
        icon={<Icon as={isCurrentlyFollowed ? FiCheck : FiHeart} />}
        aria-label={isCurrentlyFollowed ? "Already following" : "Follow K-Dom"}
        colorScheme={isCurrentlyFollowed ? "green" : "purple"}
        variant={isCurrentlyFollowed ? "solid" : "outline"}
        size="sm"
        onClick={handleFollowClick}
        isLoading={isFollowing}
        isDisabled={isCurrentlyFollowed}
        _disabled={{
          opacity: 1,
          cursor: "not-allowed",
        }}
      />
    </HStack>
  );
}
