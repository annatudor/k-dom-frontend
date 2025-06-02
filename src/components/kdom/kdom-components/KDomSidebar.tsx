// src/components/kdom/kdom-components/KDomSidebar.tsx - Versiunea actualizată
import {
  VStack,
  Heading,
  Text,
  Link,
  HStack,
  Icon,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
} from "@chakra-ui/react";
import {
  FiArrowUp,
  FiArrowRight,
  FiUsers,
  FiClock,
  FiBookOpen,
  FiGitBranch,
  FiExternalLink,
  FiSettings,
  FiPlus,
  FiHeart,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";

import { getParentKDom, getChildKDoms, getRelatedKDoms } from "@/api/kdom";
import { useAuth } from "@/context/AuthContext";

// ✅ INTERFAȚA ACTUALIZATĂ cu followersCount
interface KDomSidebarProps {
  kdomId: string;
  kdomSlug: string;
  kdomUserId?: number;
  followersCount?: number; // ← ADĂUGAT
}

export function KDomSidebar({
  kdomId,
  kdomSlug,
  kdomUserId,
  followersCount = 0, // ← ADĂUGAT cu valoare default
}: KDomSidebarProps) {
  const { user } = useAuth();
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("white", "gray.700");

  // Check if user can edit this K-Dom
  const canEdit =
    user &&
    (user.id === kdomUserId ||
      user.role === "admin" ||
      user.role === "moderator");

  // Query pentru pagina părinte
  const { data: parentKdom } = useQuery({
    queryKey: ["kdom-parent", kdomId],
    queryFn: () => getParentKDom(kdomId),
    retry: false,
  });

  // Query pentru sub-pagini
  const { data: childKdoms = [] } = useQuery({
    queryKey: ["kdom-children", kdomId],
    queryFn: () => getChildKDoms(kdomId),
  });

  // Query pentru pagini înrudite
  const { data: relatedKdoms = [] } = useQuery({
    queryKey: ["kdom-related", kdomId],
    queryFn: () => getRelatedKDoms(kdomId),
  });

  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* ✅ STATISTICI ACTUALIZATE cu followersCount */}
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="md"
        overflow="hidden"
      >
        <CardHeader pb={3}>
          <HStack spacing={3}>
            <Icon as={FiUsers} color="blue.500" boxSize={5} />
            <Heading size="md" color="blue.600" fontWeight="bold">
              Statistics
            </Heading>
          </HStack>
        </CardHeader>
        <CardBody pt={3}>
          <VStack align="start" spacing={4}>
            {/* ✅ FOLLOWERS COUNT ACTUALIZAT */}
            <HStack justify="space-between" w="full">
              <HStack spacing={2}>
                <Icon as={FiHeart} boxSize={4} color="red.500" />
                <Text fontSize="md" color="gray.600" fontWeight="medium">
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
                <Icon as={FiClock} boxSize={4} color="green.500" />
                <Text fontSize="md" color="gray.600" fontWeight="medium">
                  Last activity
                </Text>
              </HStack>
              <Text fontSize="md" fontWeight="bold" color="green.600">
                Today
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Pagina Părinte */}
      {parentKdom && (
        <Card
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="md"
          overflow="hidden"
        >
          <CardHeader pb={3}>
            <HStack spacing={3}>
              <Icon as={FiArrowUp} color="green.500" boxSize={5} />
              <Heading size="md" color="green.600" fontWeight="bold">
                Parent Page
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody pt={3}>
            <Link
              as={RouterLink}
              to={`/kdom/${parentKdom.slug}`}
              color="blue.500"
              fontWeight="semibold"
              fontSize="md"
              _hover={{
                textDecoration: "none",
                color: "blue.600",
                bg: "blue.50",
                px: 3,
                py: 2,
                borderRadius: "md",
                ml: -3,
              }}
              transition="all 0.2s"
              display="block"
            >
              {parentKdom.title}
            </Link>
          </CardBody>
        </Card>
      )}

      {/* Sub-pagini */}
      {(childKdoms.length > 0 || canEdit) && (
        <Card
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="md"
          overflow="hidden"
        >
          <CardHeader pb={3}>
            <HStack justify="space-between" w="full">
              <HStack spacing={3}>
                <Icon as={FiArrowRight} color="purple.500" boxSize={5} />
                <Heading size="md" color="purple.600" fontWeight="bold">
                  Sub-pages
                </Heading>
              </HStack>
              <HStack spacing={2}>
                {childKdoms.length > 0 && (
                  <Badge
                    colorScheme="purple"
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    {childKdoms.length}
                  </Badge>
                )}
                {canEdit && (
                  <Button
                    as={RouterLink}
                    to={`/kdoms/${kdomSlug}/create-sub`}
                    size="xs"
                    colorScheme="green"
                    leftIcon={<Icon as={FiPlus} />}
                    borderRadius="full"
                  >
                    Add
                  </Button>
                )}
              </HStack>
            </HStack>
          </CardHeader>
          <CardBody pt={3}>
            <VStack align="start" spacing={3}>
              {childKdoms.length > 0 ? (
                <>
                  {childKdoms.slice(0, 5).map((child) => (
                    <Link
                      key={child.id}
                      as={RouterLink}
                      to={`/kdoms/${child.slug}`}
                      color="blue.500"
                      fontSize="md"
                      fontWeight="semibold"
                      _hover={{
                        textDecoration: "none",
                        color: "blue.600",
                        bg: "blue.50",
                        px: 3,
                        py: 2,
                        borderRadius: "md",
                        ml: -3,
                      }}
                      transition="all 0.2s"
                      display="block"
                      w="full"
                    >
                      {child.title}
                    </Link>
                  ))}
                  {childKdoms.length > 5 && (
                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                      +{childKdoms.length - 5} more pages
                    </Text>
                  )}
                </>
              ) : canEdit ? (
                <VStack spacing={2} align="start" w="full">
                  <Text fontSize="sm" color="gray.500">
                    No sub-pages yet
                  </Text>
                  <Button
                    as={RouterLink}
                    to={`/kdoms/${kdomSlug}/create-sub`}
                    size="sm"
                    colorScheme="green"
                    leftIcon={<Icon as={FiPlus} />}
                    variant="outline"
                  >
                    Create First Sub-page
                  </Button>
                </VStack>
              ) : (
                <Text fontSize="sm" color="gray.500">
                  No sub-pages available
                </Text>
              )}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Pagini Înrudite */}
      {relatedKdoms.length > 0 && (
        <Card
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="md"
          overflow="hidden"
        >
          <CardHeader pb={3}>
            <HStack spacing={3}>
              <Icon as={FiGitBranch} color="orange.500" boxSize={5} />
              <Heading size="md" color="orange.600" fontWeight="bold">
                Related Pages
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody pt={3}>
            <VStack align="start" spacing={3}>
              {relatedKdoms.slice(0, 4).map((related) => (
                <Link
                  key={related.id}
                  as={RouterLink}
                  to={`/kdom/${related.slug}`}
                  color="blue.500"
                  fontSize="md"
                  fontWeight="semibold"
                  _hover={{
                    textDecoration: "none",
                    color: "blue.600",
                    bg: "blue.50",
                    px: 3,
                    py: 2,
                    borderRadius: "md",
                    ml: -3,
                  }}
                  transition="all 0.2s"
                  display="block"
                  w="full"
                >
                  {related.title}
                </Link>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Quick Actions */}
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="md"
        overflow="hidden"
      >
        <CardHeader pb={3}>
          <HStack spacing={3}>
            <Icon as={FiBookOpen} color="teal.500" boxSize={5} />
            <Heading size="md" color="teal.600" fontWeight="bold">
              Quick Actions
            </Heading>
          </HStack>
        </CardHeader>
        <CardBody pt={3}>
          <VStack align="start" spacing={3}>
            <Button
              as={RouterLink}
              to={`/kdoms/${kdomSlug}/history`}
              variant="ghost"
              size="md"
              leftIcon={<Icon as={FiClock} />}
              justifyContent="flex-start"
              w="full"
              color="gray.600"
              fontWeight="semibold"
              _hover={{ bg: "gray.100", color: "gray.800" }}
              px={3}
              py={2}
            >
              View History
            </Button>

            {canEdit && (
              <Button
                as={RouterLink}
                to={`/kdom/${kdomSlug}/metadata`}
                variant="ghost"
                size="md"
                leftIcon={<Icon as={FiSettings} />}
                justifyContent="flex-start"
                w="full"
                color="gray.600"
                fontWeight="semibold"
                _hover={{ bg: "gray.100", color: "gray.800" }}
                px={3}
                py={2}
              >
                Edit Settings
              </Button>
            )}

            <Button
              as={RouterLink}
              to={`/kdom/${kdomSlug}/contributors`}
              variant="ghost"
              size="md"
              leftIcon={<Icon as={FiUsers} />}
              justifyContent="flex-start"
              w="full"
              color="gray.600"
              fontWeight="semibold"
              _hover={{ bg: "gray.100", color: "gray.800" }}
              px={3}
              py={2}
            >
              Contributors
            </Button>
            <Button
              as="a"
              href="#comments"
              variant="ghost"
              size="md"
              leftIcon={<Icon as={FiExternalLink} />}
              justifyContent="flex-start"
              w="full"
              color="gray.600"
              fontWeight="semibold"
              _hover={{ bg: "gray.100", color: "gray.800" }}
              px={3}
              py={2}
            >
              Jump to Comments
            </Button>
          </VStack>
        </CardBody>
      </Card>

      {/* Info Box */}
      <Card
        bg="blue.50"
        borderWidth="2px"
        borderColor="blue.200"
        borderRadius="xl"
        textAlign="center"
        overflow="hidden"
        boxShadow="md"
      >
        <CardBody py={6}>
          <VStack spacing={4}>
            <Icon as={FiBookOpen} color="blue.500" fontSize="3xl" />
            <Text fontSize="md" fontWeight="bold" color="blue.700">
              Help improve this K-Dom
            </Text>
            <Text fontSize="sm" color="blue.600" lineHeight="tall">
              Add content, fix errors, or suggest improvements to make this page
              better for everyone
            </Text>
            {canEdit ? (
              <Button
                as={RouterLink}
                to={`/kdom/${kdomSlug}/edit`}
                colorScheme="blue"
                size="sm"
                variant="solid"
                borderRadius="full"
                px={6}
              >
                Edit Content
              </Button>
            ) : (
              <Button
                colorScheme="blue"
                size="sm"
                variant="solid"
                borderRadius="full"
                px={6}
                isDisabled
              >
                Contribute
              </Button>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
