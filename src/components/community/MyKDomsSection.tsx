// src/components/community/MyKDomsSection.tsx - Updated with KDomSearchDialog integration
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  useColorModeValue,
  Icon,
  Heading,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Box,
  SimpleGrid,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiMoreVertical,
  FiHeart,
  FiSmile,
  FiPlus,
  FiStar,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { KDomSearchDialog } from "./KDomSearchDialog";
import type { KDomTagSearchResultDto } from "@/types/KDom";

interface MyKDomsSectionProps {
  isAuthenticated: boolean;
  followedKdoms: KDomTagSearchResultDto[];
  isLoading: boolean;
}

export function MyKDomsSection({
  isAuthenticated,
  followedKdoms,
  isLoading,
}: MyKDomsSectionProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");

  // ✅ STEP 1: Add state for KDomSearchDialog
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  // ✅ STEP 2: Handle Add K-Doms button click
  const handleAddKDoms = () => {
    if (isAuthenticated) {
      // Show search dialog for authenticated users
      onSearchOpen();
    } else {
      // Redirect to login for guests
      window.location.href = "/login";
    }
  };

  if (!isAuthenticated) {
    // Guest state - compact discovery section
    return (
      <>
        <Card
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          boxShadow="sm"
          w="full"
        >
          <CardBody p={4}>
            <VStack spacing={4}>
              {/* Header */}
              <HStack justify="space-between" w="full">
                <Heading size="sm" color={textColor}>
                  My K-Doms
                </Heading>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    size="xs"
                  />
                  <MenuList
                    fontSize="sm"
                    zIndex={1500}
                    style={{ position: "fixed" }}
                  >
                    <MenuItem>Manage Fandoms</MenuItem>
                    <MenuItem>Settings</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>

              {/* Discovery illustration */}
              <VStack spacing={3} py={4} textAlign="center">
                {/* Decorative icons grid */}
                <SimpleGrid columns={3} spacing={3} w="120px">
                  <Center>
                    <Icon as={FiStar} boxSize={4} color="yellow.400" />
                  </Center>
                  <Center>
                    <Icon as={FiHeart} boxSize={5} color="red.400" />
                  </Center>
                  <Center>
                    <Icon as={FiPlus} boxSize={4} color="blue.400" />
                  </Center>
                  <Center>
                    <Icon as={FiPlus} boxSize={4} color="green.400" />
                  </Center>
                  <Center>
                    <Icon as={FiSmile} boxSize={6} color="purple.400" />
                  </Center>
                  <Center>
                    <Icon as={FiStar} boxSize={4} color="orange.400" />
                  </Center>
                  <Center>
                    <Icon as={FiHeart} boxSize={4} color="pink.400" />
                  </Center>
                  <Center>
                    <Icon as={FiPlus} boxSize={4} color="teal.400" />
                  </Center>
                  <Center>
                    <Icon as={FiStar} boxSize={4} color="cyan.400" />
                  </Center>
                </SimpleGrid>

                <VStack spacing={2}>
                  <Heading size="xs" color="purple.600" fontWeight="bold">
                    DISCOVER K-DOMS
                  </Heading>
                  <Text color="gray.500" fontSize="xs" textAlign="center">
                    Search for fandoms to follow
                  </Text>
                </VStack>
              </VStack>

              {/* ✅ STEP 3: Updated button with onClick handler */}
              <Button
                leftIcon={<Icon as={FiHeart} />}
                variant="outline"
                colorScheme="purple"
                size="sm"
                w="full"
                borderRadius="md"
                fontSize="xs"
                fontWeight="bold"
                onClick={handleAddKDoms}
              >
                ADD K-DOMS
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* ✅ STEP 4: Add KDomSearchDialog - will only open for authenticated users */}
        <KDomSearchDialog isOpen={isSearchOpen} onClose={onSearchClose} />
      </>
    );
  }

  // Authenticated state
  return (
    <>
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="sm"
        w="full"
      >
        <CardBody p={4}>
          <VStack spacing={4}>
            {/* Header */}
            <HStack justify="space-between" w="full">
              <Heading size="sm" color={textColor}>
                My K-Doms
              </Heading>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiMoreVertical />}
                  variant="ghost"
                  size="xs"
                />
                <MenuList fontSize="sm">
                  <MenuItem>Manage Fandoms</MenuItem>
                  <MenuItem>View All</MenuItem>
                  <MenuItem>Settings</MenuItem>
                </MenuList>
              </Menu>
            </HStack>

            {/* K-Doms list */}
            {isLoading ? (
              <VStack spacing={2} w="full">
                {[1, 2, 3].map((i) => (
                  <HStack key={i} w="full" p={2}>
                    <Avatar size="xs" />
                    <VStack align="start" spacing={0} flex="1">
                      <Box h={3} bg="gray.200" borderRadius="sm" w="70%" />
                      <Box h={2} bg="gray.100" borderRadius="sm" w="50%" />
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            ) : followedKdoms.length > 0 ? (
              <VStack spacing={2} w="full">
                {followedKdoms.slice(0, 4).map((kdom) => (
                  <HStack
                    key={kdom.id}
                    w="full"
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                    cursor="pointer"
                    as={RouterLink}
                    to={`/kdoms/${kdom.slug}`}
                  >
                    <Avatar size="xs" name={kdom.title} />
                    <VStack align="start" spacing={0} flex="1">
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={textColor}
                        noOfLines={1}
                      >
                        {kdom.title}
                      </Text>
                      <Text fontSize="10px" color="gray.500">
                        423K Followers
                      </Text>
                    </VStack>
                  </HStack>
                ))}
                {followedKdoms.length > 4 && (
                  <Text
                    fontSize="xs"
                    color="purple.600"
                    fontWeight="semibold"
                    py={1}
                  >
                    +{followedKdoms.length - 4} more
                  </Text>
                )}
              </VStack>
            ) : (
              <VStack spacing={3} py={4} textAlign="center">
                <SimpleGrid columns={3} spacing={3} w="120px">
                  <Center>
                    <Icon as={FiStar} boxSize={4} color="yellow.400" />
                  </Center>
                  <Center>
                    <Icon as={FiHeart} boxSize={5} color="red.400" />
                  </Center>
                  <Center>
                    <Icon as={FiPlus} boxSize={4} color="blue.400" />
                  </Center>
                  <Center>
                    <Icon as={FiPlus} boxSize={4} color="green.400" />
                  </Center>
                  <Center>
                    <Icon as={FiSmile} boxSize={6} color="purple.400" />
                  </Center>
                  <Center>
                    <Icon as={FiStar} boxSize={4} color="orange.400" />
                  </Center>
                  <Center>
                    <Icon as={FiHeart} boxSize={4} color="pink.400" />
                  </Center>
                  <Center>
                    <Icon as={FiPlus} boxSize={4} color="teal.400" />
                  </Center>
                  <Center>
                    <Icon as={FiStar} boxSize={4} color="cyan.400" />
                  </Center>
                </SimpleGrid>

                <VStack spacing={2}>
                  <Heading size="xs" color="purple.600" fontWeight="bold">
                    DISCOVER K-DOMS
                  </Heading>
                  <Text color="gray.500" fontSize="xs" textAlign="center">
                    You haven't followed any fandoms yet
                  </Text>
                </VStack>
              </VStack>
            )}

            {/* ✅ STEP 5: Updated Add button with onClick handler */}
            <Button
              leftIcon={<Icon as={FiHeart} />}
              variant="outline"
              colorScheme="purple"
              size="sm"
              w="full"
              borderRadius="md"
              fontSize="xs"
              fontWeight="bold"
              onClick={handleAddKDoms}
            >
              ADD K-DOMS
            </Button>
          </VStack>
        </CardBody>
      </Card>

      <KDomSearchDialog isOpen={isSearchOpen} onClose={onSearchClose} />
    </>
  );
}
