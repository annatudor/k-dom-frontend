// src/components/community/WelcomeSection.tsx
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Badge,
  useColorModeValue,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { FiUser, FiHeart } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import type { AuthUser } from "@/context/AuthContext";

interface WelcomeSectionProps {
  user?: AuthUser | null;
  isAuthenticated: boolean;
}

export function WelcomeSection({ user, isAuthenticated }: WelcomeSectionProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (!isAuthenticated) {
    // Guest state
    return (
      <Card
        bg={cardBg}
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="lg"
        overflow="hidden"
        position="relative"
        bgGradient="linear(135deg, purple.600, purple.700)"
        color="white"
      >
        <CardBody p={6}>
          <VStack spacing={6} textAlign="center">
            {/* Header with icon */}
            <VStack spacing={3}>
              <HStack spacing={2} align="center">
                <Avatar
                  size="lg"
                  bg="whiteAlpha.200"
                  icon={<Icon as={FiUser} color="white" boxSize={8} />}
                />
                <Badge
                  colorScheme="pink"
                  variant="solid"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                >
                  BETA
                </Badge>
              </HStack>

              <VStack spacing={2}>
                <HStack spacing={2} align="center">
                  <Icon as={FiHeart} color="orange.300" boxSize={6} />
                  <Heading size="lg" fontWeight="bold">
                    Welcome
                  </Heading>
                </HStack>

                <Text fontSize="md" opacity={0.9} maxW="sm" lineHeight="tall">
                  This is your home for the latest content and fan discussions
                  around your favorite pop culture K-Doms.
                </Text>
              </VStack>
            </VStack>

            {/* Auth buttons */}
            <VStack spacing={2} w="full">
              <Text fontSize="sm" opacity={0.8}>
                Don't have an account?
              </Text>

              <HStack spacing={3} w="full">
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="outline"
                  borderColor="whiteAlpha.400"
                  color="white"
                  _hover={{
                    bg: "whiteAlpha.200",
                    borderColor: "whiteAlpha.600",
                  }}
                  size="md"
                  flex="1"
                >
                  SIGN IN
                </Button>

                <Button
                  as={RouterLink}
                  to="/register"
                  bg="whiteAlpha.200"
                  color="white"
                  _hover={{ bg: "whiteAlpha.300" }}
                  _active={{ bg: "whiteAlpha.400" }}
                  size="md"
                  flex="1"
                  fontWeight="bold"
                >
                  REGISTER
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Authenticated user state
  return (
    <Card
      bg={cardBg}
      borderWidth="2px"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="lg"
      overflow="hidden"
      bgGradient="linear(135deg, purple.600, purple.700)"
      color="white"
    >
      <CardBody p={6}>
        <VStack spacing={6} textAlign="center">
          {/* User info */}
          <VStack spacing={3}>
            <HStack spacing={2} align="center">
              <Avatar size="lg" name={user?.username} src={user?.avatarUrl} />
            </HStack>

            <VStack spacing={2}>
              <HStack spacing={2} align="center">
                <Heading size="lg" fontWeight="bold">
                  Welcome
                </Heading>
              </HStack>

              <Heading size="lg" fontWeight="bold">
                {user?.username}!
              </Heading>
            </VStack>
          </VStack>

          {/* Profile button */}
          <Button
            as={RouterLink}
            to="/profile/my-profile"
            variant="outline"
            borderColor="whiteAlpha.400"
            color="white"
            _hover={{
              bg: "whiteAlpha.200",
              borderColor: "whiteAlpha.600",
            }}
            size="lg"
            borderRadius="xl"
            px={8}
          >
            VIEW PROFILE
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}
