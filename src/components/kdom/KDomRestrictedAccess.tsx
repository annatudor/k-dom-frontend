// src/components/kdom/KDomRestrictedAccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Text,
  Badge,
  Icon,
  useColorModeValue,
  Card,
  CardBody,
  Spinner,
} from "@chakra-ui/react";
import {
  FiClock,
  FiXCircle,
  FiTrash2,
  FiHome,
  FiArrowLeft,
  FiEye,
  FiAlertTriangle,
} from "react-icons/fi";
import type {
  KDomAccessCheckResult,
  KDomModerationStatus,
} from "@/types/Moderation";
import { getAlertStatus } from "@/utils/restrictedAccessUtils";

interface KDomRestrictedAccessProps {
  accessResult: KDomAccessCheckResult;
  kdomTitle?: string;
  kdomSlug?: string;
  action?: string;
  autoRedirect?: boolean;
  redirectDelay?: number;
}

export function KDomRestrictedAccess({
  accessResult,
  kdomTitle,
  kdomSlug,
  action = "access",
  autoRedirect = false,
  redirectDelay = 3000,
}: KDomRestrictedAccessProps) {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  // Auto-redirect logic
  useEffect(() => {
    if (autoRedirect && accessResult.redirectTo && !accessResult.hasAccess) {
      const timer = setTimeout(() => {
        navigate(accessResult.redirectTo!);
      }, redirectDelay);

      return () => clearTimeout(timer);
    }
  }, [autoRedirect, accessResult, navigate, redirectDelay]);

  // Dacă are acces, nu afișăm nimic
  if (accessResult.hasAccess) {
    return null;
  }

  const getStatusConfig = (status?: KDomModerationStatus) => {
    switch (status) {
      case "Pending":
        return {
          icon: FiClock,
          colorScheme: "yellow",
          title: "K-DOM Pending Moderation",
          description:
            "This K-DOM is waiting for moderator approval before becoming publicly available.",
          bgGradient: "linear(to-r, yellow.400, orange.400)",
        };
      case "Rejected":
        return {
          icon: FiXCircle,
          colorScheme: "red",
          title: "K-DOM Rejected",
          description:
            "This K-DOM has been rejected by moderators and is not publicly available.",
          bgGradient: "linear(to-r, red.400, pink.400)",
        };
      case "Deleted":
        return {
          icon: FiTrash2,
          colorScheme: "red",
          title: "K-DOM Deleted",
          description:
            "This K-DOM has been removed and is no longer available.",
          bgGradient: "linear(to-r, red.500, red.600)",
        };
      default:
        return {
          icon: FiAlertTriangle,
          colorScheme: "gray",
          title: "Access Restricted",
          description: "You don't have permission to access this K-DOM.",
          bgGradient: "linear(to-r, gray.400, gray.500)",
        };
    }
  };

  const statusConfig = getStatusConfig(accessResult.status);

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg={bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={8}
    >
      <Card
        bg={cardBg}
        maxW="600px"
        w="full"
        boxShadow="2xl"
        borderRadius="2xl"
        overflow="hidden"
      >
        {/* Header with gradient */}
        <Box
          bgGradient={statusConfig.bgGradient}
          color="white"
          p={8}
          textAlign="center"
        >
          <VStack spacing={4}>
            <Icon as={statusConfig.icon} boxSize={16} />
            <VStack spacing={2}>
              <Text fontSize="2xl" fontWeight="bold">
                {statusConfig.title}
              </Text>
              {accessResult.status && (
                <Badge
                  colorScheme={statusConfig.colorScheme}
                  variant="solid"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="md"
                  fontWeight="bold"
                  bg="whiteAlpha.300"
                  color="white"
                >
                  Status: {accessResult.status}
                </Badge>
              )}
            </VStack>
          </VStack>
        </Box>

        <CardBody p={8}>
          <VStack spacing={6} align="stretch">
            {/* Main Alert */}
            <Alert
              status={getAlertStatus(accessResult.status)}
              borderRadius="lg"
              variant="left-accent"
              flexDirection="column"
              alignItems="flex-start"
              textAlign="left"
            >
              <HStack spacing={3} mb={3}>
                <AlertIcon boxSize={6} />
                <AlertTitle fontSize="lg">
                  Cannot {action} this K-DOM
                </AlertTitle>
              </HStack>
              <AlertDescription fontSize="md" lineHeight="tall">
                {accessResult.reason || statusConfig.description}
              </AlertDescription>
            </Alert>

            {/* K-DOM Info */}
            {kdomTitle && (
              <Box p={4} bg="gray.50" borderRadius="lg" borderWidth="1px">
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                    K-DOM Details:
                  </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    {kdomTitle}
                  </Text>
                  {kdomSlug && (
                    <Text fontSize="sm" color="gray.500">
                      Slug: /{kdomSlug}
                    </Text>
                  )}
                </VStack>
              </Box>
            )}

            {/* Status-specific information */}
            {accessResult.status === "Pending" && (
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <AlertTitle fontSize="md">What does this mean?</AlertTitle>
                  <AlertDescription fontSize="sm">
                    All new K-DOMs must be reviewed by our moderation team
                    before becoming publicly available. This helps ensure
                    quality content and community safety.
                  </AlertDescription>
                </VStack>
              </Alert>
            )}

            {accessResult.status === "Rejected" && (
              <Alert status="warning" borderRadius="lg">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <AlertTitle fontSize="md">Rejection Information</AlertTitle>
                  <AlertDescription fontSize="sm">
                    This K-DOM was reviewed by moderators and did not meet our
                    community guidelines. If you're the author, check your
                    dashboard for specific feedback.
                  </AlertDescription>
                </VStack>
              </Alert>
            )}

            {/* Auto-redirect notification */}
            {autoRedirect && accessResult.redirectTo && (
              <HStack
                spacing={3}
                p={4}
                bg="blue.50"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="blue.200"
              >
                <Spinner size="sm" color="blue.500" />
                <Text fontSize="sm" color="blue.700">
                  Redirecting you in {Math.ceil(redirectDelay / 1000)}{" "}
                  seconds...
                </Text>
              </HStack>
            )}

            {/* Action Buttons */}
            <VStack spacing={4} pt={4}>
              <HStack spacing={4} w="full">
                {/* Go Back Button */}
                <Button
                  leftIcon={<Icon as={FiArrowLeft} />}
                  variant="outline"
                  colorScheme="gray"
                  onClick={() => navigate(-1)}
                  flex="1"
                >
                  Go Back
                </Button>

                {/* Home Button */}
                <Button
                  leftIcon={<Icon as={FiHome} />}
                  colorScheme="blue"
                  onClick={() => navigate("/")}
                  flex="1"
                >
                  Go Home
                </Button>
              </HStack>

              {/* Conditional action buttons */}
              {accessResult.status === "Pending" && (
                <Button
                  leftIcon={<Icon as={FiEye} />}
                  variant="ghost"
                  colorScheme="gray"
                  size="sm"
                  onClick={() => navigate("/moderation/status")}
                  w="full"
                >
                  Check My Submission Status
                </Button>
              )}

              {accessResult.status === "Rejected" && (
                <Button
                  leftIcon={<Icon as={FiEye} />}
                  variant="ghost"
                  colorScheme="red"
                  size="sm"
                  onClick={() => navigate("/moderation/history")}
                  w="full"
                >
                  View Moderation History
                </Button>
              )}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
