// src/components/profile/ProfileHeader.tsx - WITH FOLLOW FUNCTIONALITY
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import {
  FiEdit3,
  FiSettings,
  FiUserPlus,
  FiUserMinus,
  FiCalendar,
  FiUser,
  FiLock,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUserFollow } from "@/hooks/useUserFollow";
import type { UserProfileReadDto, ProfileTheme } from "@/types/User";

interface ProfileHeaderProps {
  profile: UserProfileReadDto;
  isLoading?: boolean;
}

export function ProfileHeader({ profile, isLoading }: ProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // ✅ Hook pentru follow functionality
  const {
    isFollowing,
    followersCount,
    followingCount,
    handleToggleFollow,
    isLoading: followLoading,
    canFollow,
  } = useUserFollow(profile.userId);

  // Funcții helper cu tipuri corecte
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

  // ✅ FIX: Folosește valorile din hook în loc de profile
  const displayFollowersCount = followersCount ?? profile.followersCount ?? 0;
  const displayFollowingCount = followingCount ?? profile.followingCount ?? 0;

  console.log("[ProfileHeader] Debug values:", {
    profileFollowersCount: profile.followersCount,
    hookFollowersCount: followersCount,
    displayFollowersCount,
    isFollowing,
    canFollow,
    isOwnProfile,
  });

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      position="relative"
    >
      {/* Theme Background - Made Larger */}
      <Box
        h="200px"
        bgGradient={getThemeGradient(profile.profileTheme)}
        position="relative"
      >
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          h="60px"
          bgGradient="linear(to-t, white, transparent)"
          opacity={0.8}
        />
      </Box>

      <CardBody pt="0" mt="-100px" position="relative">
        <VStack spacing={8} align="stretch">
          {/* Avatar și informații de bază */}
          <HStack
            spacing={8}
            align="start"
            flexWrap={{ base: "wrap", md: "nowrap" }}
          >
            {/* Avatar - Made Larger */}
            <Avatar
              size="2xl"
              src={profile.avatarUrl}
              name={profile.nickname || profile.username}
              border="8px solid"
              borderColor={cardBg}
              shadow="2xl"
              w="150px"
              h="150px"
            />

            {/* Info principal - Made Larger */}
            <VStack align="start" flex="1" spacing={6} minW="0">
              {/* Nume și nickname */}
              <VStack align="start" spacing={2}>
                <Text fontSize="4xl" fontWeight="bold" noOfLines={1}>
                  {profile.nickname || profile.username}
                </Text>
                {profile.nickname && (
                  <Text fontSize="xl" color="gray.500">
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

                {displayFollowersCount > 100 && (
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

              {/* Bio - Made Larger */}
              {profile.bio && (
                <Text
                  color="gray.600"
                  fontSize="lg"
                  lineHeight="tall"
                  maxW="800px"
                >
                  {profile.bio}
                </Text>
              )}

              {/* Informații suplimentare - ✅ FIX: Folosește valorile corecte */}
              <HStack
                spacing={6}
                color="gray.500"
                fontSize="md"
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
                    {displayFollowersCount.toLocaleString()} followers •{" "}
                    {displayFollowingCount.toLocaleString()} following
                  </Text>
                </HStack>
              </HStack>
            </VStack>

            {/* Action buttons */}
            <VStack spacing={4} flexShrink={0}>
              {isOwnProfile ? (
                <>
                  {/* Single Settings Menu Button */}
                  <Menu>
                    <MenuButton
                      as={Button}
                      leftIcon={<Icon as={FiSettings} />}
                      rightIcon={<Icon as={FiChevronDown} />}
                      colorScheme="blue"
                      size="md"
                      borderRadius="full"
                      px={4}
                      h="50px"
                      fontSize="md"
                      variant="solid"
                    >
                      Settings
                    </MenuButton>
                    <MenuList>
                      {/* Profile Edit Section */}
                      <MenuItem
                        as={RouterLink}
                        to="/profile/edit"
                        icon={<Icon as={FiEdit3} />}
                        fontSize="md"
                        py={3}
                      >
                        Edit Profile
                      </MenuItem>

                      <MenuDivider />

                      {/* Account Settings Section */}
                      <MenuItem
                        as={RouterLink}
                        to="/profile/preferences"
                        icon={<Icon as={FiUser} />}
                        fontSize="md"
                        py={3}
                      >
                        Account Preferences
                      </MenuItem>

                      <MenuItem
                        as={RouterLink}
                        to="/profile/security"
                        icon={<Icon as={FiLock} />}
                        fontSize="md"
                        py={3}
                      >
                        Privacy & Security
                      </MenuItem>

                      <MenuItem
                        as={RouterLink}
                        to="/profile/notifications"
                        icon={<Icon as={FiBell} />}
                        fontSize="md"
                        py={3}
                      >
                        Notifications
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <>
                  {/* ✅ Follow/Unfollow Button - FUNCȚIONAL */}
                  {canFollow && (
                    <Button
                      leftIcon={
                        <Icon as={isFollowing ? FiUserMinus : FiUserPlus} />
                      }
                      colorScheme={isFollowing ? "gray" : "blue"}
                      variant={isFollowing ? "outline" : "solid"}
                      size="lg"
                      borderRadius="full"
                      px={8}
                      h="50px"
                      fontSize="md"
                      onClick={handleToggleFollow}
                      isLoading={followLoading}
                      loadingText={
                        isFollowing ? "Unfollowing..." : "Following..."
                      }
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </>
              )}
            </VStack>
          </HStack>

          {/* Statistici rapide - ✅ FIX: Folosește valorile corecte */}
          <HStack
            spacing={12}
            justify="center"
            py={6}
            borderTop="1px solid"
            borderColor={borderColor}
            flexWrap="wrap"
          >
            <VStack spacing={1}>
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                {profile.createdKDomsCount}
              </Text>
              <Text fontSize="md" color="gray.500">
                K-Doms
              </Text>
            </VStack>

            <VStack spacing={1}>
              <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                {profile.collaboratedKDomsCount}
              </Text>
              <Text fontSize="md" color="gray.500">
                Collaborations
              </Text>
            </VStack>

            <VStack spacing={1}>
              <Text fontSize="3xl" fontWeight="bold" color="green.600">
                {profile.totalPostsCount}
              </Text>
              <Text fontSize="md" color="gray.500">
                Posts
              </Text>
            </VStack>

            <VStack spacing={1}>
              <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                {profile.totalCommentsCount}
              </Text>
              <Text fontSize="md" color="gray.500">
                Comments
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}
