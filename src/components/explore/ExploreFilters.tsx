// src/components/explore/ExploreFilters.tsx
import {
  VStack,
  HStack,
  Text,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
  Card,
  CardBody,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiSearch, FiX } from "react-icons/fi";
// Remove unused import

interface ExploreFiltersProps {
  hub?: string;
  search?: string;
  sortBy?: string;
  onHubChange: (hub: string) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

export function ExploreFilters({
  hub,
  search,
  sortBy,
  onHubChange,
  onSearchChange,
  onSortChange,
  onClearFilters,
}: ExploreFiltersProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const hubs: { value: string; label: string }[] = [
    { value: "", label: "All Categories" },
    { value: "Music", label: "Music" },
    { value: "Anime", label: "Anime" },
    { value: "Kpop", label: "K-Pop" },
    { value: "Gaming", label: "Gaming" },
    { value: "Literature", label: "Literature" },
    { value: "Fashion", label: "Fashion" },
    { value: "Food", label: "Food" },
    { value: "Beauty", label: "Beauty" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "alphabetical", label: "Alphabetical" },
  ];

  const hasActiveFilters = hub || search || (sortBy && sortBy !== "newest");

  return (
    <Card bg={cardBg} borderColor={borderColor}>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="sm">Filters</Heading>
            {hasActiveFilters && (
              <Button
                size="xs"
                variant="ghost"
                colorScheme="gray"
                leftIcon={<Icon as={FiX} />}
                onClick={onClearFilters}
              >
                Clear
              </Button>
            )}
          </HStack>

          {/* Search */}
          <VStack align="stretch" spacing={2}>
            <Text fontSize="sm" fontWeight="medium">
              Search
            </Text>
            <InputGroup>
              <InputLeftElement>
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search K-Doms..."
                value={search || ""}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </InputGroup>
          </VStack>

          {/* Category Filter */}
          <VStack align="stretch" spacing={2}>
            <Text fontSize="sm" fontWeight="medium">
              Category
            </Text>
            <Select
              value={hub || ""}
              onChange={(e) => onHubChange(e.target.value)}
            >
              {hubs.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </VStack>

          {/* Sort Options */}
          <VStack align="stretch" spacing={2}>
            <Text fontSize="sm" fontWeight="medium">
              Sort By
            </Text>
            <Select
              value={sortBy || "newest"}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
}
