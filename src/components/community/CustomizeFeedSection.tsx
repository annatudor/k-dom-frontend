// src/components/community/CustomizeFeedSection.tsx - Compact fandom-style with login redirect
import {
  Card,
  CardBody,
  VStack,
  Text,
  Button,
  useColorModeValue,
  Box,
  Heading,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { FiHeart, FiPlus, FiStar } from "react-icons/fi";

interface CustomizeFeedSectionProps {
  isAuthenticated: boolean;
  onAddFandoms?: () => void;
  onExplore?: () => void;
}

export function CustomizeFeedSection({
  isAuthenticated,
  onAddFandoms,
  onExplore,
}: CustomizeFeedSectionProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Nu afișa pentru utilizatori autentificați
  if (isAuthenticated) {
    return null;
  }

  const handleAddFandoms = () => {
    if (onAddFandoms) {
      onAddFandoms();
    } else {
      // Default behavior - redirect to login
      window.location.href = "/login";
    }
  };

  const handleExplore = () => {
    if (onExplore) {
      onExplore();
    } else {
      // Default behavior - redirect to login
      window.location.href = "/login";
    }
  };

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="sm"
      overflow="hidden"
      w="full"
    >
      <CardBody p={0}>
        {/* Header colorat cu iconuri - compact style */}
        <Box
          bgGradient="linear(135deg, #00D4AA, #00A3E0, #8A2BE2, #FF6B6B, #FFB347)"
          p={6}
          position="relative"
          overflow="hidden"
          textAlign="center"
        >
          {/* Decorative icons - smaller and positioned */}
          <Box position="absolute" top={2} left={4}>
            <Icon as={FiHeart} color="whiteAlpha.600" boxSize={4} />
          </Box>
          <Box position="absolute" top={3} right={6}>
            <Icon as={FiPlus} color="whiteAlpha.700" boxSize={3} />
          </Box>
          <Box position="absolute" bottom={2} left={8}>
            <Icon as={FiStar} color="whiteAlpha.500" boxSize={3} />
          </Box>
          <Box position="absolute" bottom={3} right={4}>
            <Icon as={FiPlus} color="whiteAlpha.600" boxSize={4} />
          </Box>

          {/* Content - more compact */}
          <VStack spacing={3} color="white" py={2}>
            <Heading size="lg" fontWeight="bold" lineHeight="short">
              Customize your feed now!
            </Heading>

            <Text fontSize="sm" opacity={0.9} maxW="sm" lineHeight="base">
              Find and add your favorite fandoms to see the latest news and
              discussions!
            </Text>

            <HStack spacing={3} pt={1}>
              <Button
                leftIcon={<Icon as={FiHeart} />}
                bg="rgba(255,255,255,0.2)"
                color="white"
                _hover={{
                  bg: "rgba(255,255,255,0.3)",
                  transform: "translateY(-1px)",
                }}
                _active={{ bg: "rgba(255,255,255,0.4)" }}
                size="sm"
                borderRadius="md"
                px={4}
                fontWeight="bold"
                fontSize="xs"
                border="1px solid"
                borderColor="whiteAlpha.300"
                transition="all 0.2s"
                onClick={handleAddFandoms}
              >
                ADD FANDOMS
              </Button>

              <Button
                leftIcon={<Icon as={FiStar} />}
                bg="transparent"
                color="white"
                _hover={{
                  bg: "rgba(255,255,255,0.1)",
                  transform: "translateY(-1px)",
                }}
                _active={{ bg: "rgba(255,255,255,0.2)" }}
                size="sm"
                borderRadius="md"
                px={4}
                fontWeight="bold"
                fontSize="xs"
                border="1px solid"
                borderColor="whiteAlpha.400"
                transition="all 0.2s"
                onClick={handleExplore}
              >
                EXPLORE
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Bottom section with stats - more compact */}
        <Box p={3} textAlign="center" bg="gray.50" _dark={{ bg: "gray.700" }}>
          <VStack spacing={2}>
            <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>
              Join thousands of fans discussing their favorite fandoms
            </Text>
            <HStack spacing={4} justify="center">
              <VStack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="purple.600">
                  50K+
                </Text>
                <Text fontSize="9px" color="gray.500">
                  Active Users
                </Text>
              </VStack>
              <VStack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="blue.600">
                  200+
                </Text>
                <Text fontSize="9px" color="gray.500">
                  Fandoms
                </Text>
              </VStack>
              <VStack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="green.600">
                  10K+
                </Text>
                <Text fontSize="9px" color="gray.500">
                  Daily Posts
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
}
