// src/components/home/FeaturedKDomsSection.tsx - Updated version
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Icon,
  Button,
  Card,
  CardBody,
  Flex,
} from "@chakra-ui/react";
import {
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiArrowRight,
  FiMessageCircle,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

interface FeaturedKDom {
  id: string;
  title: string;
  slug: string;
  score: number;
  hub: string;
  followersCount?: number;
  postsCount?: number;
  commentsCount?: number;
}

interface FeaturedKDomsProps {
  featuredKDoms: FeaturedKDom[];
}

interface KDomCardProps {
  kdom: FeaturedKDom;
  rank: number;
}

// Format relative time helper
const formatRelativeTime = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

const KDomCard: React.FC<KDomCardProps> = ({ kdom, rank }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Generate some mock data based on the score if not provided
  const mockFollowers =
    kdom.followersCount ||
    Math.floor(kdom.score / 10) + Math.floor(Math.random() * 20) + 5;
  const mockPosts =
    kdom.postsCount ||
    Math.floor(kdom.score / 5) + Math.floor(Math.random() * 10) + 2;
  const mockComments =
    kdom.commentsCount ||
    Math.floor(kdom.score / 3) + Math.floor(Math.random() * 15) + 3;
  const mockLastUpdate = new Date(
    Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
  ).toISOString();

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

  const getHubEmoji = (hub: string) => {
    const hubEmojis: Record<string, string> = {
      Music: "🎵",
      Kpop: "⭐",
      Food: "🍜",
      Beauty: "💄",
      Gaming: "🎮",
      Literature: "📚",
      Fashion: "👗",
      Anime: "🎬",
    };
    return hubEmojis[hub] || "🎌";
  };

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
        borderColor: "purple.300",
      }}
      cursor="pointer"
      as={RouterLink}
      to={`/kdoms/slug/${kdom.slug}`}
      h="100%"
    >
      <CardBody p={6}>
        <VStack spacing={4} align="stretch" h="100%">
          {/* Rank and Score */}
          <HStack justify="space-between" align="center">
            <HStack spacing={2}>
              <Text fontSize="lg">{getRankEmoji(rank)}</Text>
              <Badge
                colorScheme={getRankColor(rank)}
                variant="subtle"
                borderRadius="full"
                px={2}
                py={1}
              >
                #{rank}
              </Badge>
            </HStack>
            <HStack spacing={1}>
              <Icon as={FiTrendingUp} color="green.500" boxSize={4} />
              <Text fontSize="sm" color="green.500" fontWeight="bold">
                {kdom.score}
              </Text>
            </HStack>
          </HStack>

          {/* Title and Hub */}
          <VStack spacing={2} align="stretch" flex="1">
            <Heading size="md" color="purple.600" noOfLines={2}>
              {kdom.title}
            </Heading>
            <Badge
              colorScheme="blue"
              variant="outline"
              size="sm"
              alignSelf="flex-start"
            >
              {getHubEmoji(kdom.hub)} {kdom.hub}
            </Badge>
          </VStack>

          {/* Enhanced Stats */}
          <VStack spacing={3} align="stretch">
            <Grid templateColumns="repeat(3, 1fr)" gap={2} fontSize="xs">
              <VStack spacing={1}>
                <HStack spacing={1}>
                  <Icon as={FiUsers} boxSize={3} color="blue.500" />
                  <Text fontWeight="bold" color="blue.500">
                    {mockFollowers}
                  </Text>
                </HStack>
                <Text color="gray.500">followers</Text>
              </VStack>

              <VStack spacing={1}>
                <HStack spacing={1}>
                  <Icon as={FiTrendingUp} boxSize={3} color="green.500" />
                  <Text fontWeight="bold" color="green.500">
                    {mockPosts}
                  </Text>
                </HStack>
                <Text color="gray.500">posts</Text>
              </VStack>

              <VStack spacing={1}>
                <HStack spacing={1}>
                  <Icon as={FiMessageCircle} boxSize={3} color="purple.500" />
                  <Text fontWeight="bold" color="purple.500">
                    {mockComments}
                  </Text>
                </HStack>
                <Text color="gray.500">comments</Text>
              </VStack>
            </Grid>

            <HStack spacing={1} fontSize="xs" color="gray.500">
              <Icon as={FiClock} boxSize={3} />
              <Text>Updated {formatRelativeTime(mockLastUpdate)}</Text>
            </HStack>
          </VStack>

          {/* View Button */}
          <Button
            size="sm"
            variant="ghost"
            colorScheme="purple"
            rightIcon={<FiArrowRight />}
            justifyContent="space-between"
            _hover={{
              bg: "purple.50",
            }}
            mt="auto"
          >
            Explore K-Dom
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export const FeaturedKDomsSection: React.FC<FeaturedKDomsProps> = ({
  featuredKDoms,
}) => {
  const sectionBg = useColorModeValue("gray.50", "gray.900");

  // Debug logging
  console.log("FeaturedKDomsSection featuredKDoms:", featuredKDoms);

  return (
    <Box bg={sectionBg} py={20}>
      <Container maxW="1200px">
        <VStack spacing={12}>
          {/* Section Header */}
          <VStack spacing={4} textAlign="center">
            <HStack spacing={2} justify="center">
              <Icon as={FiTrendingUp} color="purple.500" boxSize={6} />
              <Heading size="xl" color="purple.600">
                Popular K-Doms Right Now
              </Heading>
            </HStack>
            <Text fontSize="lg" color="gray.600" maxW="600px">
              Discover the most engaging K-Culture content created by our
              passionate community
            </Text>
          </VStack>

          {/* Featured K-Doms Grid */}
          {featuredKDoms.length > 0 ? (
            <>
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={6}
                w="100%"
              >
                {featuredKDoms.map((kdom, index) => (
                  <KDomCard key={kdom.id} kdom={kdom} rank={index + 1} />
                ))}
              </Grid>

              {/* Summary */}
              <VStack spacing={2} textAlign="center">
                <Text fontSize="sm" color="gray.600">
                  Showing top {featuredKDoms.length} most popular K-Doms
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Rankings based on community engagement, followers, and recent
                  activity
                </Text>
              </VStack>
            </>
          ) : (
            <VStack spacing={4} py={12}>
              <Text fontSize="lg" color="gray.500">
                🌟 Featured K-Doms loading...
              </Text>
              <Text fontSize="sm" color="gray.400">
                Amazing content is being created right now!
              </Text>

              {/* Placeholder cards */}
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={6}
                w="100%"
                mt={8}
              >
                {[1, 2, 3].map((i) => (
                  <Card key={i} borderWidth="1px" opacity={0.7}>
                    <CardBody p={6}>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <Badge variant="outline">#{i}</Badge>
                          <Text fontSize="sm" color="gray.500">
                            Loading...
                          </Text>
                        </HStack>
                        <Heading size="md" color="gray.500">
                          Featured K-Dom #{i}
                        </Heading>
                        <Text fontSize="sm" color="gray.400">
                          Exciting K-Culture content coming soon
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </VStack>
          )}

          {/* Browse More Button */}
          <Flex justify="center">
            <Button
              as={RouterLink}
              to="/trending"
              size="lg"
              variant="outline"
              colorScheme="purple"
              rightIcon={<FiTrendingUp />}
              px={8}
              _hover={{
                transform: "translateY(-2px)",
              }}
            >
              View All Trending
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};
