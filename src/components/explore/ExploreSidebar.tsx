// src/components/explore/ExploreSidebar.tsx
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Button,
  Icon,
  useColorModeValue,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { FiTrendingUp, FiArrowRight, FiStar } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

interface TrendingKDom {
  id: string;
  title: string;
  slug: string;
  postScore: number;
  commentScore: number;
  followScore: number;
  editScore: number;
  totalScore: number;
}

interface ExploreSidebarProps {
  trendingKDoms: TrendingKDom[];
  isLoadingTrending: boolean;
}

export const ExploreSidebar: React.FC<ExploreSidebarProps> = ({
  trendingKDoms,
  isLoadingTrending,
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const TrendingKDomItem: React.FC<{ kdom: TrendingKDom; rank: number }> = ({
    kdom,
    rank,
  }) => {
    const getRankColor = (rank: number) => {
      if (rank === 1) return "yellow";
      if (rank === 2) return "gray";
      if (rank === 3) return "orange";
      return "purple";
    };

    const getRankEmoji = (rank: number) => {
      if (rank === 1) return "🥇";
      if (rank === 2) return "🥈";
      if (rank === 3) return "🥉";
      return "⭐";
    };

    return (
      <Box
        p={3}
        borderRadius="md"
        border="1px solid"
        borderColor={borderColor}
        _hover={{
          borderColor: "purple.300",
          bg: useColorModeValue("purple.50", "purple.900"),
        }}
        transition="all 0.2s"
        cursor="pointer"
        as={RouterLink}
        to={`/kdoms/slug/${kdom.slug}`}
      >
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between" align="center">
            <HStack spacing={2}>
              <Text fontSize="sm">{getRankEmoji(rank)}</Text>
              <Badge
                colorScheme={getRankColor(rank)}
                variant="subtle"
                size="sm"
              >
                #{rank}
              </Badge>
            </HStack>
            <HStack spacing={1}>
              <Icon as={FiTrendingUp} color="green.500" boxSize={3} />
              <Text fontSize="xs" color="green.500" fontWeight="bold">
                {kdom.totalScore}
              </Text>
            </HStack>
          </HStack>

          <Text
            fontSize="sm"
            fontWeight="medium"
            noOfLines={2}
            color="purple.600"
          >
            {kdom.title}
          </Text>

          <HStack spacing={3} fontSize="xs" color={mutedColor}>
            <Text>📝 {kdom.postScore}</Text>
            <Text>💬 {kdom.commentScore}</Text>
            <Text>👥 {kdom.followScore}</Text>
          </HStack>
        </VStack>
      </Box>
    );
  };

  const TrendingSkeleton = () => (
    <Box p={3} borderRadius="md" border="1px solid" borderColor={borderColor}>
      <VStack spacing={2} align="stretch">
        <HStack justify="space-between">
          <Skeleton height="20px" width="60px" />
          <Skeleton height="20px" width="40px" />
        </HStack>
        <SkeletonText mt="2" noOfLines={2} spacing="2" />
        <HStack spacing={3}>
          <Skeleton height="16px" width="30px" />
          <Skeleton height="16px" width="30px" />
          <Skeleton height="16px" width="30px" />
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <VStack spacing={6} align="stretch">
      {/* Quick Actions */}
      <Box
        bg={bgColor}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
        p={6}
      >
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="purple.600">
            Quick Actions
          </Heading>

          <Button
            as={RouterLink}
            to="/start-kdom"
            colorScheme="purple"
            size="sm"
            leftIcon={<FiStar />}
          >
            Create K-Dom
          </Button>

          <Button
            as={RouterLink}
            to="/community"
            variant="outline"
            colorScheme="purple"
            size="sm"
          >
            Join Community
          </Button>

          <Button
            as={RouterLink}
            to="/trending"
            variant="ghost"
            colorScheme="purple"
            size="sm"
            rightIcon={<FiArrowRight />}
          >
            View All Trending
          </Button>
        </VStack>
      </Box>

      {/* Trending K-Doms */}
      <Box
        bg={bgColor}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
        p={6}
      >
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between" align="center">
            <HStack spacing={2}>
              <Icon as={FiTrendingUp} color="purple.500" />
              <Heading size="md" color="purple.600">
                Trending Now
              </Heading>
            </HStack>
            <Badge colorScheme="purple" variant="subtle">
              Top 7
            </Badge>
          </HStack>

          <Text fontSize="sm" color={mutedColor}>
            Most active K-Doms this week
          </Text>

          <VStack spacing={3} align="stretch">
            {isLoadingTrending ? (
              // Loading skeletons
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TrendingSkeleton key={i} />
                ))}
              </>
            ) : trendingKDoms.length > 0 ? (
              // Trending K-Doms
              <>
                {trendingKDoms.slice(0, 7).map((kdom, index) => (
                  <TrendingKDomItem
                    key={kdom.id}
                    kdom={kdom}
                    rank={index + 1}
                  />
                ))}
              </>
            ) : (
              // No trending data
              <Box textAlign="center" py={4}>
                <Text fontSize="sm" color={mutedColor}>
                  📈 No trending data available
                </Text>
                <Text fontSize="xs" color={mutedColor} mt={2}>
                  Check back later for trending K-Doms
                </Text>
              </Box>
            )}
          </VStack>

          {trendingKDoms.length > 0 && (
            <Button
              as={RouterLink}
              to="/trending"
              variant="ghost"
              size="sm"
              rightIcon={<FiArrowRight />}
              colorScheme="purple"
            >
              View All Trending
            </Button>
          )}
        </VStack>
      </Box>

      {/* Tips */}
      <Box
        bg={useColorModeValue("blue.50", "blue.900")}
        borderRadius="lg"
        border="1px solid"
        borderColor={useColorModeValue("blue.200", "blue.700")}
        p={6}
      >
        <VStack spacing={3} align="stretch">
          <Heading size="sm" color="blue.600">
            💡 Explore Tips
          </Heading>

          <VStack spacing={2} align="stretch" fontSize="sm" color="blue.700">
            <Text>
              • Use filters to find K-Doms in your favorite categories
            </Text>
            <Text>• Sort by "Trending" to discover what's popular</Text>
            <Text>
              • Look for "Children-Friendly" badges for kids-friendly content
            </Text>
            <Text>• Follow K-Doms to see updates in your feed</Text>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
};
