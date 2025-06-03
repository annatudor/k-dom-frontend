// src/pages/CommunityPage.tsx
import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { WelcomeSection } from "@/components/community/WelcomeSection";
import { CustomizeFeedSection } from "@/components/community/CustomizeFeedSection";
import { MyKDomsSection } from "@/components/community/MyKDomsSection";
import { SuggestedKDomsSection } from "@/components/community/SuggestedKDomsSection";
import { TrendingKDomsSection } from "@/components/community/TrendingKDomsSection";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { useCommunityData } from "@/hooks/useCommunityData";

export default function CommunityPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  const {
    followedKdoms,
    suggestedKdoms,
    trendingKdoms,
    posts,
    user,
    isAuthenticated,
    isLoadingFollowed,
    isLoadingSuggested,
    isLoadingTrending,
    isLoadingFeed,
    refetchFeed,
  } = useCommunityData();

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <CommunityHeader />

      {/* Main content */}
      <Container maxW="container.xl" py={8}>
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} alignItems="start">
          {/* Left Sidebar - Sticky sections */}
          <VStack spacing={6} position="sticky" top="120px" alignSelf="start">
            {/* Welcome Section */}
            <WelcomeSection user={user} isAuthenticated={isAuthenticated} />

            {/* Customize Feed Section - Only for guests */}
            <CustomizeFeedSection isAuthenticated={isAuthenticated} />

            {/* My K-Doms Section */}
            <MyKDomsSection
              isAuthenticated={isAuthenticated}
              followedKdoms={followedKdoms}
              isLoading={isLoadingFollowed}
            />
          </VStack>

          {/* Center - Main Feed */}
          <VStack spacing={6}>
            <CommunityFeed
              posts={posts}
              isLoading={isLoadingFeed}
              isAuthenticated={isAuthenticated}
              onRefresh={refetchFeed}
            />
          </VStack>

          {/* Right Sidebar - Sticky sections */}
          <VStack spacing={6} position="sticky" top="120px" alignSelf="start">
            {/* Suggested K-Doms Section */}
            <SuggestedKDomsSection
              isAuthenticated={isAuthenticated}
              suggestedKdoms={suggestedKdoms}
              isLoading={isLoadingSuggested}
            />

            {/* Trending K-Doms Section */}
            <TrendingKDomsSection
              trendingKdoms={trendingKdoms}
              isLoading={isLoadingTrending}
            />
          </VStack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
