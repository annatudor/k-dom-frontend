// src/components/community/CustomizeFeedSection.tsx
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
} from "@chakra-ui/react";
import { FiHeart, FiPlus } from "react-icons/fi";

interface CustomizeFeedSectionProps {
  isAuthenticated: boolean;
}

export function CustomizeFeedSection({
  isAuthenticated,
}: CustomizeFeedSectionProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Nu afișa pentru utilizatori autentificați
  if (isAuthenticated) {
    return null;
  }

  return (
    <Card
      bg={cardBg}
      borderWidth="2px"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="lg"
      overflow="hidden"
    >
      <CardBody p={0}>
        {/* Header colorat cu iconuri */}
        <Box
          bgGradient="linear(to-r, teal.400, blue.500, purple.600, pink.500, orange.400)"
          p={6}
          position="relative"
          overflow="hidden"
        >
          {/* Decorative icons */}
          <Box position="absolute" top={2} left={4}>
            <Icon as={FiHeart} color="whiteAlpha.600" boxSize={8} />
          </Box>
          <Box position="absolute" top={4} right={6}>
            <Icon as={FiPlus} color="whiteAlpha.700" boxSize={6} />
          </Box>
          <Box position="absolute" bottom={2} left={12}>
            <Icon as={FiHeart} color="whiteAlpha.500" boxSize={5} />
          </Box>
          <Box position="absolute" bottom={4} right={4}>
            <Icon as={FiPlus} color="whiteAlpha.600" boxSize={7} />
          </Box>

          {/* Content */}
          <VStack spacing={4} textAlign="center" color="white" py={4}>
            <Heading size="lg" fontWeight="bold">
              Customize your feed now!
            </Heading>

            <Text fontSize="md" opacity={0.9} maxW="sm" lineHeight="tall">
              Find and add your favorite K-Doms to see the latest news and
              discussions!
            </Text>

            <Button
              leftIcon={<Icon as={FiHeart} />}
              bg="purple.600"
              color="white"
              _hover={{ bg: "purple.700" }}
              _active={{ bg: "purple.800" }}
              size="lg"
              borderRadius="xl"
              px={8}
              fontWeight="bold"
            >
              ADD K-DOMS
            </Button>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
}
