// src/components/kdom/ParentKDomSearch.tsx
import { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Badge,
  Spinner,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FiSearch, FiX } from "react-icons/fi";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import { searchKDomsForParent } from "@/api/kdom";
import type { KDomSearchResult } from "@/types/KDom";

interface ParentKDomSearchProps {
  currentKDomId: string; // Pentru a evita să se selecteze pe sine
  selectedParentId?: string | null;
  selectedParentTitle?: string | null;
  onParentSelect: (parent: KDomSearchResult | null) => void;
}

export function ParentKDomSearch({
  currentKDomId,
  selectedParentId,
  selectedParentTitle,
  onParentSelect,
}: ParentKDomSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [isOpen, setIsOpen] = useState(false);

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  // Query pentru căutare
  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["kdom-search", debouncedQuery],
    queryFn: () => searchKDomsForParent(debouncedQuery),
    enabled: debouncedQuery.length >= 2, // Caută doar dacă sunt măcar 2 caractere
  });

  // Filtrează rezultatele pentru a exclude K-Dom-ul curent
  const filteredResults = searchResults.filter(
    (result) => result.id !== currentKDomId
  );

  useEffect(() => {
    setIsOpen(debouncedQuery.length >= 2 && filteredResults.length > 0);
  }, [debouncedQuery, filteredResults]);

  const handleSelectParent = (parent: KDomSearchResult) => {
    onParentSelect(parent);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleClearParent = () => {
    onParentSelect(null);
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <FormControl>
      <FormLabel fontWeight="semibold">Parent K-Dom (Optional)</FormLabel>

      {/* Afișează parent-ul selectat */}
      {selectedParentId && selectedParentTitle && (
        <Box
          p={3}
          bg={cardBg}
          borderWidth="1px"
          borderColor="green.200"
          borderRadius="lg"
          mb={3}
        >
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontWeight="semibold" color="green.600">
                Selected Parent:
              </Text>
              <Text>{selectedParentTitle}</Text>
            </VStack>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              leftIcon={<FiX />}
              onClick={handleClearParent}
            >
              Remove
            </Button>
          </HStack>
        </Box>
      )}

      {/* Search input */}
      <Box position="relative">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch />
          </InputLeftElement>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a parent K-Dom..."
            disabled={!!selectedParentId} // Dezactivează dacă e deja selectat un parent
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
                {filteredResults.map((result) => (
                  <Box
                    key={result.id}
                    p={3}
                    cursor="pointer"
                    _hover={{ bg: hoverBg }}
                    onClick={() => handleSelectParent(result)}
                    borderBottomWidth="1px"
                    borderColor={borderColor}
                    _last={{ borderBottom: "none" }}
                  >
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold">{result.title}</Text>
                      {result.description && (
                        <Text fontSize="sm" color="gray.500">
                          {result.description}
                        </Text>
                      )}
                      <Badge colorScheme="blue" size="sm">
                        {result.slug}
                      </Badge>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Box p={4} textAlign="center">
                <Text color="gray.500">No K-Doms found</Text>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Text fontSize="sm" color="gray.500" mt={1}>
        Search and select a K-Dom to make it the parent of this page. This
        creates a hierarchical relationship.
      </Text>
    </FormControl>
  );
}
