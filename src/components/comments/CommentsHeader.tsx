// src/components/comments/CommentsHeader.tsx

import {
  HStack,
  VStack,
  Heading,
  Text,
  Select,
  Button,
  Badge,
  Icon,
  useColorModeValue,
  Divider,
  Flex,
  Box,
} from "@chakra-ui/react";
import {
  FiMessageCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiClock,
  FiThumbsUp,
} from "react-icons/fi";

import type {
  CommentSortOption,
  CommentStats,
  CommentsConfig,
} from "@/types/CommentSystem";

interface CommentsHeaderProps {
  stats: CommentStats;
  config: CommentsConfig;
  sortBy: CommentSortOption;
  onSortChange: (sort: CommentSortOption) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const sortOptionLabels: Record<CommentSortOption, string> = {
  newest: "Newest First",
  oldest: "Oldest First",
  mostLiked: "Most Liked",
};

const sortOptionIcons: Record<CommentSortOption, typeof FiClock> = {
  newest: FiClock,
  oldest: FiClock,
  mostLiked: FiThumbsUp,
};

export function CommentsHeader({
  stats,
  config,
  sortBy,
  onSortChange,
  onRefresh,
  isLoading = false,
}: CommentsHeaderProps) {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box>
      {/* Main Header */}
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        flexWrap={{ base: "wrap", md: "nowrap" }}
        gap={4}
      >
        {/* Title and Stats */}
        <VStack align="start" spacing={2} flex="1" minW="200px">
          <HStack spacing={3} align="center">
            <Icon as={FiMessageCircle} color="blue.500" boxSize={6} />
            <Heading size="lg" color="blue.600">
              Comments
            </Heading>
            <Badge
              colorScheme="blue"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="md"
              fontWeight="bold"
            >
              {stats.totalComments}
            </Badge>
          </HStack>

          {/* Detailed Stats */}
          <HStack spacing={4} fontSize="sm" color={textColor}>
            <HStack spacing={1}>
              <Text fontWeight="medium">{stats.mainComments}</Text>
              <Text>main comments</Text>
            </HStack>
            {stats.totalReplies > 0 && (
              <HStack spacing={1}>
                <Text fontWeight="medium">{stats.totalReplies}</Text>
                <Text>replies</Text>
              </HStack>
            )}
          </HStack>
        </VStack>

        {/* Controls */}
        <HStack spacing={3} flexShrink={0}>
          {/* Sort Dropdown */}
          {config.sortOptions && config.sortOptions.length > 1 && (
            <VStack align="end" spacing={1}>
              <Text fontSize="xs" color={textColor} fontWeight="medium">
                Sort by
              </Text>
              <Select
                size="sm"
                value={sortBy}
                onChange={(e) =>
                  onSortChange(e.target.value as CommentSortOption)
                }
                minW="140px"
                variant="outline"
              >
                {config.sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {sortOptionLabels[option]}
                  </option>
                ))}
              </Select>
            </VStack>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <Button
              leftIcon={<FiRefreshCw />}
              variant="outline"
              size="sm"
              onClick={onRefresh}
              isLoading={isLoading}
              loadingText="Refreshing"
              mt={"23px"}
            >
              Refresh
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Sort Indicator */}
      <Box mb={4}>
        <HStack spacing={2} align="center" color={textColor} fontSize="sm">
          <Icon as={sortOptionIcons[sortBy]} boxSize={4} />
          <Text>Showing comments {sortOptionLabels[sortBy].toLowerCase()}</Text>
          {sortBy === "mostLiked" && (
            <Icon as={FiTrendingUp} boxSize={4} color="orange.500" />
          )}
        </HStack>
      </Box>

      {/* Divider */}
      <Divider borderColor={borderColor} mb={6} />

      {/* Empty State Message */}
      {stats.totalComments === 0 && (
        <Box
          textAlign="center"
          py={8}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          borderStyle="dashed"
        >
          <VStack spacing={3}>
            <Icon as={FiMessageCircle} boxSize={12} color="gray.400" />
            <Text fontSize="lg" fontWeight="semibold" color="gray.500">
              No comments yet
            </Text>
            <Text fontSize="sm" color="gray.400" maxW="sm">
              Be the first to share your thoughts! Start a conversation by
              leaving a comment below.
            </Text>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
