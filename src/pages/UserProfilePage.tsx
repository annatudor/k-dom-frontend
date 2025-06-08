// src/pages/UserProfilePage.tsx
import { useParams } from "react-router-dom";
import {
  Container,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useMyProfile, useUserProfile } from "@/hooks/useUserProfile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileContentTabs } from "@/components/profile/ProfileContentTabs";

export default function UserProfilePage() {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser, isAuthenticated } = useAuth();

  const bgColor = useColorModeValue("gray.50", "gray.900");

  // Determină dacă este profilul propriu sau al altcuiva
  const targetUserId = userId ? parseInt(userId) : undefined;
  const isOwnProfile = !targetUserId || currentUser?.id === targetUserId;

  // Folosește hook-ul corespunzător
  const {
    data: profile,
    isLoading,
    error,
  } = isOwnProfile ? useMyProfile() : useUserProfile(targetUserId);

  if (!isAuthenticated && isOwnProfile) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please log in to view your profile.
            </AlertDescription>
          </Box>
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        bg={bgColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" color="blue.500" />
          <Box textAlign="center">Loading profile...</Box>
        </VStack>
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Profile Not Found</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "The requested profile could not be found."}
            </AlertDescription>
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Profile Header */}
          <ProfileHeader profile={profile} isLoading={isLoading} />

          {/* Profile Statistics */}
          <ProfileStats profile={profile} isLoading={isLoading} />

          {/* Profile Content Tabs */}
          <ProfileContentTabs profile={profile} isLoading={isLoading} />
        </VStack>
      </Container>
    </Box>
  );
}
