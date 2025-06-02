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

// Componente care le vom crea separat
import { KDomContent } from "@/components/kdom/kdom-components/KDomContent";
import { KDomSidebar } from "@/components/kdom/kdom-components/KDomSidebar";
import { UniversalComments } from "@/components/comments/UniversalComments";
import { useKDomFollow } from "@/hooks/useKDomFollow";

export default function KDomPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const toast = useToast();

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

  const {
    isFollowing,
    followersCount,
    handleToggleFollow,
    isLoading: isFollowLoading,
    canFollow,
  } = useKDomFollow(kdom?.id || "");

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                <VStack spacing={3} align="end" minW="250px">
                  <HStack spacing={3}>
                    {/* ✅ FOLLOW BUTTON ACTUALIZAT - folosește hook-ul */}
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
                    {/* Edit Button - only for owners/admins */}
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
                    {/* Share Button */}
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
                    More Options Menu
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
                        {/* Settings - only for owners */}
                        {canEdit && (
                          <MenuItem
                            as={RouterLink}
                            to={`/kdom/${kdom.slug}/settings`}
                            icon={<FiSettings />}
                          >
                            K-Dom Settings
                          </MenuItem>
                        )}

                        {/* Bookmark */}
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

                        {/* Report K-Dom - only if not own K-Dom */}
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
                  justify="space-between"
                  align={{ base: "start", md: "center" }}
                >
                  <HStack spacing={6} wrap="wrap">
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
                    {/* ✅ NOUĂ STATISTICĂ - Followers */}
                    <HStack spacing={3}>
                      <Icon as={FiHeart} boxSize={5} color="red.500" />
                      <Text>Followers:</Text>
                      <Text fontWeight="bold" color="red.500">
                        {followersCount}
                      </Text>
                    </HStack>
                  </HStack>
                </Flex>
              </VStack>
            </CardBody>
          </Card>

          {/* Main Content Layout */}
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
                <UniversalComments targetType="KDom" targetId={kdom.id} />
              </VStack>
            </GridItem>

            {/* Sidebar - să treacă și followersCount */}
            <GridItem display={{ base: "none", lg: "block" }}>
              <Box position="sticky" top="20px">
                <KDomSidebar
                  kdomId={kdom.id}
                  kdomSlug={kdom.slug}
                  kdomUserId={kdom.userId}
                  followersCount={followersCount}
                />
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
