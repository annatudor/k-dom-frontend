// src/pages/KDomDiscussionPage.tsx
import { useState } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Icon,
  Grid,
  GridItem,
  Divider,
  Badge,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Flex,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiHome,
  FiMessageCircle,
  FiPlus,
  FiSearch,
  FiUsers,
  FiTrendingUp,
  FiCalendar,
} from "react-icons/fi";

import {
  useKDomDiscussion,
  useKDomDiscussionSearch,
} from "@/hooks/useKDomDiscussion";
import { PostCard } from "@/components/post/PostCard";
import { AutoTrackingViewCounter } from "@/components/view-tracking/ViewCounter";
import { useAuth } from "@/context/AuthContext";

export default function KDomDiscussionPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "most-liked">(
    "newest"
  );
  const [showSearchMode, setShowSearchMode] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Main discussion data
  const {
    discussion,
    posts,
    pagination,
    kdom,
    stats,
    isLoading,
    error,
    changePage,
    refetch,
  } = useKDomDiscussion(slug!, {
    page: 1,
    pageSize: 10,
  });

  // Search functionality
  const { search, searchResults, isSearching, clearSearch } =
    useKDomDiscussionSearch(slug!);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as "newest" | "oldest" | "most-liked";
    setSortBy(value);
  };

  const handleRefresh = () => {
    refetch().catch(console.error);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="center" justify="center" minH="400px">
            <Spinner size="xl" thickness="4px" color="blue.500" />
            <Text fontSize="lg" color="gray.600">
              Loading discussion...
            </Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Error state
  if (error || !discussion) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl" py={8}>
          <VStack spacing={6} align="center" justify="center" minH="400px">
            <Alert status="error" borderRadius="lg" maxW="md">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">K-Dom not found</Text>
                <Text fontSize="sm">
                  The K-Dom you're looking for doesn't exist or has been
                  removed.
                </Text>
              </VStack>
            </Alert>
            <HStack spacing={4}>
              <Button
                leftIcon={<FiArrowLeft />}
                onClick={() => navigate(-1)}
                variant="outline"
              >
                Go Back
              </Button>
              <Button
                leftIcon={<FiHome />}
                as={RouterLink}
                to="/"
                colorScheme="blue"
              >
                Go Home
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    );
  }

  const currentPosts = searchResults?.posts.items || posts;
  const currentPagination = searchResults?.posts || pagination;

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    search({
      page: 1,
      pageSize: 10,
      contentQuery: searchQuery,
      sortBy,
    });
    setShowSearchMode(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    clearSearch();
    setShowSearchMode(false);
  };

  return (
    <Box minH="100vh" bg={bgColor} pt="80px">
      {/* View Tracking */}
      <AutoTrackingViewCounter
        contentType="KDom"
        contentId={kdom?.id || ""}
        variant="minimal"
        showDebugInfo={import.meta.env.DEV}
      />

      <Container maxW="container.xl" py={6}>
        {/* Breadcrumb */}
        <Breadcrumb mb={6} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">
              <HStack spacing={1}>
                <FiHome size={14} />
                <Text>Home</Text>
              </HStack>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to={`/kdoms/slug/${slug}`}>
              {kdom?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>Discussion</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <Card mb={8} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <VStack align="start" spacing={2}>
                <HStack spacing={3}>
                  <Icon as={FiMessageCircle} boxSize={8} color="blue.500" />
                  <VStack align="start" spacing={0}>
                    <Heading size="xl" color="blue.600">
                      Discussion: {kdom?.title}
                    </Heading>
                    <Text color="gray.600" fontSize="lg">
                      Community conversations about this K-Dom
                    </Text>
                  </VStack>
                </HStack>

                {/* Quick Stats */}
                <HStack spacing={6} mt={4}>
                  <HStack spacing={2}>
                    <Icon as={FiMessageCircle} color="blue.500" boxSize={4} />
                    <Text fontWeight="semibold">{stats?.totalPosts || 0}</Text>
                    <Text color="gray.600">posts</Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FiTrendingUp} color="green.500" boxSize={4} />
                    <Text fontWeight="semibold">
                      {stats?.totalComments || 0}
                    </Text>
                    <Text color="gray.600">comments</Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FiUsers} color="purple.500" boxSize={4} />
                    <Text fontWeight="semibold">
                      {stats?.uniquePosterCount || 0}
                    </Text>
                    <Text color="gray.600">contributors</Text>
                  </HStack>
                  {stats?.lastPostDate && (
                    <HStack spacing={2}>
                      <Icon as={FiCalendar} color="orange.500" boxSize={4} />
                      <Text color="gray.600">
                        Last post:{" "}
                        {new Date(stats.lastPostDate).toLocaleDateString()}
                      </Text>
                    </HStack>
                  )}
                </HStack>
              </VStack>

              <VStack spacing={3} align="end">
                <HStack spacing={3}>
                  <Button
                    leftIcon={<FiArrowLeft />}
                    as={RouterLink}
                    to={`/kdoms/slug/${slug}`}
                    variant="outline"
                    size="sm"
                  >
                    Back to K-Dom
                  </Button>
                  {user && (
                    <Button
                      leftIcon={<FiPlus />}
                      as={RouterLink}
                      to="/create-post"
                      colorScheme="blue"
                      size="sm"
                    >
                      New Post
                    </Button>
                  )}
                </HStack>
              </VStack>
            </Flex>
          </CardHeader>
        </Card>

        {/* Search and Filters */}
        <Card mb={6} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Grid
              templateColumns={{ base: "1fr", md: "1fr auto auto" }}
              gap={4}
              alignItems="end"
            >
              {/* Search Input */}
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  bg="white"
                  _dark={{ bg: "gray.700" }}
                />
              </InputGroup>

              {/* Sort Select */}
              <Select
                value={sortBy}
                onChange={handleSortChange}
                size="lg"
                maxW="200px"
                bg="white"
                _dark={{ bg: "gray.700" }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-liked">Most Liked</option>
              </Select>

              {/* Action Buttons */}
              <HStack spacing={2}>
                <Button
                  onClick={handleSearch}
                  colorScheme="blue"
                  size="lg"
                  isLoading={isSearching}
                  leftIcon={<FiSearch />}
                >
                  Search
                </Button>
                {showSearchMode && (
                  <Button
                    onClick={handleClearSearch}
                    variant="outline"
                    size="lg"
                  >
                    Clear
                  </Button>
                )}
              </HStack>
            </Grid>

            {/* Search Mode Indicator */}
            {showSearchMode && (
              <HStack mt={4} p={3} bg="blue.50" borderRadius="lg" spacing={2}>
                <Icon as={FiSearch} color="blue.500" />
                <Text color="blue.700" fontWeight="medium">
                  Showing search results for: "{searchQuery}"
                </Text>
                <Badge colorScheme="blue" ml="auto">
                  {currentPagination?.totalCount || 0} results
                </Badge>
              </HStack>
            )}
          </CardBody>
        </Card>

        {/* Main Content */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap={8}>
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Posts List */}
              {currentPosts && currentPosts.length > 0 ? (
                <>
                  {currentPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      showComments={false}
                      enableViewTracking={true}
                      onUpdate={refetch}
                    />
                  ))}

                  {/* Pagination */}
                  {currentPagination && currentPagination.totalPages > 1 && (
                    <Card
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <CardBody>
                        <HStack justify="space-between" align="center">
                          <Text fontSize="sm" color="gray.600">
                            Showing{" "}
                            {(currentPagination.currentPage - 1) *
                              currentPagination.pageSize +
                              1}{" "}
                            to{" "}
                            {Math.min(
                              currentPagination.currentPage *
                                currentPagination.pageSize,
                              currentPagination.totalCount
                            )}{" "}
                            of {currentPagination.totalCount} posts
                          </Text>

                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              onClick={() =>
                                changePage(currentPagination.currentPage - 1)
                              }
                              isDisabled={currentPagination.currentPage <= 1}
                              variant="outline"
                            >
                              Previous
                            </Button>

                            {/* Page Numbers */}
                            {Array.from(
                              {
                                length: Math.min(
                                  5,
                                  currentPagination.totalPages
                                ),
                              },
                              (_, i) => {
                                const pageNum = i + 1;
                                return (
                                  <Button
                                    key={pageNum}
                                    size="sm"
                                    onClick={() => changePage(pageNum)}
                                    colorScheme={
                                      currentPagination.currentPage === pageNum
                                        ? "blue"
                                        : "gray"
                                    }
                                    variant={
                                      currentPagination.currentPage === pageNum
                                        ? "solid"
                                        : "outline"
                                    }
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              }
                            )}

                            <Button
                              size="sm"
                              onClick={() =>
                                changePage(currentPagination.currentPage + 1)
                              }
                              isDisabled={
                                currentPagination.currentPage >=
                                currentPagination.totalPages
                              }
                              variant="outline"
                            >
                              Next
                            </Button>
                          </HStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  )}
                </>
              ) : (
                /* Empty State */
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody py={12}>
                    <VStack spacing={6} align="center">
                      <Icon
                        as={FiMessageCircle}
                        boxSize={16}
                        color="gray.400"
                      />
                      <VStack spacing={2} textAlign="center">
                        <Heading size="lg" color="gray.500">
                          {showSearchMode
                            ? "No results found"
                            : "No discussions yet"}
                        </Heading>
                        <Text color="gray.600" maxW="md" lineHeight="tall">
                          {showSearchMode
                            ? "Try adjusting your search terms or filters to find what you're looking for."
                            : "Be the first to start a conversation about this K-Dom. Share your thoughts, ask questions, or contribute ideas!"}
                        </Text>
                      </VStack>
                      {user && (
                        <Button
                          as={RouterLink}
                          to="/create-post"
                          colorScheme="blue"
                          size="lg"
                          leftIcon={<FiPlus />}
                          borderRadius="full"
                        >
                          Create First Post
                        </Button>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </GridItem>

          {/* Sidebar */}
          <GridItem display={{ base: "none", lg: "block" }}>
            <Box position="sticky" top="100px">
              <VStack spacing={6} align="stretch">
                {/* K-Dom Info */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader pb={3}>
                    <Text fontSize="lg" fontWeight="bold">
                      About this K-Dom
                    </Text>
                  </CardHeader>
                  <CardBody pt={3}>
                    <VStack spacing={4} align="start">
                      <VStack spacing={2} align="start">
                        <Text fontWeight="semibold" color="blue.600">
                          {kdom?.title}
                        </Text>
                        {kdom?.description && (
                          <Text
                            fontSize="sm"
                            color="gray.600"
                            lineHeight="tall"
                          >
                            {kdom.description}
                          </Text>
                        )}
                      </VStack>

                      <Divider />

                      <VStack spacing={2} align="start" w="full">
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.700"
                        >
                          Author: {kdom?.authorUsername}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {kdom?.followersCount} followers
                        </Text>
                      </VStack>

                      <Button
                        as={RouterLink}
                        to={`/kdoms/slug/${slug}`}
                        variant="outline"
                        size="sm"
                        w="full"
                        leftIcon={<FiArrowLeft />}
                      >
                        View K-Dom Page
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Quick Actions */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader pb={3}>
                    <Text fontSize="lg" fontWeight="bold">
                      Quick Actions
                    </Text>
                  </CardHeader>
                  <CardBody pt={3}>
                    <VStack spacing={3} align="stretch">
                      {user && (
                        <Button
                          as={RouterLink}
                          to="/create-post"
                          colorScheme="blue"
                          leftIcon={<FiPlus />}
                          size="sm"
                        >
                          Create New Post
                        </Button>
                      )}
                      <Button
                        onClick={handleRefresh}
                        variant="outline"
                        leftIcon={<FiTrendingUp />}
                        size="sm"
                      >
                        Refresh Discussion
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Community Guidelines */}
                <Card bg="blue.50" borderColor="blue.200" borderWidth="2px">
                  <CardBody py={6}>
                    <VStack spacing={4} textAlign="center">
                      <Icon as={FiUsers} color="blue.500" fontSize="3xl" />
                      <Text fontSize="md" fontWeight="bold" color="blue.700">
                        Community Guidelines
                      </Text>
                      <Text fontSize="sm" color="blue.600" lineHeight="tall">
                        Keep discussions respectful, on-topic, and constructive.
                        Help maintain a welcoming environment for all community
                        members.
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
