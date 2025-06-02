// src/pages/PostDetailPage.tsx - Cu restricții pentru view stats
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Icon,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiHome,
  FiMessageCircle,
  FiBarChart2,
} from "react-icons/fi";

import { getPostById } from "@/api/post";
import { useAuth } from "@/context/AuthContext";
import { PostCard } from "@/components/post/PostCard";
import { PostHeader } from "@/components/post/PostHeader";
import { PostTagsDisplay } from "@/components/post/PostTagsDisplay";

// ✅ VIEW TRACKING COMPONENTS
import { AutoTrackingViewCounter } from "@/components/view-tracking/ViewCounter";
import { ViewStats } from "@/components/view-tracking/ViewStats";
import { DetailedViewStats } from "@/components/view-tracking/ViewStats";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ ADĂUGAT pentru verificări de permisiuni

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Query pentru postare
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId!),
    enabled: !!postId,
    retry: false,
  });

  // ✅ LOGICA DE PERMISIUNI pentru stats
  const canViewStats =
    user &&
    post &&
    (user.id === post.userId || // Owner-ul postării
      user.role === "admin" ||
      user.role === "moderator");

  // Loading state
  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="center" justify="center" minH="400px">
            <Spinner size="xl" thickness="4px" color="blue.500" />
            <Text fontSize="lg" color="gray.600">
              Loading post...
            </Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl" py={8}>
          <VStack spacing={6} align="center" justify="center" minH="400px">
            <Alert status="error" borderRadius="lg" maxW="md">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">Post not found</Text>
                <Text fontSize="sm">
                  The post you're looking for doesn't exist or has been removed.
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

  return (
    <Box minH="100vh" bg={bgColor} pt="80px">
      <Container maxW="container.xl" py={6}>
        {/* ✅ AUTO-TRACKING VIEW COUNTER - doar tracking, nu și afișarea stats */}
        <AutoTrackingViewCounter
          contentType="Post"
          contentId={post.id}
          variant="minimal"
          showDebugInfo={import.meta.env.DEV}
        />

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
            <BreadcrumbLink as={RouterLink} to="/posts">
              Community
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>Post by {post.username}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Navigation */}
        <HStack justify="space-between" align="center" mb={6}>
          <Button
            leftIcon={<FiArrowLeft />}
            onClick={() => navigate(-1)}
            variant="outline"
            size="sm"
          >
            Back
          </Button>
          <HStack spacing={3}>
            <Button
              as={RouterLink}
              to="/create-post"
              colorScheme="blue"
              size="sm"
            >
              Create Post
            </Button>
          </HStack>
        </HStack>

        {/* Main Layout cu sidebar pentru analytics */}
        <Grid
          templateColumns={{
            base: "1fr",
            lg: canViewStats ? "1fr 320px" : "1fr", // ✅ Sidebar doar dacă poate vedea stats
          }}
          gap={8}
        >
          {/* Main Content */}
          <GridItem>
            <VStack spacing={8} align="stretch">
              {/* Post Header with Author Info */}
              <PostHeader post={post} />

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <PostTagsDisplay
                  tags={post.tags}
                  variant="detailed"
                  showStats={true}
                />
              )}

              {/* Main Post - disable tracking aici pentru că tracking-ul principal e pe pagină */}
              <Box>
                <PostCard
                  post={post}
                  showComments={false}
                  enableViewTracking={false} // Dezactivat aici
                  onUpdate={() => {
                    window.location.reload();
                  }}
                />
              </Box>

              {/* ✅ DETAILED VIEW ANALYTICS - doar pentru owner/admin */}
              {canViewStats && (
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  boxShadow="sm"
                >
                  <CardBody p={6}>
                    <VStack spacing={6} align="stretch">
                      <HStack spacing={3} align="center">
                        <Icon as={FiBarChart2} color="purple.500" boxSize={6} />
                        <Heading size="lg" color="purple.600">
                          Post Analytics
                        </Heading>
                      </HStack>

                      <Divider />

                      <DetailedViewStats
                        contentType="Post"
                        contentId={post.id}
                        showComparison={true}
                      />
                    </VStack>
                  </CardBody>
                </Card>
              )}

              {/* Related Posts or Actions */}
              <Card bg="blue.50" borderColor="blue.200" borderWidth="2px">
                <CardBody py={6}>
                  <VStack spacing={4} textAlign="center">
                    <Icon
                      as={FiMessageCircle}
                      color="blue.500"
                      fontSize="3xl"
                    />
                    <Text fontSize="md" fontWeight="bold" color="blue.700">
                      Join the conversation
                    </Text>
                    <Text fontSize="sm" color="blue.600" lineHeight="tall">
                      Share your thoughts, ask questions, or add to the
                      discussion. Your voice matters in our community!
                    </Text>
                    <Button
                      as={RouterLink}
                      to="/create-post"
                      colorScheme="blue"
                      size="sm"
                      borderRadius="full"
                      px={6}
                    >
                      Create Your Own Post
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>

          {/* ✅ SIDEBAR CU VIEW STATISTICS - doar pentru owner/admin */}
          {canViewStats && (
            <GridItem display={{ base: "none", lg: "block" }}>
              <Box position="sticky" top="100px">
                <VStack spacing={6} align="stretch">
                  {/* Quick View Stats */}
                  <ViewStats
                    contentType="Post"
                    contentId={post.id}
                    variant="sidebar"
                    refreshInterval={300000}
                  />

                  {/* Performance Box */}
                  <Card bg="green.50" borderColor="green.200" borderWidth="2px">
                    <CardBody py={6}>
                      <VStack spacing={4} textAlign="center">
                        <Icon
                          as={FiBarChart2}
                          color="green.500"
                          fontSize="3xl"
                        />
                        <Text fontSize="md" fontWeight="bold" color="green.700">
                          Post Performance
                        </Text>
                        <Text fontSize="sm" color="green.600" lineHeight="tall">
                          Track how your post is performing with real-time
                          analytics and engagement metrics.
                        </Text>
                        <AutoTrackingViewCounter
                          contentType="Post"
                          contentId={post.id}
                          variant="detailed"
                        />
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Author Info Box */}
                  <Card
                    bg="purple.50"
                    borderColor="purple.200"
                    borderWidth="2px"
                  >
                    <CardBody py={6}>
                      <VStack spacing={4} textAlign="center">
                        <Text
                          fontSize="md"
                          fontWeight="bold"
                          color="purple.700"
                        >
                          About the Author
                        </Text>
                        <Text fontSize="sm" color="purple.600">
                          Posted by{" "}
                          <Text
                            as={RouterLink}
                            to={`/profile/${post.userId}`}
                            fontWeight="bold"
                            textDecoration="underline"
                          >
                            {post.username}
                          </Text>
                        </Text>
                        <Text fontSize="xs" color="purple.500">
                          {new Date(post.createdAt).toLocaleDateString()}
                          {post.isEdited && " (edited)"}
                        </Text>
                        <Button
                          as={RouterLink}
                          to={`/profile/${post.userId}`}
                          size="sm"
                          colorScheme="purple"
                          variant="outline"
                        >
                          View Profile
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </Box>
            </GridItem>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
