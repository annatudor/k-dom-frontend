// src/components/explore/ExploreSearchSort.tsx
import {
  Box,
  HStack,
  VStack,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Text,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiSearch, FiX, FiFilter } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import type { ExploreFilters } from "@/api/explore";

interface ExploreSearchSortProps {
  filters: ExploreFilters;
  totalCount: number;
  onUpdateFilter: (key: keyof ExploreFilters, value: any) => void;
  activeFiltersCount: number;
}

export const ExploreSearchSort: React.FC<ExploreSearchSortProps> = ({
  filters,
  totalCount,
  onUpdateFilter,
  activeFiltersCount,
}) => {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Update filters when debounced search value changes
  useEffect(() => {
    if (debouncedSearchValue !== filters.search) {
      onUpdateFilter("search", debouncedSearchValue || undefined);
    }
  }, [debouncedSearchValue, filters.search, onUpdateFilter]);

  const clearSearch = () => {
    setSearchValue("");
    onUpdateFilter("search", undefined);
  };

  const sortOptions = [
    { value: "popular", label: "🔥 Most Popular" },
    { value: "newest", label: "🆕 Newest First" },
    { value: "oldest", label: "📅 Oldest First" },
    { value: "trending", label: "📈 Trending" },
    { value: "alphabetical", label: "🔤 A-Z" },
  ];

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      mb={6}
    >
      <VStack spacing={4} align="stretch">
        {/* Search and Sort Row */}
        <HStack spacing={4} align="end">
          {/* Search Input */}
          <Box flex="1">
            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
              Search K-Doms
            </Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray" />
              </InputLeftElement>
              <Input
                placeholder="Search by title, description, or author..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                bg={useColorModeValue("white", "gray.700")}
              />
              {searchValue && (
                <InputRightElement>
                  <IconButton
                    icon={<FiX />}
                    aria-label="Clear search"
                    size="sm"
                    variant="ghost"
                    onClick={clearSearch}
                  />
                </InputRightElement>
              )}
            </InputGroup>
          </Box>

          {/* Sort Select */}
          <Box minW="200px">
            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
              Sort by
            </Text>
            <Select
              value={filters.sortBy || "popular"}
              onChange={(e) => onUpdateFilter("sortBy", e.target.value)}
              bg={useColorModeValue("white", "gray.700")}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>
        </HStack>

        {/* Results Summary */}
        <HStack justify="space-between" align="center" pt={2}>
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.600">
              {totalCount.toLocaleString()} K-Doms found
            </Text>

            {activeFiltersCount > 0 && (
              <HStack spacing={2}>
                <FiFilter size={14} />
                <Badge colorScheme="purple" variant="subtle">
                  {activeFiltersCount} filter
                  {activeFiltersCount !== 1 ? "s" : ""} active
                </Badge>
              </HStack>
            )}
          </HStack>

          {filters.search && (
            <Text fontSize="sm" color="purple.600" fontWeight="medium">
              Searching for: "{filters.search}"
            </Text>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};
