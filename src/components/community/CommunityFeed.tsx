// src/components/community/CommunityFeed.tsx - Compact fandom-style
import {
  VStack,
  Text,
  useColorModeValue,
  Box,
  Spinner,
  Button,
  Icon,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { FiRefreshCw, FiMessageCircle, FiTrendingUp } from "react-icons/fi";
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
  const headerBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (isLoading) {
    return (
      <VStack spacing={4} py={8} w="full">
        <Spinner size="lg" thickness="3px" color="purple.500" />
        <Text color={textColor} fontSize="sm">
          Loading your feed...
        </Text>
      </VStack>
    );
  }

  if (posts.length === 0) {
    return (
      <VStack spacing={6} py={12} textAlign="center" w="full">
        <Icon as={FiMessageCircle} boxSize={16} color="gray.400" />
        <VStack spacing={3}>
          <Heading size="md" color={textColor}>
            {isAuthenticated
              ? "Your feed is empty"
              : "Welcome to the community!"}
          </Heading>
          <Text color="gray.500" maxW="md" lineHeight="base" fontSize="sm">
            {isAuthenticated
              ? "Follow some fandoms or users to see posts in your personalized feed."
              : "Discover amazing content from our community. Sign in to get a personalized experience!"}
          </Text>
        </VStack>
        <HStack spacing={3}>
          <Button
            leftIcon={<Icon as={FiRefreshCw} />}
            colorScheme="purple"
            onClick={onRefresh}
            variant="outline"
            size="sm"
          >
            Refresh Feed
          </Button>
          {!isAuthenticated && (
            <Button
              leftIcon={<Icon as={FiTrendingUp} />}
              colorScheme="blue"
              size="sm"
            >
              Explore Trending
            </Button>
          )}
        </HStack>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch" w="full">
      {/* Feed header - compact */}
      <Box
        bg={headerBg}
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={0}>
            <Heading size="md" color={textColor}>
              {isAuthenticated ? "Your Feed" : "Community Feed"}
            </Heading>
            <Text color="gray.500" fontSize="xs">
              {isAuthenticated
                ? "Posts from fandoms and users you follow"
                : "Trending posts from the community"}
            </Text>
          </VStack>
          <Button
            leftIcon={<Icon as={FiRefreshCw} />}
            variant="outline"
            colorScheme="purple"
            onClick={onRefresh}
            size="xs"
            fontSize="xs"
          >
            Refresh
          </Button>
        </HStack>
      </Box>

      {/* Posts */}
      {posts.map((post, index) => (
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
        <Box textAlign="center" py={4}>
          <Button
            variant="outline"
            colorScheme="purple"
            onClick={onRefresh}
            size="sm"
            borderRadius="md"
            px={6}
          >
            Load More Posts
          </Button>
        </Box>
      )}
    </VStack>
  );
}
