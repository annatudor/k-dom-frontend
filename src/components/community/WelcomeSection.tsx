// src/components/community/WelcomeSection.tsx - Compact fandom-style with login redirect
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

interface AuthUser {
  id: number;
  username: string;
  role: string;
  avatarUrl?: string;
  email?: string;
}

interface WelcomeSectionProps {
  user?: AuthUser | null;
  isAuthenticated: boolean;
  onRegister?: () => void;
  onLogin?: () => void;
  onViewProfile?: () => void;
}

export function WelcomeSection({
  user,
  isAuthenticated,
  onRegister,
  onLogin,
  onViewProfile,
}: WelcomeSectionProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
    } else {
      window.location.href = "/register";
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      window.location.href = "/login";
    }
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile();
    } else {
      window.location.href = "/profile/my-profile";
    }
  };

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
                onClick={handleRegister}
                colorScheme="purple"
                size="sm"
                w="full"
                borderRadius="md"
                fontWeight="bold"
              >
                REGISTER
              </Button>

              <Button
                onClick={handleLogin}
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
            onClick={handleViewProfile}
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
} // src/components/community/WelcomeSection.tsx - Compact fandom-style with
