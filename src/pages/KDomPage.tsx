// src/pages/KDomPage.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Flex,
  Icon,
  Card,
  CardBody,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FiEdit3, FiUsers, FiHeart, FiClock, FiStar } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  getKDomBySlug,
  isKDomFollowed,
  followKDom,
  unfollowKDom,
} from "@/api/kdom";
import { useAuth } from "@/context/AuthContext";

// Componente care le vom crea separat
import { KDomContent } from "@/components/kdom/kdom-components/KDomContent";
import { KDomSidebar } from "@/components/kdom/kdom-components/KDomSidebar";
import { KDomComments } from "@/components/kdom/kdom-components/KDomComments";

export default function KDomPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Query pentru detaliile K-Dom-ului (folosim ID în loc de slug pentru acum)
  const {
    data: kdom,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kdom", slug],
    queryFn: () => getKDomBySlug(slug!),
    enabled: !!slug,
  });

  // Query pentru a verifica dacă utilizatorul urmărește K-Dom-ul
  const { data: followStatus } = useQuery({
    queryKey: ["kdom-follow-status", kdom?.id],
    queryFn: () => isKDomFollowed(kdom!.id),
    enabled: !!kdom?.id && isAuthenticated,
  });

  // Effect pentru a seta starea de follow
  useEffect(() => {
    if (followStatus !== undefined) {
      setIsFollowing(followStatus);
    }
  }, [followStatus]);

  // Handler pentru follow/unfollow
  const handleFollowToggle = async () => {
    if (!kdom || !isAuthenticated) return;

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowKDom(kdom.id);
        setIsFollowing(false);
      } else {
        await followKDom(kdom.id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (isLoading) {
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
      >
        <VStack spacing={8}>
          <Spinner size="xl" thickness="4px" color="blue.500" />
          <Text fontSize="lg" color="gray.600">
            Loading K-Dom...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (error || !kdom) {
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
        <Alert status="error" borderRadius="lg" maxW="500px">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">K-Dom not found</Text>
            <Text>This K-Dom doesn't exist or has been removed.</Text>
          </VStack>
        </Alert>
      </Box>
    );
  }

  // Determinăm tema culorilor bazată pe tema K-Dom-ului
  const getThemeColors = () => {
    switch (kdom.theme) {
      case "Dark":
        return {
          bg: "gray.900",
          accent: "purple.400",
          gradient: "linear(to-r, purple.600, blue.600)",
          badgeScheme: "purple",
        };
      case "Vibrant":
        return {
          bg: "purple.50",
          accent: "purple.600",
          gradient: "linear(to-r, purple.500, pink.500)",
          badgeScheme: "purple",
        };
      case "Pastel":
        return {
          bg: "pink.50",
          accent: "pink.500",
          gradient: "linear(to-r, pink.400, purple.400)",
          badgeScheme: "pink",
        };
      default:
        return {
          bg: cardBg,
          accent: "blue.500",
          gradient: "linear(to-r, blue.500, cyan.500)",
          badgeScheme: "blue",
        };
    }
  };

  const themeColors = getThemeColors();

  return (
    // PAGINA COMPLETĂ - ieșim din orice container
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg={bgColor}
      overflowY="auto"
      zIndex={1}
    >
      {/* Layout fără margini - folosește TOATĂ lățimea */}
      <Box w="100vw" px={8} py={6}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb mb={6} fontSize="sm" color="gray.600">
          <BreadcrumbItem>
            <BreadcrumbLink
              as={RouterLink}
              to="/"
              _hover={{ color: "blue.500" }}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={RouterLink}
              to={`/hub/${kdom.hub.toLowerCase()}`}
              _hover={{ color: "blue.500" }}
            >
              {kdom.hub}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text color="gray.500">{kdom.title}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Container pentru conținut - FOARTE LARG */}
        <Box w="100%">
          {/* Hero Header Section */}
          <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            mb={8}
            overflow="hidden"
            boxShadow="lg"
          >
            {/* Header with gradient background */}
            <Box bgGradient={themeColors.gradient} color="white" px={8} py={8}>
              <Flex
                justify="space-between"
                align="flex-start"
                wrap="wrap"
                gap={6}
              >
                {/* Left side - Title and info */}
                <VStack align="start" spacing={4} flex="1" minW="300px">
                  <Heading size="3xl" fontWeight="bold" lineHeight="1.2">
                    {kdom.title}
                  </Heading>
                  <HStack spacing={4} flexWrap="wrap">
                    <Badge
                      colorScheme={themeColors.badgeScheme}
                      variant="solid"
                      px={4}
                      py={2}
                      borderRadius="full"
                      fontSize="md"
                      fontWeight="bold"
                    >
                      {kdom.hub}
                    </Badge>
                    <Badge
                      colorScheme="green"
                      variant="solid"
                      px={4}
                      py={2}
                      borderRadius="full"
                      fontSize="md"
                      fontWeight="bold"
                    >
                      {kdom.language}
                    </Badge>
                    {kdom.isForKids && (
                      <Badge
                        colorScheme="orange"
                        variant="solid"
                        px={4}
                        py={2}
                        borderRadius="full"
                        fontSize="md"
                        fontWeight="bold"
                      >
                        Child-friendly
                      </Badge>
                    )}
                  </HStack>
                </VStack>

                {/* Right side - Action Buttons */}
                {isAuthenticated && (
                  <VStack spacing={3} align="end" minW="200px">
                    <HStack spacing={3}>
                      <Button
                        leftIcon={<Icon as={FiHeart} />}
                        colorScheme={isFollowing ? "red" : "whiteAlpha"}
                        variant={isFollowing ? "solid" : "outline"}
                        onClick={handleFollowToggle}
                        isLoading={isFollowLoading}
                        size="lg"
                        borderColor="white"
                        color={isFollowing ? "white" : "white"}
                        _hover={{
                          bg: isFollowing ? "red.600" : "whiteAlpha.200",
                        }}
                        px={6}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>

                      {(user?.id === kdom.userId || user?.role === "admin") && (
                        <Button
                          leftIcon={<Icon as={FiEdit3} />}
                          variant="outline"
                          size="lg"
                          as={RouterLink}
                          to={`/kdoms/${kdom.slug}/edit`}
                          borderColor="white"
                          color="white"
                          _hover={{ bg: "whiteAlpha.200" }}
                          px={6}
                        >
                          Edit
                        </Button>
                      )}
                    </HStack>
                  </VStack>
                )}
              </Flex>
            </Box>

            {/* Meta Information */}
            <CardBody px={8} py={6}>
              <VStack align="start" spacing={6}>
                {/* Description */}
                {kdom.description && (
                  <Text fontSize="xl" color="gray.700" lineHeight="tall">
                    {kdom.description}
                  </Text>
                )}

                {/* Stats Row */}
                <Flex
                  direction={{ base: "column", md: "row" }}
                  wrap="wrap"
                  gap={8}
                  color="gray.600"
                  fontSize="md"
                  w="full"
                >
                  <HStack spacing={3}>
                    <Icon as={FiUsers} boxSize={5} />
                    <Text>Created by</Text>
                    <Text fontWeight="bold" color="blue.600">
                      {kdom.authorUsername}
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={FiClock} boxSize={5} />
                    <Text>Last updated</Text>
                    <Text fontWeight="bold">
                      {new Date(
                        kdom.updatedAt || kdom.createdAt
                      ).toLocaleDateString()}
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={FiStar} boxSize={5} />
                    <Text>Theme:</Text>
                    <Text fontWeight="bold" color={themeColors.accent}>
                      {kdom.theme}
                    </Text>
                  </HStack>
                </Flex>
              </VStack>
            </CardBody>
          </Card>

          {/* Main Content Layout - FOARTE LARG */}
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 300px" }}
            gap={12}
            alignItems="start"
            w="100%"
          >
            {/* Main Content Area */}
            <GridItem>
              <VStack spacing={8} align="stretch">
                <KDomContent content={kdom.contentHtml} theme={kdom.theme} />

                <Divider borderColor={borderColor} />

                <KDomComments kdomId={kdom.id} />
              </VStack>
            </GridItem>

            {/* Sidebar */}
            <GridItem display={{ base: "none", lg: "block" }}>
              <Box position="sticky" top="20px">
                <KDomSidebar
                  kdomId={kdom.id}
                  kdomSlug={kdom.slug}
                  kdomUserId={kdom.userId}
                />
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
