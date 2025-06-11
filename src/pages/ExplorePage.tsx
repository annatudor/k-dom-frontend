// src/pages/ExplorePage.tsx
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Button,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { FiHome, FiCompass, FiRefreshCw } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useExplore } from "@/hooks/useExplore";
import { ExploreFilters } from "@/components/explore/ExploreFilters";
import { ExploreSearchSort } from "@/components/explore/ExploreSearchSort";
import { KDomCard } from "@/components/explore/KDomCard";
import { ExplorePagination } from "@/components/explore/ExplorePagination";
import { ExploreSidebar } from "@/components/explore/ExploreSidebar";

export default function ExplorePage() {
  const {
    // Data
    kdoms,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    facets,
    trendingKDoms,

    // Metadata
    availableHubs,
    availableLanguages,
    availableThemes,

    // Current filters
    filters,

    // Loading states
    isLoading,
    isLoadingMetadata,
    isLoadingTrending,

    // Error states
    error,

    // Filter management
    updateFilter,
    clearFilters,
    clearFilter,
    hasActiveFilters,
    activeFiltersCount,

    // Pagination
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,

    // Actions
    refetch,
  } = useExplore();

  const bgColor = useColorModeValue("gray.50", "gray.900");

  // Loading state
  if (isLoadingMetadata) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text>Loading explore options...</Text>
        </VStack>
      </Center>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxW="1200px" py={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">Failed to load K-Doms</Text>
            <Text fontSize="sm">
              {error.message ||
                "Something went wrong while loading the explore page."}
            </Text>
            <Button
              size="sm"
              leftIcon={<FiRefreshCw />}
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </VStack>
        </Alert>
      </Container>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="1400px" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb fontSize="sm">
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/">
                <HStack spacing={1}>
                  <FiHome />
                  <Text>Home</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>
                <HStack spacing={1}>
                  <FiCompass />
                  <Text>Explore</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Page Header */}
          <VStack spacing={2} align="start">
            <Heading size="xl" color="purple.600">
              🎌 Explore K-Doms
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Discover amazing Korean culture content created by our passionate
              community
            </Text>
          </VStack>

          {/* Main Content Grid */}
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 300px" }}
            gap={8}
            alignItems="start"
          >
            {/* Main Content */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Search and Sort */}
                <ExploreSearchSort
                  filters={filters}
                  totalCount={totalCount}
                  onUpdateFilter={updateFilter}
                  activeFiltersCount={activeFiltersCount}
                />

                {/* Results */}
                {isLoading ? (
                  <Center py={12}>
                    <VStack spacing={4}>
                      <Spinner size="xl" color="purple.500" thickness="4px" />
                      <Text>Searching K-Doms...</Text>
                    </VStack>
                  </Center>
                ) : kdoms.length > 0 ? (
                  <>
                    {/* K-Dom Grid */}
                    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                      {kdoms.map((kdom) => (
                        <KDomCard key={kdom.id} kdom={kdom} />
                      ))}
                    </SimpleGrid>

                    {/* Pagination */}
                    <ExplorePagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalCount={totalCount}
                      pageSize={pageSize}
                      onPageChange={goToPage}
                      onPageSizeChange={(newPageSize) =>
                        updateFilter("pageSize", newPageSize)
                      }
                      canGoNext={canGoNext}
                      canGoPrev={canGoPrev}
                    />
                  </>
                ) : (
                  /* No Results */
                  <Center py={12}>
                    <VStack spacing={4} textAlign="center">
                      <Text fontSize="6xl">🔍</Text>
                      <Heading size="lg" color="gray.500">
                        No K-Doms Found
                      </Heading>
                      <Text color="gray.600" maxW="400px">
                        {hasActiveFilters
                          ? "Try adjusting your filters or search terms to find more K-Doms."
                          : "It looks like there are no K-Doms available right now. Check back later!"}
                      </Text>
                      {hasActiveFilters && (
                        <Button
                          colorScheme="purple"
                          variant="outline"
                          onClick={clearFilters}
                          leftIcon={<FiRefreshCw />}
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </VStack>
                  </Center>
                )}
              </VStack>
            </GridItem>

            {/* Sidebar */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Filters */}
                <ExploreFilters
                  filters={filters}
                  availableHubs={availableHubs}
                  availableLanguages={availableLanguages}
                  availableThemes={availableThemes}
                  facets={facets}
                  onUpdateFilter={updateFilter}
                  onClearFilters={clearFilters}
                  onClearFilter={clearFilter}
                  hasActiveFilters={hasActiveFilters}
                  activeFiltersCount={activeFiltersCount}
                />

                {/* Trending and Quick Actions */}
                <ExploreSidebar
                  trendingKDoms={trendingKDoms}
                  isLoadingTrending={isLoadingTrending}
                />
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
