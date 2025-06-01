// src/pages/PostDetailPage.tsx
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
} from "@chakra-ui/react";
import { FiArrowLeft, FiHome, FiMessageCircle } from "react-icons/fi";

import { getPostById } from "@/api/post";
import { PostCard } from "@/components/post/PostCard";
import { PostHeader } from "@/components/post/PostHeader";
import { PostTagsDisplay } from "@/components/post/PostTagsDisplay";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

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
      <Container maxW="container.lg" py={6}>
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

        <HStack spacing={8} align="start">
          {/* Main Content */}
          <VStack spacing={8} align="stretch" flex="1">
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

            {/* Main Post */}
            <Box>
              <PostCard
                post={post}
                showComments={false}
                onUpdate={() => {
                  // Refresh post data
                  window.location.reload();
                }}
              />
            </Box>

            {/* Comments Section */}
            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              boxShadow="sm"
            >
              <CardBody p={6}>
                <VStack spacing={6} align="stretch">
                  {/* Comments Header */}
                  <HStack spacing={3} align="center">
                    <Icon as={FiMessageCircle} color="blue.500" boxSize={6} />
                    <Heading size="lg" color="blue.600">
                      Discussion
                    </Heading>
                  </HStack>

                  <Divider />

                  {/* Comments Component */}
                  {/* <PostComments postId={post.id} /> */}
                </VStack>
              </CardBody>
            </Card>

            {/* Related Posts or Actions */}
            <Card bg="blue.50" borderColor="blue.200" borderWidth="2px">
              <CardBody py={6}>
                <VStack spacing={4} textAlign="center">
                  <Icon as={FiMessageCircle} color="blue.500" fontSize="3xl" />
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
        </HStack>
      </Container>
    </Box>
  );
}
