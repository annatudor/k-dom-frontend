// src/components/profile/ProfileStats.tsx
import {
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Grid,
  GridItem,
  useColorModeValue,
  Skeleton,
} from "@chakra-ui/react";
import {
  FiBookOpen,
  FiUsers,
  FiEdit3,
  FiMessageCircle,
  FiUserPlus,
  FiEye,
  FiCalendar,
} from "react-icons/fi";
import type { UserProfileReadDto } from "@/types/User";

interface ProfileStatsProps {
  profile: UserProfileReadDto;
  isLoading?: boolean;
}

export function ProfileStats({ profile, isLoading }: ProfileStatsProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (isLoading) {
    return (
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={6}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <GridItem key={i}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Skeleton height="60px" />
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
    );
  }

  const stats = [
    {
      label: "K-Doms Created",
      value: profile.createdKDomsCount,
      icon: FiBookOpen,
      color: "blue",
      description: "Total K-Doms authored",
    },
    {
      label: "Collaborations",
      value: profile.collaboratedKDomsCount,
      icon: FiUsers,
      color: "purple",
      description: "K-Doms collaborated on",
    },
    {
      label: "Posts",
      value: profile.totalPostsCount,
      icon: FiEdit3,
      color: "green",
      description: "Total posts created",
    },
    {
      label: "Comments",
      value: profile.totalCommentsCount,
      icon: FiMessageCircle,
      color: "orange",
      description: "Total comments made",
    },
    {
      label: "Followers",
      value: profile.followersCount,
      icon: FiUserPlus,
      color: "pink",
      description: "People following you",
    },
    {
      label: "Following",
      value: profile.followingCount,
      icon: FiEye,
      color: "teal",
      description: "People you follow",
    },
    {
      label: "K-Doms Followed",
      value: profile.followedKDoms?.length || 0,
      icon: FiBookOpen,
      color: "cyan",
      description: "K-Doms you follow",
    },
    {
      label: "Member Since",
      value: new Date(profile.joinedAt).getFullYear(),
      icon: FiCalendar,
      color: "gray",
      description: `Joined ${new Date(profile.joinedAt).toLocaleDateString()}`,
    },
  ];

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
    >
      <CardHeader>
        <Text fontSize="lg" fontWeight="bold">
          Activity Statistics
        </Text>
      </CardHeader>
      <CardBody>
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
        >
          {stats.map((stat, index) => (
            <GridItem key={index}>
              <VStack
                spacing={3}
                p={4}
                borderRadius="lg"
                textAlign="center"
                transition="all 0.2s"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "md",
                }}
              >
                <Icon as={stat.icon} boxSize={6} color={`${stat.color}.500`} />
                <VStack spacing={1}>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={`${stat.color}.600`}
                  >
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.600"
                    textAlign="center"
                  >
                    {stat.label}
                  </Text>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    textAlign="center"
                    display={{ base: "none", md: "block" }}
                  >
                    {stat.description}
                  </Text>
                </VStack>
              </VStack>
            </GridItem>
          ))}
        </Grid>

        {/* Activity Summary */}
        <HStack mt={6} spacing={4} justify="center" flexWrap="wrap">
          <Badge
            colorScheme="blue"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="sm"
          >
            Total Content: {profile.createdKDomsCount + profile.totalPostsCount}
          </Badge>
          <Badge
            colorScheme="purple"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="sm"
          >
            Community Score:{" "}
            {profile.followersCount + profile.collaboratedKDomsCount}
          </Badge>
          {profile.lastActivityAt && (
            <Badge
              colorScheme="green"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
            >
              Last Active:{" "}
              {new Date(profile.lastActivityAt).toLocaleDateString()}
            </Badge>
          )}
        </HStack>
      </CardBody>
    </Card>
  );
}
