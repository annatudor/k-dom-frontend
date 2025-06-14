// src/pages/ExplorePage.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  useColorModeValue,
  Flex,
  Spacer,
  Icon,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useExploreKDoms } from "@/hooks/useExploreKDoms";
import { KDomExploreCard } from "@/components/explore/KDomExploreCard";
import { ExploreFilters } from "@/components/explore/ExploreFilters";
import type { ExploreFilterDto, ExploreKDomDto } from "@/types/Explore";

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // Get filters from URL params
  const [filters, setFilters] = useState<Partial<ExploreFilterDto>>({
    hub: searchParams.get("hub") || "",
    search: searchParams.get("search") || "",
    sortBy:
      (searchParams.get("sortBy") as "newest" | "alphabetical") || "newest",
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: 20,
  });

  // Fetch data
  const { data, isLoading, error, refetch } = useExploreKDoms(filters);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.hub) params.set("hub", filters.hub);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy && filters.sortBy !== "newest")
      params.set("sortBy", filters.sortBy);
    if (filters.page && filters.page > 1)
      params.set("page", filters.page.toString());

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const updateFilters = (newFilters: Partial<ExploreFilterDto>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const handleHubChange = (hub: string) => {
    updateFilters({ hub, page: 1 });
  };

  const handleSearchChange = (search: string) => {
    updateFilters({ search, page: 1 });
  };

  const handleSortChange = (sortBy: string) => {
    updateFilters({ sortBy: sortBy as "newest" | "alphabetical", page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({
      hub: "",
      search: "",
      sortBy: "newest",
      page: 1,
      pageSize: 20,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
  };

  const canGoPrevious = (filters.page || 1) > 1;
  const canGoNext =
    data && data.totalPages ? (filters.page || 1) < data.totalPages : false;

  return (
    <Box minH="100vh" bg={bgColor} pt="80px">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={2} align="start">
            <Heading size="xl" color="purple.600">
              Explore K-Doms
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Discover amazing K-Doms created by the community
            </Text>
          </VStack>

          {/* Main Content */}
          <HStack align="start" spacing={8}>
            {/* Sidebar Filters */}
            <Box w="300px" flexShrink={0}>
              <ExploreFilters
                hub={filters.hub}
                search={filters.search}
                sortBy={filters.sortBy}
                onHubChange={handleHubChange}
                onSearchChange={handleSearchChange}
                onSortChange={handleSortChange}
                onClearFilters={handleClearFilters}
              />
            </Box>

            {/* Content Area */}
            <VStack flex="1" spacing={6} align="stretch">
              {/* Results Header */}
              {data && (
                <Flex align="center">
                  <Text color="gray.600">
                    {data.totalCount || 0} K-Dom
                    {(data.totalCount || 0) !== 1 ? "s" : ""} found
                  </Text>
                  <Spacer />
                  <Text fontSize="sm" color="gray.500">
                    Page {data.currentPage || 1} of {data.totalPages || 1}
                  </Text>
                </Flex>
              )}

              {/* Loading State */}
              {isLoading && (
                <VStack spacing={4} py={8}>
                  <Spinner size="xl" thickness="4px" color="purple.500" />
                  <Text color="gray.600">Loading K-Doms...</Text>
                </VStack>
              )}

              {/* Error State */}
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  Failed to load K-Doms. Please try again.
                  <Button ml={4} size="sm" onClick={() => refetch()}>
                    Retry
                  </Button>
                </Alert>
              )}

              {/* Results Grid */}
              {data && data.items && data.items.length > 0 && (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {data.items.map((kdom: ExploreKDomDto) => (
                    <KDomExploreCard
                      key={kdom.id}
                      kdom={kdom}
                      // onFollow={handleFollow} // TODO: Add follow functionality
                      // isFollowing={false} // TODO: Check follow status
                    />
                  ))}
                </SimpleGrid>
              )}

              {/* Empty State */}
              {data && data.items && data.items.length === 0 && (
                <VStack spacing={4} py={8}>
                  <Text fontSize="lg" color="gray.600">
                    No K-Doms found matching your criteria
                  </Text>
                  <Text color="gray.500">
                    Try adjusting your filters or search terms
                  </Text>
                  <Button colorScheme="purple" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </VStack>
              )}

              {/* Pagination */}
              {data && data.totalPages && data.totalPages > 1 && (
                <HStack justify="center" spacing={4} pt={4}>
                  <Button
                    leftIcon={<Icon as={FiChevronLeft} />}
                    isDisabled={!canGoPrevious}
                    onClick={() => handlePageChange((filters.page || 1) - 1)}
                    variant="outline"
                  >
                    Previous
                  </Button>

                  <Text color="gray.600">
                    Page {filters.page || 1} of {data.totalPages || 1}
                  </Text>

                  <Button
                    rightIcon={<Icon as={FiChevronRight} />}
                    isDisabled={!canGoNext}
                    onClick={() => handlePageChange((filters.page || 1) + 1)}
                    variant="outline"
                  >
                    Next
                  </Button>
                </HStack>
              )}
            </VStack>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
