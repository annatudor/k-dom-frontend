// src/pages/CommunityPage.tsx
import React from "react";
import { Flex, VStack, Box } from "@chakra-ui/react";
import WelcomeSection from "../components/community/WelcomeSection";
import CustomizeFeedSection from "../components/community/CustomizeFeedSection";
import MyKDomsSection from "../components/community/MyKDomsSection";
import SuggestedKDomsSection from "../components/community/SuggestedKDomsSection";
import TrendingKDomsSection from "../components/community/TrendingKDomsSection";
import FeedSection from "../components/community/FeedSection";

const CommunityPage: React.FC = () => (
  <Flex align="flex-start" p={4}>
    {/* Sidebar stângă */}
    <VStack spacing={6} flex="0 0 300px">
      <Box position="sticky" top="100px">
        <WelcomeSection />
        <CustomizeFeedSection />
        <MyKDomsSection />
        <SuggestedKDomsSection />
        <TrendingKDomsSection />
      </Box>
    </VStack>

    {/* Conținut principal */}
    <Box flex="1" ml={8}>
      <FeedSection />
    </Box>
  </Flex>
);

export default CommunityPage;
