// src/pages/KDomPage.tsx - Restructurat cu sidebar pe partea dreapta
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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import {
  FiEdit3,
  FiUsers,
  FiHeart,
  FiClock,
  FiStar,
  FiMoreVertical,
  FiShare2,
  FiBookmark,
  FiSettings,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

import { getKDomBySlug } from "@/api/kdom";
import { useAuth } from "@/context/AuthContext";
import { FlagMenuItem } from "@/components/flag/FlagButton";

// Componente pentru K-Dom
import { KDomContent } from "@/components/kdom/kdom-components/KDomContent";
import { KDomSidebar } from "@/components/kdom/kdom-components/KDomSidebar";
import { UniversalComments } from "@/components/comments/UniversalComments";
import { useKDomFollow } from "@/hooks/useKDomFollow";

// ✅ VIEW TRACKING COMPONENTS
import { AutoTrackingViewCounter } from "@/components/view-tracking/ViewCounter";
import { ViewStats } from "@/components/view-tracking/ViewStats";

export default function KDomPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Query pentru detaliile K-Dom-ului
  const {
    data: kdom,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kdom", slug],
    queryFn: () => getKDomBySlug(slug!),
    enabled: !!slug,
  });

  const {
    isFollowing,
    followersCount,
    handleToggleFollow,
    isLoading: isFollowLoading,
    canFollow,
  } = useKDomFollow(kdom?.id || "");

  // ✅ LOGICA DE PERMISIUNI pentru stats
  const canViewStats =
    user &&
    kdom &&
    (user.id === kdom.userId || // Owner-ul K-Dom-ului
      user.role === "admin" ||
      user.role === "moderator");

  // Handle share functionality
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "K-Dom link copied to clipboard",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Failed to copy link",
        description: "Please copy the URL manually",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Handle flag success
  const handleFlagSuccess = () => {
    toast({
      title: "Report submitted",
      description:
        "Thank you for helping us maintain quality content. Our moderation team will review this K-Dom.",
      status: "success",
      duration: 5000,
    });
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

  // Check permissions
  const canEdit =
    user &&
    (user.id === kdom.userId ||
      user.role === "admin" ||
      user.role === "moderator");
  const isOwnKDom = user?.id === kdom.userId;

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
      {/* ✅ AUTO-TRACKING VIEW COUNTER PENTRU TOATĂ PAGINA */}
      <AutoTrackingViewCounter
        contentType="KDom"
        contentId={kdom.id}
        variant="minimal"
        showDebugInfo={import.meta.env.DEV}
      />

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

        {/* Container pentru conținut */}
        <Box w="100%">
          {/* Hero Header Section - Simplificat fără stats */}
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
                <VStack spacing={3} align="end" minW="250px">
                  <HStack spacing={3}>
                    {canFollow && !isOwnKDom && (
                      <Button
                        leftIcon={<Icon as={FiHeart} />}
                        colorScheme={isFollowing ? "red" : "whiteAlpha"}
                        variant={isFollowing ? "solid" : "outline"}
                        onClick={handleToggleFollow}
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
                    )}
                    {canEdit && (
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
                    <IconButton
                      aria-label="Share K-Dom"
                      icon={<FiShare2 />}
                      variant="outline"
                      size="lg"
                      borderColor="white"
                      color="white"
                      _hover={{ bg: "whiteAlpha.200" }}
                      onClick={handleShare}
                    />
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="More options"
                        icon={<FiMoreVertical />}
                        variant="outline"
                        size="lg"
                        borderColor="white"
                        color="white"
                        _hover={{ bg: "whiteAlpha.200" }}
                      />
                      <MenuList>
                        {canEdit && (
                          <MenuItem
                            as={RouterLink}
                            to={`/kdom/${kdom.slug}/settings`}
                            icon={<FiSettings />}
                          >
                            K-Dom Settings
                          </MenuItem>
                        )}

                        {canFollow && !isOwnKDom && (
                          <MenuItem
                            icon={<FiBookmark />}
                            onClick={handleToggleFollow}
                            isDisabled={isFollowLoading}
                            color={isFollowing ? "red.500" : "gray.600"}
                          >
                            {isFollowing ? "Remove Bookmark" : "Bookmark"}
                          </MenuItem>
                        )}

                        {!isOwnKDom && (
                          <>
                            <Divider />
                            <FlagMenuItem
                              contentType="KDom"
                              contentId={kdom.id}
                              contentTitle={kdom.title}
                              contentOwnerId={kdom.userId}
                              onSuccess={handleFlagSuccess}
                            />
                          </>
                        )}
                      </MenuList>
                    </Menu>
                  </HStack>
                </VStack>
              </Flex>
            </Box>

            {/* ✅ Meta Information - Doar informații de bază */}
            <CardBody px={8} py={6}>
              <VStack align="start" spacing={6}>
                {/* Description */}
                {kdom.description && (
                  <Text fontSize="xl" color="gray.700" lineHeight="tall">
                    {kdom.description}
                  </Text>
                )}

                {/* ✅ Basic Info Row - Fără stats complexe */}
                <HStack spacing={6} wrap="wrap" fontSize="md" color="gray.600">
                  <HStack spacing={3}>
                    <Icon as={FiUsers} boxSize={5} />
                    <Text>Created by</Text>
                    <Text
                      as={RouterLink}
                      to={`/profile/${kdom.userId}`}
                      fontWeight="bold"
                      color="blue.600"
                      _hover={{ textDecoration: "underline" }}
                    >
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
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* ✅ Main Content Layout - Întotdeauna cu sidebar */}
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 320px" }}
            gap={12}
            alignItems="start"
            w="100%"
          >
            {/* Main Content Area */}
            <GridItem>
              <VStack spacing={8} align="stretch">
                <KDomContent content={kdom.contentHtml} theme={kdom.theme} />

                {/* ✅ DETAILED VIEW STATS doar pentru owner/admin în main content */}
                {canViewStats && (
                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="xl"
                    boxShadow="sm"
                  >
                    <CardBody p={6}>
                      <ViewStats
                        contentType="KDom"
                        contentId={kdom.id}
                        variant="detailed"
                        refreshInterval={300000}
                        showComparison={true}
                      />
                    </CardBody>
                  </Card>
                )}

                <Divider borderColor={borderColor} />
                <UniversalComments targetType="KDom" targetId={kdom.id} />
              </VStack>
            </GridItem>

            {/* ✅ RIGHT SIDEBAR - Întotdeauna prezent */}
            <GridItem display={{ base: "none", lg: "block" }}>
              <Box position="sticky" top="20px">
                <VStack spacing={6} align="stretch">
                  {/* ✅ 1. STATISTICS - Prima secțiune */}
                  {canViewStats ? (
                    <ViewStats
                      contentType="KDom"
                      contentId={kdom.id}
                      variant="sidebar"
                      refreshInterval={300000}
                    />
                  ) : (
                    // ✅ Basic stats pentru toți utilizatorii
                    <Card
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="xl"
                      boxShadow="md"
                      overflow="hidden"
                    >
                      <CardBody p={5}>
                        <VStack spacing={4} align="stretch">
                          <HStack spacing={3}>
                            <Icon as={FiUsers} color="blue.500" boxSize={5} />
                            <Heading
                              size="md"
                              color="blue.600"
                              fontWeight="bold"
                            >
                              Community
                            </Heading>
                          </HStack>

                          <VStack align="start" spacing={3}>
                            <HStack justify="space-between" w="full">
                              <HStack spacing={2}>
                                <Icon
                                  as={FiHeart}
                                  boxSize={4}
                                  color="red.500"
                                />
                                <Text
                                  fontSize="md"
                                  color="gray.600"
                                  fontWeight="medium"
                                >
                                  Followers
                                </Text>
                              </HStack>
                              <Badge
                                colorScheme="red"
                                borderRadius="full"
                                px={4}
                                py={1}
                                fontSize="sm"
                                fontWeight="bold"
                              >
                                {followersCount}
                              </Badge>
                            </HStack>

                            <HStack justify="space-between" w="full">
                              <HStack spacing={2}>
                                <Icon
                                  as={FiClock}
                                  boxSize={4}
                                  color="green.500"
                                />
                                <Text
                                  fontSize="md"
                                  color="gray.600"
                                  fontWeight="medium"
                                >
                                  Last activity
                                </Text>
                              </HStack>
                              <Text
                                fontSize="md"
                                fontWeight="bold"
                                color="green.600"
                              >
                                Today
                              </Text>
                            </HStack>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* ✅ 2. SUB-PAGES & NAVIGATION */}
                  <KDomSidebar
                    kdomId={kdom.id}
                    kdomSlug={kdom.slug}
                    kdomUserId={kdom.userId}
                    followersCount={followersCount}
                  />
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
