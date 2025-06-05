// src/components/moderation/PendingKDomsGrid.tsx
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Checkbox,
  SimpleGrid,
  Alert,
  AlertIcon,
  useColorModeValue,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FiCheck,
  FiX,
  FiEye,
  FiClock,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import { useModerationActions, useBulkModeration } from "@/hooks/useModeration";
import { getPriorityColor, formatProcessingTime } from "@/api/moderation";
import type { KDomModerationDto } from "@/types/Moderation";

interface PendingKDomsGridProps {
  pendingKDoms: KDomModerationDto[];
  showBulkActions?: boolean;
}

export function PendingKDomsGrid({
  pendingKDoms,
  showBulkActions = false,
}: PendingKDomsGridProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { approveKDom, rejectKDom, isProcessing } = useModerationActions();
  const {
    selectedKDoms,
    selectKDom,
    selectAllKDoms,
    clearSelection,
    executeBulkAction,
  } = useBulkModeration();

  const {
    isOpen: isRejectModalOpen,
    onOpen: onRejectModalOpen,
    onClose: onRejectModalClose,
  } = useDisclosure();
  const {
    isOpen: isBulkModalOpen,
    onOpen: onBulkModalOpen,
    onClose: onBulkModalClose,
  } = useDisclosure();

  const [currentKDom, setCurrentKDom] = useState<KDomModerationDto | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [bulkAction, setBulkAction] = useState<"approve" | "reject">("approve");

  if (pendingKDoms.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">No K-DOMs pending review</Text>
          <Text>Great job! All submissions have been processed.</Text>
        </VStack>
      </Alert>
    );
  }

  const handleApprove = (kdom: KDomModerationDto) => {
    approveKDom(kdom.id);
  };

  const handleReject = (kdom: KDomModerationDto) => {
    setCurrentKDom(kdom);
    setRejectionReason("");
    onRejectModalOpen();
  };

  const confirmReject = () => {
    if (currentKDom && rejectionReason.trim()) {
      rejectKDom({
        kdomId: currentKDom.id,
        reason: rejectionReason.trim(),
        deleteAfterReject: true,
      });
      onRejectModalClose();
    }
  };

  const handleBulkAction = (action: "approve" | "reject") => {
    setBulkAction(action);
    if (action === "reject") {
      setRejectionReason("");
      onBulkModalOpen();
    } else {
      executeBulkAction({
        kdomIds: selectedKDoms,
        action: "approve",
      });
    }
  };

  const confirmBulkAction = () => {
    if (bulkAction === "reject" && rejectionReason.trim()) {
      executeBulkAction({
        kdomIds: selectedKDoms,
        action: "reject",
        reason: rejectionReason.trim(),
        deleteRejected: true,
      });
    }
    onBulkModalClose();
  };

  const allSelected = selectedKDoms.length === pendingKDoms.length;
  const someSelected = selectedKDoms.length > 0;

  return (
    <VStack spacing={6} align="stretch">
      {/* Bulk Actions */}
      {showBulkActions && (
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <HStack justify="space-between" align="center">
              <HStack spacing={4}>
                <Checkbox
                  isChecked={allSelected}
                  isIndeterminate={someSelected && !allSelected}
                  onChange={(e) => {
                    const kdomIds = pendingKDoms.map((k) => k.id);
                    selectAllKDoms(kdomIds, e.target.checked);
                  }}
                >
                  Select All ({pendingKDoms.length})
                </Checkbox>

                {someSelected && (
                  <Text color="gray.600">{selectedKDoms.length} selected</Text>
                )}
              </HStack>

              {someSelected && (
                <HStack spacing={2}>
                  <Button
                    colorScheme="green"
                    size="sm"
                    onClick={() => handleBulkAction("approve")}
                    isLoading={isProcessing}
                  >
                    Approve Selected
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleBulkAction("reject")}
                    isLoading={isProcessing}
                  >
                    Reject Selected
                  </Button>
                  <Button size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                </HStack>
              )}
            </HStack>
          </CardBody>
        </Card>
      )}

      {/* K-DOMs Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {pendingKDoms.map((kdom) => (
          <Card
            key={kdom.id}
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            _hover={{ shadow: "md" }}
          >
            <CardHeader pb={3}>
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  {showBulkActions && (
                    <Checkbox
                      isChecked={selectedKDoms.includes(kdom.id)}
                      onChange={(e) => selectKDom(kdom.id, e.target.checked)}
                    />
                  )}

                  <Badge
                    colorScheme={getPriorityColor(kdom.priority)}
                    fontSize="sm"
                    px={2}
                    py={1}
                  >
                    {kdom.priority} Priority
                  </Badge>

                  <Tooltip label="View K-DOM">
                    <IconButton
                      icon={<FiEye />}
                      size="sm"
                      variant="ghost"
                      aria-label="View K-DOM"
                      as="a"
                      href={`/kdoms/slug/${kdom.slug}`}
                      target="_blank"
                    />
                  </Tooltip>
                </HStack>

                <Text fontSize="lg" fontWeight="bold" noOfLines={2}>
                  {kdom.title}
                </Text>

                <Text fontSize="sm" color="gray.600" noOfLines={3}>
                  {kdom.description}
                </Text>
              </VStack>
            </CardHeader>

            <CardBody pt={0}>
              <VStack spacing={4}>
                {/* Metadata */}
                <SimpleGrid columns={2} spacing={4} w="full">
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <FiUser size={14} />
                      <Text fontSize="sm" fontWeight="medium">
                        Author
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      {kdom.authorUsername}
                    </Text>
                  </VStack>

                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <FiClock size={14} />
                      <Text fontSize="sm" fontWeight="medium">
                        Waiting
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      {formatProcessingTime(kdom.waitingTime)}
                    </Text>
                  </VStack>

                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <FiCalendar size={14} />
                      <Text fontSize="sm" fontWeight="medium">
                        Submitted
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      {new Date(kdom.createdAt).toLocaleDateString()}
                    </Text>
                  </VStack>

                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" fontWeight="medium">
                      Hub
                    </Text>
                    <Badge colorScheme="blue" fontSize="xs">
                      {kdom.hub}
                    </Badge>
                  </VStack>
                </SimpleGrid>

                {/* Parent Info */}
                {kdom.parentTitle && (
                  <Box w="full" p={3} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Sub-page of: {kdom.parentTitle}
                    </Text>
                  </Box>
                )}

                {/* Actions */}
                <HStack w="full" spacing={2}>
                  <Button
                    colorScheme="green"
                    size="sm"
                    leftIcon={<FiCheck />}
                    onClick={() => handleApprove(kdom)}
                    isLoading={isProcessing}
                    flex={1}
                  >
                    Approve
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    leftIcon={<FiX />}
                    onClick={() => handleReject(kdom)}
                    isLoading={isProcessing}
                    flex={1}
                  >
                    Reject
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Reject Modal */}
      <Modal isOpen={isRejectModalOpen} onClose={onRejectModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject K-DOM</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>
                Are you sure you want to reject "
                <strong>{currentKDom?.title}</strong>"?
              </Text>
              <FormControl isRequired>
                <FormLabel>Rejection Reason</FormLabel>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a clear reason for rejection..."
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRejectModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={confirmReject}
              isDisabled={!rejectionReason.trim()}
            >
              Reject & Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bulk Reject Modal */}
      <Modal isOpen={isBulkModalOpen} onClose={onBulkModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bulk Reject K-DOMs</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>
                Are you sure you want to reject {selectedKDoms.length} K-DOM(s)?
              </Text>
              <FormControl isRequired>
                <FormLabel>Rejection Reason</FormLabel>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a clear reason for rejection..."
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onBulkModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={confirmBulkAction}
              isDisabled={!rejectionReason.trim()}
            >
              Reject All & Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
