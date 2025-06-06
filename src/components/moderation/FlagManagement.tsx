// src/components/admin/flags/FlagManagement.tsx
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FiCheck,
  FiX,
  FiTrash2,
  FiUser,
  FiCalendar,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  useFlags,
  useFlagStats,
  useFlagActions,
  useFlagPermissions,
} from "@/hooks/useFlags";
import {
  getFlagStatusColor,
  formatFlagDate,
  getContentTypeLabel,
  truncateText,
} from "@/api/flag";
import type { FlagReadDto } from "@/types/Flag";

export function FlagManagement() {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { data: flagsData, isLoading, error } = useFlags();
  const { data: statsData } = useFlagStats();
  const { resolveFlag, removeContent, deleteFlag, isProcessing } =
    useFlagActions();
  const permissions = useFlagPermissions();

  const {
    isOpen: isRemoveModalOpen,
    onOpen: onRemoveModalOpen,
    onClose: onRemoveModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const [selectedFlag, setSelectedFlag] = useState<FlagReadDto | null>(null);
  const [removalReason, setRemovalReason] = useState("");

  if (!permissions.canViewFlags) {
    return (
      <Alert status="error">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">Access Denied</Text>
          <Text>You don't have permission to view flag management.</Text>
        </VStack>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <VStack spacing={4}>
        <Spinner size="xl" thickness="4px" color="red.500" />
        <Text fontSize="lg" color="gray.600">
          Loading flags...
        </Text>
      </VStack>
    );
  }

  if (error || !flagsData) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load flags. Please try again later.
      </Alert>
    );
  }

  const handleResolve = (flag: FlagReadDto) => {
    resolveFlag(flag.id);
  };

  const handleRemoveContent = (flag: FlagReadDto) => {
    setSelectedFlag(flag);
    setRemovalReason("");
    onRemoveModalOpen();
  };

  const handleDeleteFlag = (flag: FlagReadDto) => {
    setSelectedFlag(flag);
    onDeleteModalOpen();
  };

  const confirmRemoveContent = () => {
    if (selectedFlag && removalReason.trim()) {
      removeContent({
        id: selectedFlag.id,
        data: { reason: removalReason.trim() },
      });
      onRemoveModalClose();
    }
  };

  const confirmDeleteFlag = () => {
    if (selectedFlag) {
      deleteFlag(selectedFlag.id);
      onDeleteModalClose();
    }
  };

  const FlagCard = ({ flag }: { flag: FlagReadDto }) => (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      _hover={{ shadow: "md" }}
    >
      <CardHeader pb={3}>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <Badge
              colorScheme={getFlagStatusColor(flag.isResolved)}
              fontSize="sm"
              px={2}
              py={1}
            >
              {flag.isResolved ? "Resolved" : "Pending"}
            </Badge>
            <Badge colorScheme="blue" fontSize="sm">
              {getContentTypeLabel(flag.contentType)}
            </Badge>
          </HStack>

          <VStack align="start" spacing={2}>
            <HStack spacing={2}>
              <FiUser size={14} />
              <Text fontSize="sm" fontWeight="medium">
                Reported by: {flag.reporterUsername}
              </Text>
            </HStack>
            <HStack spacing={2}>
              <FiCalendar size={14} />
              <Text fontSize="sm" color="gray.600">
                {formatFlagDate(flag.createdAt)}
              </Text>
            </HStack>
          </VStack>

          <Box p={3} bg="gray.50" borderRadius="md">
            <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
              Reason:
            </Text>
            <Text fontSize="sm" color="gray.600">
              {truncateText(flag.reason, 150)}
            </Text>
          </Box>
        </VStack>
      </CardHeader>

      <CardBody pt={0}>
        <VStack spacing={4}>
          {/* Content Info */}
          {flag.content && flag.contentExists ? (
            <Box
              w="full"
              p={3}
              bg="blue.50"
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="blue.400"
            >
              <VStack align="start" spacing={2}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" fontWeight="bold" color="blue.700">
                    Flagged Content
                  </Text>
                  <Text fontSize="xs" color="blue.600">
                    by {flag.content.authorUsername}
                  </Text>
                </HStack>

                {flag.content.title && (
                  <Text fontSize="sm" fontWeight="medium">
                    {truncateText(flag.content.title, 80)}
                  </Text>
                )}

                <Text fontSize="sm" color="gray.600">
                  {truncateText(flag.content.text, 120)}
                </Text>

                {flag.content.parentInfo && (
                  <Text fontSize="xs" color="gray.500">
                    {flag.content.parentInfo}
                  </Text>
                )}
              </VStack>
            </Box>
          ) : (
            <Alert status="warning" size="sm">
              <AlertIcon />
              <Text fontSize="sm">Content no longer exists</Text>
            </Alert>
          )}

          {/* Actions */}
          {!flag.isResolved && (
            <HStack w="full" spacing={2}>
              {permissions.canResolveFlags && (
                <Tooltip label="Mark as resolved (content is OK)">
                  <Button
                    colorScheme="green"
                    size="sm"
                    leftIcon={<FiCheck />}
                    onClick={() => handleResolve(flag)}
                    isLoading={isProcessing}
                    flex={1}
                  >
                    Resolve
                  </Button>
                </Tooltip>
              )}

              {permissions.canRemoveContent && flag.contentExists && (
                <Tooltip label="Remove flagged content">
                  <Button
                    colorScheme="red"
                    size="sm"
                    leftIcon={<FiX />}
                    onClick={() => handleRemoveContent(flag)}
                    isLoading={isProcessing}
                    flex={1}
                  >
                    Remove Content
                  </Button>
                </Tooltip>
              )}

              {permissions.canDeleteFlags && (
                <Tooltip label="Delete flag">
                  <IconButton
                    icon={<FiTrash2 />}
                    size="sm"
                    variant="ghost"
                    colorScheme="gray"
                    aria-label="Delete flag"
                    onClick={() => handleDeleteFlag(flag)}
                    isLoading={isProcessing}
                  />
                </Tooltip>
              )}
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <VStack spacing={6} align="stretch">
      {/* Stats Overview */}
      {statsData && (
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Pending Flags</StatLabel>
                <StatNumber color="orange.500">
                  {statsData.totalPending}
                </StatNumber>
                <StatHelpText>Need attention</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Today's Reports</StatLabel>
                <StatNumber color="blue.500">{statsData.totalToday}</StatNumber>
                <StatHelpText>New reports</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Total Reports</StatLabel>
                <StatNumber color="purple.500">
                  {statsData.totalAllTime}
                </StatNumber>
                <StatHelpText>All time</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Priority</StatLabel>
                <StatNumber
                  color={statsData.requiresAttention ? "red.500" : "green.500"}
                >
                  {statsData.requiresAttention ? "High" : "Normal"}
                </StatNumber>
                <StatHelpText>
                  {statsData.requiresAttention
                    ? "Needs attention"
                    : "Under control"}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      {/* Priority Alert */}
      {flagsData.summary.totalPending > 0 && (
        <Alert status="warning">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">
              {flagsData.summary.totalPending} pending flag(s) require attention
            </Text>
            <Text fontSize="sm">
              Review these reports to maintain community standards and user
              experience.
            </Text>
          </VStack>
        </Alert>
      )}

      {/* Flags Tabs */}
      <Tabs colorScheme="red" variant="enclosed">
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <FiAlertTriangle />
              <Text>Pending</Text>
              {flagsData.summary.totalPending > 0 && (
                <Badge colorScheme="orange" borderRadius="full">
                  {flagsData.summary.totalPending}
                </Badge>
              )}
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <FiCheck />
              <Text>Resolved</Text>
              {flagsData.summary.totalResolved > 0 && (
                <Badge colorScheme="green" borderRadius="full">
                  {flagsData.summary.totalResolved}
                </Badge>
              )}
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Pending Flags */}
          <TabPanel px={0} py={6}>
            {flagsData.pending.length === 0 ? (
              <Alert status="success">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">No pending flags</Text>
                  <Text>Great job! All reports have been reviewed.</Text>
                </VStack>
              </Alert>
            ) : (
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {flagsData.pending.map((flag) => (
                  <FlagCard key={flag.id} flag={flag} />
                ))}
              </SimpleGrid>
            )}
          </TabPanel>

          {/* Resolved Flags */}
          <TabPanel px={0} py={6}>
            {flagsData.resolved.length === 0 ? (
              <Alert status="info">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">No resolved flags</Text>
                  <Text>Resolved flags will appear here.</Text>
                </VStack>
              </Alert>
            ) : (
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {flagsData.resolved.map((flag) => (
                  <FlagCard key={flag.id} flag={flag} />
                ))}
              </SimpleGrid>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Remove Content Modal */}
      <Modal isOpen={isRemoveModalOpen} onClose={onRemoveModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove Flagged Content</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="warning">
                <AlertIcon />
                <Text fontSize="sm">
                  This action will permanently remove the flagged content and
                  notify the author.
                </Text>
              </Alert>

              {selectedFlag?.content && (
                <Box w="full" p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Content to be removed:
                  </Text>
                  <Text fontSize="sm">
                    {truncateText(
                      selectedFlag.content.title || selectedFlag.content.text,
                      200
                    )}
                  </Text>
                </Box>
              )}

              <FormControl isRequired>
                <FormLabel>Removal Reason</FormLabel>
                <Textarea
                  value={removalReason}
                  onChange={(e) => setRemovalReason(e.target.value)}
                  placeholder="Please provide a clear reason for content removal..."
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRemoveModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={confirmRemoveContent}
              isDisabled={!removalReason.trim()}
              isLoading={isProcessing}
            >
              Remove Content
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Flag Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Flag</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="error">
                <AlertIcon />
                <Text fontSize="sm">
                  This action will permanently delete the flag from the system.
                </Text>
              </Alert>

              <Text>
                Are you sure you want to delete this flag? This action cannot be
                undone.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={confirmDeleteFlag}
              isLoading={isProcessing}
            >
              Delete Flag
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
