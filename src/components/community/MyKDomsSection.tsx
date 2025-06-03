// src/components/community/MyKDomsSection.tsx
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
} from "@chakra-ui/react";
import { FiMoreVertical, FiHeart, FiSmile } from "react-icons/fi";
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

  if (!isAuthenticated) {
    // Guest state
    return (
      <Card
        bg={cardBg}
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="lg"
      >
        <CardBody p={6}>
          <VStack spacing={6}>
            {/* Header */}
            <HStack justify="space-between" w="full">
              <Heading size="md" color={textColor}>
                My K-Doms
              </Heading>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiMoreVertical />}
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  <MenuItem>Manage K-Doms</MenuItem>
                  <MenuItem>Settings</MenuItem>
                </MenuList>
              </Menu>
            </HStack>

            {/* Empty state with illustration */}
            <VStack spacing={6} py={8} textAlign="center">
              <Box position="relative">
                <Icon as={FiSmile} boxSize={16} color="purple.400" />
                <Box position="absolute" top={-2} right={-2}>
                  <Icon as={FiHeart} boxSize={6} color="pink.400" />
                </Box>
              </Box>

              <VStack spacing={3}>
                <Heading size="md" color="purple.600">
                  DISCOVER K-DOMS
                </Heading>
                <Text color="gray.500" fontSize="sm" maxW="sm">
                  Search for K-Doms to follow
                </Text>
              </VStack>

              <Button
                leftIcon={<Icon as={FiHeart} />}
                variant="outline"
                colorScheme="purple"
                borderRadius="xl"
                px={6}
              >
                ADD K-DOMS
              </Button>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Authenticated state
  return (
    <Card
      bg={cardBg}
      borderWidth="2px"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="lg"
    >
      <CardBody p={6}>
        <VStack spacing={6}>
          {/* Header */}
          <HStack justify="space-between" w="full">
            <Heading size="md" color={textColor}>
              My K-Doms
            </Heading>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem>Manage K-Doms</MenuItem>
                <MenuItem>View All</MenuItem>
                <MenuItem>Settings</MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          {/* K-Doms list */}
          {isLoading ? (
            <VStack spacing={3} w="full">
              {[1, 2, 3].map((i) => (
                <HStack key={i} w="full" p={3}>
                  <Avatar size="sm" />
                  <VStack align="start" spacing={1} flex="1">
                    <Box h={3} bg="gray.200" borderRadius="md" w="60%" />
                    <Box h={2} bg="gray.100" borderRadius="md" w="40%" />
                  </VStack>
                </HStack>
              ))}
            </VStack>
          ) : followedKdoms.length > 0 ? (
            <VStack spacing={3} w="full">
              {followedKdoms.slice(0, 5).map((kdom) => (
                <HStack
                  key={kdom.id}
                  w="full"
                  p={3}
                  borderRadius="lg"
                  _hover={{ bg: "gray.50" }}
                >
                  <Avatar size="sm" name={kdom.title} />
                  <VStack align="start" spacing={1} flex="1">
                    <Text fontWeight="semibold" fontSize="sm" color={textColor}>
                      {kdom.title}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      423.3K Followers
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          ) : (
            <VStack spacing={6} py={8} textAlign="center">
              <Box position="relative">
                <Icon as={FiSmile} boxSize={16} color="purple.400" />
                <Box position="absolute" top={-2} right={-2}>
                  <Icon as={FiHeart} boxSize={6} color="pink.400" />
                </Box>
              </Box>

              <VStack spacing={3}>
                <Heading size="md" color="purple.600">
                  DISCOVER K-DOMS
                </Heading>
                <Text color="gray.500" fontSize="sm" maxW="sm">
                  You haven't followed any K-Doms yet. Start exploring!
                </Text>
              </VStack>
            </VStack>
          )}

          {/* Add K-Doms button */}
          <Button
            leftIcon={<Icon as={FiHeart} />}
            variant="outline"
            colorScheme="purple"
            borderRadius="xl"
            px={6}
            w="full"
          >
            ADD K-DOMS
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}
