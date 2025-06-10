// src/pages/Home.tsx - NOVA PAGINĂ HOME
import {
  Box,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";
import { useHomepageData } from "@/hooks/useHomePageData";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FeaturedKDomsSection } from "@/components/home/FeaturedKDomsSection";
import { CommunityShowcase } from "@/components/home/CommunityShowcase";

export default function Home() {
  const { data, isLoading, error } = useHomepageData();

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

  // Error state
  if (error) {
    return (
      <Center minH="60vh" p={6}>
        <Alert status="error" borderRadius="lg" maxW="md">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Box fontWeight="bold">Unable to load homepage</Box>
            <Box fontSize="sm">Please refresh the page or try again later.</Box>
          </VStack>
        </Alert>
      </Center>
    );
  }

  // Ensure we have data before rendering
  if (!data) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Box fontSize="lg" color="gray.500">
            🎌 Initializing K-Dom...
          </Box>
        </VStack>
      </Center>
    );
  }

  return (
    <Box>
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
    </Box>
  );
}
