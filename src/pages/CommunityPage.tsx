// src/pages/CommunityPage.tsx - Fandom-style layout
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
  const bgColor = useColorModeValue("white.100", "purple.900");

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

      {/* Main content with fandom-style layout */}
      <Container maxW="1400px" py={4} px={6}>
        <SimpleGrid
          columns={{ base: 1, lg: 12 }}
          spacing={4}
          alignItems="start"
          templateColumns={{ lg: "300px 1fr 280px" }}
        >
          {/* Left Sidebar - Fixed width like fandom layout */}
          <VStack
            spacing={4}
            position="sticky"
            top="80px"
            alignSelf="start"
            gridColumn={{ lg: "1" }}
            overflow="visible"
            zIndex={10}
          >
            {/* Welcome Section - Compact */}
            <WelcomeSection user={user} isAuthenticated={isAuthenticated} />

            {/* My K-Doms Section - Always show */}
            <MyKDomsSection
              isAuthenticated={isAuthenticated}
              followedKdoms={followedKdoms}
              isLoading={isLoadingFollowed}
            />
          </VStack>

          {/* Center - Main Feed - Flexible width */}
          <VStack spacing={4} gridColumn={{ lg: "2" }} w="full">
            {/* Customize Feed Section - Only for guests, positioned above feed */}
            {!isAuthenticated && (
              <CustomizeFeedSection isAuthenticated={isAuthenticated} />
            )}

            {/* Main Feed */}
            <CommunityFeed
              posts={posts}
              isLoading={isLoadingFeed}
              isAuthenticated={isAuthenticated}
              onRefresh={refetchFeed}
            />
          </VStack>

          {/* Right Sidebar - Fixed width like fandom layout */}
          <VStack
            spacing={4}
            position="sticky"
            top="80px"
            alignSelf="start"
            gridColumn={{ lg: "3" }}
          >
            {/* Suggested K-Doms Section - Show for authenticated users */}
            {isAuthenticated && (
              <SuggestedKDomsSection
                isAuthenticated={isAuthenticated}
                suggestedKdoms={suggestedKdoms}
                isLoading={isLoadingSuggested}
              />
            )}

            {/* Trending K-Doms Section - Always show */}
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
