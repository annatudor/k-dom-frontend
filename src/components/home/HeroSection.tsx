// src/components/home/HeroSection.tsx
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Badge,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { FiUsers, FiBookOpen, FiGlobe } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { GlobalSearchBox } from "@/components/layout/GlobalSearchBox";

interface HeroSectionProps {
  platformStats: {
    totalKDoms: number;
    totalCategories: number;
    activeCollaborators: number;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ platformStats }) => {
  const { isAuthenticated } = useAuth();
  const bgGradient = useColorModeValue(
    "linear(to-br, purple.50, pink.50, blue.50)",
    "linear(to-br, purple.900, pink.900, blue.900)"
  );
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Box
      bgGradient={bgGradient}
      py={{ base: 16, md: 24 }}
      position="relative"
      overflow="hidden"
    >
      {/* Background decorative elements */}
      <Box
        position="absolute"
        top="10%"
        right="10%"
        fontSize="4xl"
        opacity={0.1}
        transform="rotate(15deg)"
      >
        🎌
      </Box>
      <Box
        position="absolute"
        bottom="20%"
        left="5%"
        fontSize="3xl"
        opacity={0.1}
        transform="rotate(-10deg)"
      >
        🎵
      </Box>

      <Container maxW="1200px">
        <VStack spacing={8} textAlign="center">
          {/* Main Headline */}
          <VStack spacing={4}>
            <Heading
              size="2xl"
              bgGradient="linear(to-r, purple.600, pink.600)"
              bgClip="text"
              fontWeight="bold"
            >
              🎌 Welcome to K-Dom
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="600px">
              The collaborative platform for K-Culture
            </Text>
            <Text fontSize="lg" color={textColor} maxW="700px">
              Where fans create, share and explore Korean culture through
              collaborative wikis and passionate communities
            </Text>
          </VStack>

          {/* Search Bar */}
          <Box w="100%" maxW="500px">
            <GlobalSearchBox />
          </Box>

          {/* Call to Action Buttons */}
          <HStack spacing={4} flexWrap="wrap" justify="center">
            {!isAuthenticated ? (
              <>
                <Button
                  as={RouterLink}
                  to="/register"
                  size="lg"
                  colorScheme="purple"
                  bgGradient="linear(to-r, purple.500, pink.500)"
                  _hover={{
                    bgGradient: "linear(to-r, purple.600, pink.600)",
                    transform: "translateY(-2px)",
                  }}
                  boxShadow="lg"
                  px={8}
                >
                  Get Started Free
                </Button>
                <Button
                  as={RouterLink}
                  to="/explore"
                  size="lg"
                  variant="outline"
                  colorScheme="purple"
                  px={8}
                  _hover={{
                    transform: "translateY(-2px)",
                  }}
                >
                  Explore K-Doms
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  to="/start-kdom"
                  size="lg"
                  colorScheme="purple"
                  bgGradient="linear(to-r, purple.500, pink.500)"
                  _hover={{
                    bgGradient: "linear(to-r, purple.600, pink.600)",
                    transform: "translateY(-2px)",
                  }}
                  boxShadow="lg"
                  px={8}
                >
                  Create Your K-Dom
                </Button>
                <Button
                  as={RouterLink}
                  to="/community"
                  size="lg"
                  variant="outline"
                  colorScheme="purple"
                  px={8}
                  _hover={{
                    transform: "translateY(-2px)",
                  }}
                >
                  Go to Community
                </Button>
              </>
            )}
          </HStack>

          {/* Platform Stats */}
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={6}
            justify="center"
            align="center"
            flexWrap="wrap"
          >
            <HStack spacing={2}>
              <Icon as={FiBookOpen} color="purple.500" />
              <Badge
                colorScheme="purple"
                variant="subtle"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
              >
                {platformStats.totalKDoms.toLocaleString()}+ K-Doms
              </Badge>
            </HStack>

            <HStack spacing={2}>
              <Icon as={FiUsers} color="pink.500" />
              <Badge
                colorScheme="pink"
                variant="subtle"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
              >
                {platformStats.activeCollaborators.toLocaleString()}+
                Collaborators
              </Badge>
            </HStack>

            <HStack spacing={2}>
              <Icon as={FiGlobe} color="blue.500" />
              <Badge
                colorScheme="blue"
                variant="subtle"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
              >
                {platformStats.totalCategories} Categories
              </Badge>
            </HStack>
          </Flex>

          {/* Subtitle with cultural emphasis */}
          <Text
            fontSize="md"
            color={textColor}
            opacity={0.8}
            maxW="600px"
            fontStyle="italic"
          >
            "Join thousands of K-Culture enthusiasts building the world's most
            comprehensive Korean culture knowledge base"
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};
