// src/pages/HomePage.tsx - Updated version
import {
  Box,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useHomepageData } from "@/hooks/useHomePageData";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FeaturedKDomsSection } from "@/components/home/FeaturedKDomsSection";
import { CommunityShowcase } from "@/components/home/CommunityShowcase";

export default function Home() {
  const { data, isLoading, error, debugInfo } = useHomepageData();

  // Debug logging
  console.log("HomePage Debug Info:", debugInfo);
  console.log("HomePage Data:", data);

  // Loading state
  if (isLoading) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Box textAlign="center">
            <Box fontSize="lg" fontWeight="bold" color="purple.600">
              Loading K-Dom...
            </Box>
            <Box fontSize="sm" color="gray.500" mt={1}>
              Preparing your gateway to K-Culture
            </Box>
          </Box>
        </VStack>
      </Center>
    );
  }

  // Error state with more detailed information
  if (error && !data) {
    return (
      <Center minH="60vh" p={6}>
        <Alert status="error" borderRadius="lg" maxW="md">
          <AlertIcon />
          <VStack align="start" spacing={3}>
            <Box fontWeight="bold">Unable to load homepage data</Box>
            <Box fontSize="sm">
              The statistics service might be temporarily unavailable.
            </Box>
            <Button
              as={RouterLink}
              to="/community"
              size="sm"
              colorScheme="purple"
              variant="outline"
            >
              Visit Community Instead
            </Button>
          </VStack>
        </Alert>
      </Center>
    );
  }

  // Ensure we have at least basic data
  if (!data?.platformStats) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Text fontSize="lg" color="gray.500">
            🎌 Initializing K-Dom...
          </Text>
          <Text fontSize="sm" color="gray.400">
            Setting up your K-Culture experience
          </Text>
        </VStack>
      </Center>
    );
  }

  // Partial error state - show what we can with a notice
  const hasPartialData =
    data.platformStats &&
    (!data.categoryStats.length || !data.featuredKDoms.length);

  return (
    <Box>
      {/* Show a subtle notice if we have partial data */}
      {hasPartialData && (
        <Box bg="orange.50" p={2} textAlign="center">
          <Text fontSize="sm" color="orange.700">
            Some content is still loading. Refresh the page for the full
            experience.
          </Text>
        </Box>
      )}

      {/* Hero Section - Prima impresie cu search și CTA */}
      <HeroSection platformStats={data.platformStats} />

      {/* How It Works - Explică conceptul K-Dom */}
      <HowItWorksSection />

      {/* Categories Grid - Explorare pe categorii */}
      <CategoriesGrid categoryStats={data.categoryStats} />

      {/* Featured K-Doms - Conținut popular */}
      <FeaturedKDomsSection featuredKDoms={data.featuredKDoms} />

      {/* Community Showcase - Social proof și CTA final */}
      <CommunityShowcase platformStats={data.platformStats} />

      {/* Debug info for development (remove in production) */}
    </Box>
  );
}
