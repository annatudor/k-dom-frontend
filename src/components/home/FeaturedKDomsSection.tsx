// src/components/home/FeaturedKDomsSection.tsx
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
import { FiTrendingUp, FiUsers, FiClock, FiArrowRight } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { formatRelativeTime } from "@/utils/commentUtils";

interface FeaturedKDom {
  id: string;
  title: string;
  slug: string;
  score: number;
  hub: string;
}

interface FeaturedKDomsProps {
  featuredKDoms: FeaturedKDom[];
}

interface KDomCardProps {
  kdom: FeaturedKDom;
  rank: number;
}

const KDomCard: React.FC<KDomCardProps> = ({ kdom, rank }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Generate some mock data based on the trending score
  const mockFollowers =
    Math.floor(kdom.score / 10) + Math.floor(Math.random() * 20) + 5;
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
    >
      <CardBody p={6}>
        <VStack spacing={4} align="stretch">
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

          {/* Title */}
          <VStack spacing={2} align="stretch">
            <Heading size="md" color="purple.600" noOfLines={2}>
              {kdom.title}
            </Heading>
            <Badge
              colorScheme="blue"
              variant="outline"
              size="sm"
              alignSelf="flex-start"
            >
              🎵 {kdom.hub}
            </Badge>
          </VStack>

          {/* Stats */}
          <VStack spacing={2} align="stretch">
            <HStack justify="space-between" fontSize="sm" color="gray.600">
              <HStack spacing={1}>
                <Icon as={FiUsers} boxSize={4} />
                <Text>{mockFollowers} followers</Text>
              </HStack>
            </HStack>
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
          ) : (
            <VStack spacing={4} py={12}>
              <Text fontSize="lg" color="gray.500">
                🌟 Featured K-Doms loading...
              </Text>
              <Text fontSize="sm" color="gray.400">
                Amazing content is being created right now!
              </Text>
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
