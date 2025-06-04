// src/components/kdom/kdom-components/KDomSidebar.tsx - Actualizat cu permissions
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
  FiClock,
  FiBookOpen,
  FiGitBranch,
  FiExternalLink,
  FiSettings,
  FiPlus,
  FiUsers,
  FiUserPlus,
  FiEdit3,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";

import { getParentKDom, getChildKDoms, getRelatedKDoms } from "@/api/kdom";
import { useAuth } from "@/context/AuthContext";
import { CollaborationButton } from "@/components/collaboration/CollaborationButton";
import type { KDomPermissions } from "@/hooks/useKDomPermissions";

interface KDomSidebarProps {
  kdomId: string;
  kdomSlug: string;
  kdomUserId?: number;
  kdomTitle: string;
  kdomCollaborators?: number[];
  followersCount?: number;
  permissions: KDomPermissions; // ✅ PRIMIM PERMISIUNILE CA PROP
}

export function KDomSidebar({
  kdomId,
  kdomSlug,
  kdomUserId,
  kdomTitle,
  kdomCollaborators = [],
  permissions,
}: KDomSidebarProps) {
  const { user } = useAuth();
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("white", "gray.700");

  // ✅ EXTRAGEM PERMISIUNILE DIN PROP
  const {
    canEdit,
    canEditMetadata,
    canCreateSubPages,
    canManageCollaborators,
    canViewEditHistory,
    role,
  } = permissions;

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
      {/*  1. PARENT K-DOM (Navigation up) */}
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
              to={`/kdoms/slug/${parentKdom.slug}`}
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

      {/* 2. SUB-PAGES (Children navigation) */}
      {(childKdoms.length > 0 || canCreateSubPages) && (
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
                {/* FOLOSIM canCreateSubPages */}
                {canCreateSubPages && (
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
                      to={`/kdoms/slug/${child.slug}`}
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
              ) : canCreateSubPages ? (
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

      {/* ✅ 3. RELATED PAGES (Siblings) */}
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
                  to={`/kdoms/slug/${related.slug}`}
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

      {/* ✅ 4. QUICK ACTIONS */}
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
            {/* ✅ FOLOSIM canViewEditHistory */}
            {canViewEditHistory && (
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
            )}

            {/* ✅ FOLOSIM canEditMetadata */}
            {canEditMetadata && (
              <Button
                as={RouterLink}
                to={`/kdoms/${kdomSlug}/metadata`}
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
              to={`/kdoms/${kdomSlug}/contributors`}
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

      {/* ✅ 5. CONTRIBUTE BOX - ACTUALIZAT CU PERMISIUNI */}
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
              {role === "owner"
                ? "Manage your K-Dom"
                : role === "collaborator"
                ? "Continue collaborating"
                : "Help improve this K-Dom"}
            </Text>
            <Text fontSize="sm" color="blue.600" lineHeight="tall">
              {role === "owner"
                ? "Manage collaborators, edit content, and configure settings for your K-Dom"
                : role === "collaborator"
                ? "Edit content, create sub-pages, and help maintain this K-Dom"
                : "Add content, fix errors, or suggest improvements to make this page better for everyone"}
            </Text>

            {/* ✅ STATUS INDICATOR CU PERMISIUNI */}
            <HStack spacing={3} flexWrap="wrap" justify="center">
              {role === "owner" && (
                <Badge
                  colorScheme="gold"
                  borderRadius="full"
                  px={4}
                  py={2}
                  fontSize="sm"
                  fontWeight="bold"
                >
                  K-Dom Owner
                </Badge>
              )}
              {role === "collaborator" && (
                <Badge
                  colorScheme="purple"
                  borderRadius="full"
                  px={4}
                  py={2}
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Collaborator
                </Badge>
              )}
              {(role === "admin" || role === "moderator") && (
                <Badge
                  colorScheme={role === "admin" ? "red" : "blue"}
                  borderRadius="full"
                  px={4}
                  py={2}
                  fontSize="sm"
                  fontWeight="bold"
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
              )}
            </HStack>

            {/* ✅ ACTION BUTTONS CU PERMISIUNI */}
            <VStack spacing={3} w="full">
              {canEdit ? (
                <Button
                  as={RouterLink}
                  to={`/kdoms/${kdomSlug}/edit`}
                  colorScheme="blue"
                  size="md"
                  borderRadius="full"
                  px={6}
                  leftIcon={<Icon as={FiEdit3} />}
                  w="full"
                >
                  Edit Content
                </Button>
              ) : (
                /* COLLABORATION BUTTON - PENTRU NON-EDITORI */
                <CollaborationButton
                  kdomId={kdomId}
                  kdomTitle={kdomTitle}
                  kdomUserId={kdomUserId || 0}
                  kdomCollaborators={kdomCollaborators}
                  variant="button"
                  size="md"
                  colorScheme="purple"
                />
              )}

              {/* ✅ COLLABORATION MANAGEMENT pentru owner */}
              {canManageCollaborators && (
                <Button
                  as={RouterLink}
                  to={`/kdoms/${kdomSlug}/collaboration`}
                  variant="outline"
                  colorScheme="purple"
                  size="sm"
                  borderRadius="full"
                  px={6}
                  leftIcon={<Icon as={FiUserPlus} />}
                  w="full"
                >
                  Manage Collaborators
                </Button>
              )}

              {/* ✅ COLLABORATION INFO pentru colaboratori */}
              {role === "collaborator" && (
                <Button
                  as={RouterLink}
                  to={`/kdoms/${kdomSlug}/collaborators`}
                  variant="outline"
                  colorScheme="blue"
                  size="sm"
                  borderRadius="full"
                  px={6}
                  leftIcon={<Icon as={FiUsers} />}
                  w="full"
                >
                  View Collaborators
                </Button>
              )}

              {/* ✅ ADVANCED SETTINGS pentru owner */}
              {canEditMetadata && (
                <Button
                  as={RouterLink}
                  to={`/kdoms/${kdomSlug}/metadata`}
                  variant="outline"
                  colorScheme="gray"
                  size="sm"
                  borderRadius="full"
                  px={6}
                  leftIcon={<Icon as={FiSettings} />}
                  w="full"
                >
                  Advanced Settings
                </Button>
              )}
            </VStack>

            {/* ✅ COLLABORATION STATS PREVIEW */}
            {kdomCollaborators.length > 0 && (
              <VStack spacing={2} pt={2}>
                <HStack spacing={2}>
                  <Icon as={FiUsers} color="purple.500" boxSize={4} />
                  <Text fontSize="sm" color="purple.600" fontWeight="semibold">
                    {kdomCollaborators.length} collaborator
                    {kdomCollaborators.length !== 1 ? "s" : ""}
                  </Text>
                </HStack>
                <Text fontSize="xs" color="purple.500">
                  This K-Dom is collaboratively maintained
                </Text>
              </VStack>
            )}

            {/* ✅ PERMISSIONS SUMMARY pentru debugging (doar în development) */}
            {import.meta.env.DEV && user && (
              <VStack spacing={2} pt={4} borderTop="1px" borderColor="blue.200">
                <Text fontSize="xs" color="blue.500" fontWeight="bold">
                  Debug: Permissions ({role})
                </Text>
                <HStack spacing={2} flexWrap="wrap" justify="center">
                  {canEdit && (
                    <Badge size="xs" colorScheme="green">
                      Edit
                    </Badge>
                  )}
                  {canEditMetadata && (
                    <Badge size="xs" colorScheme="blue">
                      Metadata
                    </Badge>
                  )}
                  {canCreateSubPages && (
                    <Badge size="xs" colorScheme="purple">
                      SubPages
                    </Badge>
                  )}
                  {canManageCollaborators && (
                    <Badge size="xs" colorScheme="orange">
                      Manage
                    </Badge>
                  )}
                  {canViewEditHistory && (
                    <Badge size="xs" colorScheme="teal">
                      History
                    </Badge>
                  )}
                </HStack>
              </VStack>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
