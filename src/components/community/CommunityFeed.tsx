// src/components/community/CommunityFeed.tsx
import {
  VStack,
  Text,
  useColorModeValue,
  Box,
  Spinner,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FiRefreshCw, FiMessageCircle } from "react-icons/fi";
import { PostCard } from "@/components/post/PostCard";
import type { PostReadDto } from "@/types/Post";

interface CommunityFeedProps {
  posts: PostReadDto[];
  isLoading: boolean;
  isAuthenticated: boolean;
  onRefresh: () => void;
}

export function CommunityFeed({
  posts,
  isLoading,
  isAuthenticated,
  onRefresh,
}: CommunityFeedProps) {
  const textColor = useColorModeValue("gray.700", "gray.200");

  if (isLoading) {
    return (
      <VStack spacing={6} py={8}>
        <Spinner size="xl" thickness="4px" color="purple.500" />
        <Text color={textColor}>Loading your feed...</Text>
      </VStack>
    );
  }

  if (posts.length === 0) {
    return (
      <VStack spacing={6} py={12} textAlign="center">
        <Icon as={FiMessageCircle} boxSize={16} color="gray.400" />
        <VStack spacing={3}>
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            {isAuthenticated
              ? "Your feed is empty"
              : "Welcome to the community!"}
          </Text>
          <Text color="gray.500" maxW="md" lineHeight="tall">
            {isAuthenticated
              ? "Follow some K-Doms or users to see posts in your personalized feed."
              : "Discover amazing content from our community. Sign in to get a personalized experience!"}
          </Text>
        </VStack>
        <Button
          leftIcon={<Icon as={FiRefreshCw} />}
          colorScheme="purple"
          onClick={onRefresh}
          variant="outline"
        >
          Refresh Feed
        </Button>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Feed header */}
      <Box>
        <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={2}>
          {isAuthenticated ? "Your Feed" : "Community Feed"}
        </Text>
        <Text color="gray.500" fontSize="sm">
          {isAuthenticated
            ? "Posts from K-Doms and users you follow"
            : "Trending posts from the community"}
        </Text>
      </Box>

      {/* Posts */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          showComments={false}
          onUpdate={onRefresh}
          enableViewTracking={true}
        />
      ))}

      {/* Load more button */}
      {posts.length >= 20 && (
        <Box textAlign="center" py={6}>
          <Button
            variant="outline"
            colorScheme="purple"
            onClick={onRefresh}
            size="lg"
          >
            Load More Posts
          </Button>
        </Box>
      )}
    </VStack>
  );
}
