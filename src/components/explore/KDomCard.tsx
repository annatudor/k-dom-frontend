// src/components/explore/KDomCard.tsx
import {
  Card,
  CardBody,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Icon,
  Avatar,
  Button,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiMessageCircle,
  FiTrendingUp,
  FiCalendar,
  FiExternalLink,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import type { ExploreKDomDto } from "@/api/explore";
import { formatStatNumber } from "@/utils/numberUtils";

interface KDomCardProps {
  kdom: ExploreKDomDto;
  showStats?: boolean;
}

export const KDomCard: React.FC<KDomCardProps> = ({
  kdom,
  showStats = true,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

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

  const getThemeColor = (theme: string) => {
    const themeColors: Record<string, string> = {
      Light: "yellow",
      Dark: "gray",
      Vibrant: "purple",
      Pastel: "pink",
    };
    return themeColors[theme] || "blue";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
        borderColor: "purple.300",
      }}
      cursor="pointer"
      h="100%"
    >
      <CardBody p={6}>
        <VStack spacing={4} align="stretch" h="100%">
          {/* Header - Hub and Theme */}
          <HStack justify="space-between" align="center">
            <Badge
              colorScheme="blue"
              variant="subtle"
              borderRadius="full"
              px={3}
              py={1}
            >
              {getHubEmoji(kdom.hub)} {kdom.hub}
            </Badge>

            <HStack spacing={2}>
              <Badge
                colorScheme={getThemeColor(kdom.theme)}
                variant="outline"
                size="sm"
              >
                {kdom.theme}
              </Badge>

              {kdom.isForKids && (
                <Badge colorScheme="green" variant="solid" size="sm">
                  👶 Kids
                </Badge>
              )}
            </HStack>
          </HStack>

          {/* Title and Description */}
          <VStack spacing={3} align="stretch" flex="1">
            <Heading size="md" color="purple.600" noOfLines={2}>
              {kdom.title}
            </Heading>

            <Text color={mutedColor} fontSize="sm" noOfLines={3} flex="1">
              {kdom.description}
            </Text>
          </VStack>

          {/* Author Info */}
          <HStack spacing={3}>
            <Avatar name={kdom.authorUsername} size="sm" />
            <VStack spacing={0} align="start" flex="1">
              <Text fontWeight="medium" fontSize="sm">
                @{kdom.authorUsername}
              </Text>
              <HStack spacing={1}>
                <Icon as={FiCalendar} boxSize={3} color={mutedColor} />
                <Text fontSize="xs" color={mutedColor}>
                  Created {formatDate(kdom.createdAt)}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          {/* Stats */}
          {showStats && (
            <HStack spacing={4} fontSize="sm">
              <Tooltip label="Followers">
                <HStack spacing={1} color="blue.500">
                  <Icon as={FiUsers} boxSize={4} />
                  <Text fontWeight="medium">
                    {formatStatNumber(kdom.followersCount)}
                  </Text>
                </HStack>
              </Tooltip>

              <Tooltip label="Posts">
                <HStack spacing={1} color="green.500">
                  <Icon as={FiTrendingUp} boxSize={4} />
                  <Text fontWeight="medium">
                    {formatStatNumber(kdom.postsCount)}
                  </Text>
                </HStack>
              </Tooltip>

              <Tooltip label="Comments">
                <HStack spacing={1} color="purple.500">
                  <Icon as={FiMessageCircle} boxSize={4} />
                  <Text fontWeight="medium">
                    {formatStatNumber(kdom.commentsCount)}
                  </Text>
                </HStack>
              </Tooltip>
            </HStack>
          )}

          {/* Action Button */}
          <Button
            as={RouterLink}
            to={`/kdoms/slug/${kdom.slug}`}
            size="sm"
            colorScheme="purple"
            variant="ghost"
            rightIcon={<FiExternalLink />}
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
