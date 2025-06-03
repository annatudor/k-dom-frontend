// src/components/community/WelcomeSection.tsx - Compact fandom-style
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
import { FiUser } from "react-icons/fi";
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
    // Guest state - compact design
    return (
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="sm"
        w="full"
      >
        <CardBody p={4}>
          <VStack spacing={4} textAlign="center">
            {/* Header with icon */}
            <VStack spacing={2}>
              <HStack spacing={2} align="center">
                <Avatar
                  size="md"
                  bg="purple.500"
                  icon={<Icon as={FiUser} color="white" boxSize={5} />}
                />
                <Badge
                  colorScheme="purple"
                  variant="solid"
                  px={2}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                >
                  BETA
                </Badge>
              </HStack>

              <VStack spacing={1}>
                <Heading size="md" fontWeight="bold" color="purple.600">
                  Welcome
                </Heading>
                <Text fontSize="sm" color="gray.600" lineHeight="short">
                  Join the K-Dom community
                </Text>
              </VStack>
            </VStack>

            {/* Auth buttons */}
            <VStack spacing={2} w="full">
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="purple"
                size="sm"
                w="full"
                borderRadius="md"
                fontWeight="bold"
              >
                REGISTER
              </Button>

              <Button
                as={RouterLink}
                to="/login"
                variant="outline"
                colorScheme="purple"
                size="sm"
                w="full"
                borderRadius="md"
              >
                SIGN IN
              </Button>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Authenticated user state - compact design
  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="sm"
      w="full"
    >
      <CardBody p={4}>
        <VStack spacing={3} textAlign="center">
          {/* User info */}
          <VStack spacing={2}>
            <Avatar size="md" name={user?.username} src={user?.avatarUrl} />
            <VStack spacing={1}>
              <Heading size="sm" fontWeight="bold">
                Welcome
              </Heading>
              <Text fontSize="md" fontWeight="semibold" color="purple.600">
                {user?.username}!
              </Text>
            </VStack>
          </VStack>

          {/* Profile button */}
          <Button
            as={RouterLink}
            to="/profile/my-profile"
            variant="outline"
            colorScheme="purple"
            size="sm"
            w="full"
            borderRadius="md"
          >
            VIEW PROFILE
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}
