// src/components/profile/ProfileHeader.tsx
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Button,
  Icon,
  useColorModeValue,
  Card,
  CardBody,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import {
  FiEdit3,
  FiSettings,
  FiUserPlus,
  FiUserMinus,
  FiCalendar,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { UserProfileReadDto, ProfileTheme } from "@/types/User";

interface ProfileHeaderProps {
  profile: UserProfileReadDto;
  isLoading?: boolean;
}

export function ProfileHeader({ profile, isLoading }: ProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Determină tema de culori pe baza ProfileTheme
  const getThemeGradient = (theme: ProfileTheme) => {
    switch (theme) {
      case "Cyber":
        return "linear(to-r, purple.600, blue.600, cyan.400)";
      case "Soft":
        return "linear(to-r, pink.300, purple.300, blue.300)";
      case "Contrast":
        return "linear(to-r, black, gray.800, gray.600)";
      case "Monochrome":
        return "linear(to-r, gray.400, gray.600, gray.800)";
      default:
        return "linear(to-r, blue.500, purple.500, pink.500)";
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "red";
      case "moderator":
        return "purple";
      default:
        return "blue";
    }
  };

  if (isLoading) {
    return (
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
      >
        <CardBody>
          <VStack spacing={6}>
            <HStack spacing={6} w="full" align="start">
              <SkeletonCircle size="24" />
              <VStack align="start" flex="1" spacing={3}>
                <Skeleton height="32px" width="200px" />
                <Skeleton height="20px" width="150px" />
                <SkeletonText noOfLines={2} spacing="2" />
              </VStack>
              <VStack spacing={2}>
                <Skeleton height="32px" width="120px" />
                <Skeleton height="32px" width="120px" />
              </VStack>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  const isOwnProfile = currentUser?.id === profile.userId;

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      position="relative"
    >
      {/* Theme Background */}
      <Box
        h="120px"
        bgGradient={getThemeGradient(profile.profileTheme)}
        position="relative"
      >
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          h="40px"
          bgGradient="linear(to-t, white, transparent)"
          opacity={0.8}
        />
      </Box>

      <CardBody pt="0" mt="-60px" position="relative">
        <VStack spacing={6} align="stretch">
          {/* Avatar și informații de bază */}
          <HStack
            spacing={6}
            align="start"
            flexWrap={{ base: "wrap", md: "nowrap" }}
          >
            {/* Avatar */}
            <Avatar
              size="2xl"
              src={profile.avatarUrl}
              name={profile.nickname || profile.username}
              border="6px solid"
              borderColor={cardBg}
              shadow="xl"
            />

            {/* Info principal */}
            <VStack align="start" flex="1" spacing={3} minW="0">
              <VStack align="start" spacing={2}>
                {/* Nume și nickname */}
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" noOfLines={1}>
                    {profile.nickname || profile.username}
                  </Text>
                  {profile.nickname && (
                    <Text fontSize="md" color="gray.500">
                      @{profile.username}
                    </Text>
                  )}
                </VStack>

                {/* Badges pentru rol și status */}
                <HStack spacing={2} flexWrap="wrap">
                  {currentUser && (
                    <Badge
                      colorScheme={getRoleColor(currentUser.role)}
                      variant="solid"
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {currentUser.role.charAt(0).toUpperCase() +
                        currentUser.role.slice(1)}
                    </Badge>
                  )}

                  <Badge
                    colorScheme="purple"
                    variant="outline"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {profile.profileTheme} Theme
                  </Badge>

                  {profile.followersCount > 100 && (
                    <Badge
                      colorScheme="orange"
                      variant="solid"
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      Popular Creator
                    </Badge>
                  )}
                </HStack>
              </VStack>

              {/* Bio */}
              {profile.bio && (
                <Text
                  color="gray.600"
                  fontSize="md"
                  lineHeight="tall"
                  maxW="600px"
                >
                  {profile.bio}
                </Text>
              )}

              {/* Informații suplimentare */}
              <HStack
                spacing={4}
                color="gray.500"
                fontSize="sm"
                flexWrap="wrap"
              >
                <HStack spacing={1}>
                  <Icon as={FiCalendar} />
                  <Text>
                    Joined {new Date(profile.joinedAt).toLocaleDateString()}
                  </Text>
                </HStack>

                <HStack spacing={1}>
                  <Icon as={FiUserPlus} />
                  <Text>
                    {profile.followersCount} followers •{" "}
                    {profile.followingCount} following
                  </Text>
                </HStack>
              </HStack>
            </VStack>

            {/* Action buttons */}
            <VStack spacing={3} flexShrink={0}>
              {isOwnProfile ? (
                <>
                  <Button
                    as={RouterLink}
                    to="/profile/edit"
                    leftIcon={<Icon as={FiEdit3} />}
                    colorScheme="blue"
                    size="md"
                    borderRadius="full"
                    px={6}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/profile/preferences"
                    leftIcon={<Icon as={FiSettings} />}
                    variant="outline"
                    size="md"
                    borderRadius="full"
                    px={6}
                  >
                    Preferences
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    leftIcon={
                      <Icon
                        as={
                          profile.isFollowedByCurrentUser
                            ? FiUserMinus
                            : FiUserPlus
                        }
                      />
                    }
                    colorScheme={
                      profile.isFollowedByCurrentUser ? "gray" : "blue"
                    }
                    variant={
                      profile.isFollowedByCurrentUser ? "outline" : "solid"
                    }
                    size="md"
                    borderRadius="full"
                    px={6}
                  >
                    {profile.isFollowedByCurrentUser ? "Unfollow" : "Follow"}
                  </Button>
                </>
              )}
            </VStack>
          </HStack>

          {/* Statistici rapide */}
          <HStack
            spacing={8}
            justify="center"
            py={4}
            borderTop="1px solid"
            borderColor={borderColor}
            flexWrap="wrap"
          >
            <VStack spacing={1}>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">
                {profile.createdKDomsCount}
              </Text>
              <Text fontSize="sm" color="gray.500">
                K-Doms
              </Text>
            </VStack>

            <VStack spacing={1}>
              <Text fontSize="xl" fontWeight="bold" color="purple.600">
                {profile.collaboratedKDomsCount}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Collaborations
              </Text>
            </VStack>

            <VStack spacing={1}>
              <Text fontSize="xl" fontWeight="bold" color="green.600">
                {profile.totalPostsCount}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Posts
              </Text>
            </VStack>

            <VStack spacing={1}>
              <Text fontSize="xl" fontWeight="bold" color="orange.600">
                {profile.totalCommentsCount}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Comments
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}
