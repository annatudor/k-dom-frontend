// src/components/community/CommunityHeader.tsx
import {
  Box,
  Container,
  Heading,
  HStack,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";

export function CommunityHeader() {
  const headerBg = useColorModeValue("purple.600", "purple.700");

  return (
    <Box bg={headerBg} py={6} top={0} zIndex={100} boxShadow="md">
      <Container maxW="container.xl">
        <HStack justify="center">
          <HStack spacing={3} align="center">
            <Icon as={FiHeart} color="orange.300" boxSize={8} />
            <Heading
              size="xl"
              color="white"
              fontWeight="bold"
              letterSpacing="wide"
            >
              K-D
              <Box as="span" color="orange.300">
                ❤
              </Box>
              m
            </Heading>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
