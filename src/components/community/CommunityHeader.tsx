// src/components/community/CommunityHeader.tsx - Simple header without navigation
import { Box, Container, HStack, Heading, Icon } from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";

export function CommunityHeader() {
  return (
    <Box bg="purple.600" py={6} top={0} zIndex={100} boxShadow="md">
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
