// src/components/explore/KDomExploreCard.tsx
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  useColorModeValue,
  Box,
  Heading,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiMessageSquare,
  FiExternalLink,
  FiHeart,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import type { ExploreKDomDto } from "@/types/Explore";

interface KDomExploreCardProps {
  kdom: ExploreKDomDto;
  onFollow?: (kdomId: string) => void;
  isFollowing?: boolean;
}

export function KDomExploreCard({
  kdom,
  onFollow,
  isFollowing,
}: KDomExploreCardProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFollow) {
      onFollow(kdom.id);
    }
  };

  const getHubColor = (hub: string) => {
    const hubColors: Record<string, string> = {
      Music: "purple",
      Anime: "pink",
      Kpop: "teal",
      Gaming: "blue",
      Literature: "green",
      Fashion: "orange",
      Food: "red",
      Beauty: "cyan",
    };
    return hubColors[hub] || "gray";
  };

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "lg",
        borderColor: "purple.300",
      }}
      cursor="pointer"
      as={RouterLink}
      to={`/kdoms/slug/${kdom.slug}`}
    >
      <CardBody p={6}>
        <VStack align="stretch" spacing={4}>
          {/* Header */}
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={2} flex="1">
              <HStack spacing={2}>
                <Badge
                  colorScheme={getHubColor(kdom.hub)}
                  variant="subtle"
                  fontSize="xs"
                >
                  {kdom.hub.toUpperCase()}
                </Badge>
                {kdom.isForKids && (
                  <Badge colorScheme="green" variant="outline" fontSize="xs">
                    KIDS
                  </Badge>
                )}
              </HStack>

              <Heading size="md" noOfLines={2}>
                {kdom.title}
              </Heading>
            </VStack>

            {onFollow && (
              <Button
                size="sm"
                variant={isFollowing ? "solid" : "outline"}
                colorScheme={isFollowing ? "green" : "purple"}
                leftIcon={<Icon as={FiHeart} />}
                onClick={handleFollowClick}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </HStack>

          {/* Description */}
          <Text color={textColor} fontSize="sm" noOfLines={3}>
            {kdom.description}
          </Text>

          {/* Stats */}
          <HStack justify="space-between" align="center">
            <HStack spacing={4}>
              <HStack spacing={1}>
                <Icon as={FiUsers} boxSize={4} color={textColor} />
                <Text fontSize="sm" color={textColor}>
                  {kdom.followersCount}
                </Text>
              </HStack>

              <HStack spacing={1}>
                <Icon as={FiMessageSquare} boxSize={4} color={textColor} />
                <Text fontSize="sm" color={textColor}>
                  {kdom.postsCount}
                </Text>
              </HStack>
            </HStack>

            <Text fontSize="xs" color={textColor}>
              by {kdom.authorUsername}
            </Text>
          </HStack>

          {/* View Button */}
          <Box>
            <Button
              as={RouterLink}
              to={`/kdoms/slug/${kdom.slug}`}
              size="sm"
              variant="ghost"
              colorScheme="purple"
              rightIcon={<Icon as={FiExternalLink} />}
              width="full"
            >
              View K-Dom
            </Button>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}
