// src/components/post/KDomTagSelector.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Input,
  VStack,
  HStack,
  Text,
  Badge,
  Spinner,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Wrap,
  WrapItem,
  Icon,
  AlertIcon,
  Alert,
} from "@chakra-ui/react";
import { FiSearch, FiX, FiPlus } from "react-icons/fi";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import { searchKDomTags } from "@/api/kdom";
import type { KDomTagSearchResultDto } from "@/types/KDom";

interface KDomTagSelectorProps {
  selectedTags: KDomTagSearchResultDto[];
  onTagsChange: (tags: KDomTagSearchResultDto[]) => void;
  maxTags?: number;
}

export function KDomTagSelector({
  selectedTags,
  onTagsChange,
  maxTags = 5,
}: KDomTagSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [isOpen, setIsOpen] = useState(false);

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  // Query for K-Dom search
  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["kdom-search", debouncedQuery],
    queryFn: () => searchKDomTags(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  // Filter out already selected tags
  const filteredResults = searchResults.filter(
    (result) => !selectedTags.some((selected) => selected.id === result.id)
  );

  useEffect(() => {
    setIsOpen(debouncedQuery.length >= 2 && filteredResults.length > 0);
  }, [debouncedQuery, filteredResults]);

  const handleAddTag = (tag: KDomTagSearchResultDto) => {
    if (selectedTags.length >= maxTags) {
      return; // Don't add if max reached
    }

    const newTags = [...selectedTags, tag];
    onTagsChange(newTags);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleRemoveTag = (tagId: string) => {
    const newTags = selectedTags.filter((tag) => tag.id !== tagId);
    onTagsChange(newTags);
  };

  const handleInputFocus = () => {
    if (debouncedQuery.length >= 2 && filteredResults.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow clicks on results
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <VStack align="stretch" spacing={4}>
      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <Box>
          <Text fontSize="sm" fontWeight="semibold" mb={2}>
            Selected Tags ({selectedTags.length}/{maxTags}):
          </Text>
          <Wrap spacing={2}>
            {selectedTags.map((tag) => (
              <WrapItem key={tag.id}>
                <Badge
                  colorScheme="blue"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Text>#{tag.slug}</Text>
                  <Icon
                    as={FiX}
                    boxSize={3}
                    cursor="pointer"
                    onClick={() => handleRemoveTag(tag.id)}
                    _hover={{ color: "red.500" }}
                  />
                </Badge>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}

      {/* Search Input */}
      <Box position="relative">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch />
          </InputLeftElement>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={
              selectedTags.length >= maxTags
                ? `Maximum ${maxTags} tags selected`
                : "Search for K-Doms to tag..."
            }
            disabled={selectedTags.length >= maxTags}
          />
        </InputGroup>

        {/* Loading indicator */}
        {isLoading && searchQuery.length >= 2 && (
          <Box
            position="absolute"
            right={3}
            top="50%"
            transform="translateY(-50%)"
          >
            <Spinner size="sm" />
          </Box>
        )}

        {/* Search results dropdown */}
        {isOpen && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            zIndex={10}
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            mt={1}
            maxH="300px"
            overflowY="auto"
            boxShadow="lg"
          >
            {filteredResults.length > 0 ? (
              <VStack spacing={0} align="stretch">
                {filteredResults.slice(0, 10).map((result) => (
                  <Box
                    key={result.id}
                    p={3}
                    cursor="pointer"
                    _hover={{ bg: hoverBg }}
                    onClick={() => handleAddTag(result)}
                    borderBottomWidth="1px"
                    borderColor={borderColor}
                    _last={{ borderBottom: "none" }}
                  >
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{result.title}</Text>
                        <Badge colorScheme="blue" size="sm">
                          #{result.slug}
                        </Badge>
                      </VStack>
                      <Icon as={FiPlus} color="green.500" boxSize={4} />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            ) : searchQuery.length >= 2 ? (
              <Box p={4} textAlign="center">
                <Text color="gray.500">
                  No K-Doms found for "{searchQuery}"
                </Text>
              </Box>
            ) : null}
          </Box>
        )}
      </Box>

      {/* Help text and limits */}
      <VStack align="start" spacing={2}>
        <Text fontSize="sm" color="gray.500">
          Search and select K-Doms to tag your post. Tags help others discover
          your content.
        </Text>

        {selectedTags.length >= maxTags && (
          <Alert status="warning" size="sm" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              You've reached the maximum of {maxTags} tags. Remove a tag to add
              a new one.
            </Text>
          </Alert>
        )}

        {debouncedQuery.length > 0 && debouncedQuery.length < 2 && (
          <Text fontSize="sm" color="gray.500">
            Type at least 2 characters to search for K-Doms
          </Text>
        )}
      </VStack>
    </VStack>
  );
}
