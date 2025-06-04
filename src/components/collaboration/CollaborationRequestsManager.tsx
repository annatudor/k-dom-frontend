// src/components/collaboration/CollaborationRequestsManager.tsx
import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Card,
  CardBody,
  Heading,
  Textarea,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Spinner,
  Icon,
  Divider,
  useColorModeValue,
  Checkbox,
} from "@chakra-ui/react";
import { FiCheck, FiX, FiUser, FiClock, FiMessageSquare } from "react-icons/fi";
import {
  useCollaborationRequests,
  useBulkActions,
} from "@/hooks/useCollaboration";
import type { CollaborationRequestReadDto } from "@/types/Collaboration";

interface CollaborationRequestsManagerProps {
  kdomId: string;
  kdomTitle: string;
}

export function CollaborationRequestsManager({
  kdomId,
  kdomTitle,
}: CollaborationRequestsManagerProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [requestToReject, setRequestToReject] = useState<string | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [bulkReason, setBulkReason] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isBulkOpen,
    onOpen: onBulkOpen,
    onClose: onBulkClose,
  } = useDisclosure();

  const {
    requests,
    isLoading,
    approveRequest,
    rejectRequest,
    isApproving,
    isRejecting,
  } = useCollaborationRequests(kdomId);

  const bulkActions = useBulkActions();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const pendingRequests = requests.filter((r) => r.status === "Pending");
  const reviewedRequests = requests.filter((r) => r.status !== "Pending");

  const handleApprove = (requestId: string) => {
    approveRequest({ requestId });
  };

  const handleRejectClick = (requestId: string) => {
    setRequestToReject(requestId);
    setRejectionReason("");
    onOpen();
  };

  const handleRejectConfirm = () => {
    if (requestToReject && rejectionReason.trim()) {
      rejectRequest({
        requestId: requestToReject,
        data: { rejectionReason: rejectionReason.trim() },
      });
      onClose();
      setRequestToReject(null);
      setRejectionReason("");
    }
  };

  const handleSelectRequest = (requestId: string, checked: boolean) => {
    if (checked) {
      setSelectedRequests((prev) => [...prev, requestId]);
    } else {
      setSelectedRequests((prev) => prev.filter((id) => id !== requestId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(pendingRequests.map((r) => r.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleBulkAction = (action: "approve" | "reject") => {
    setBulkAction(action);
    setBulkReason("");
    onBulkOpen();
  };

  const handleBulkConfirm = async () => {
    if (bulkAction && selectedRequests.length > 0) {
      try {
        await bulkActions.executeAction({
          action: bulkAction,
          requestIds: selectedRequests,
          reason: bulkAction === "reject" ? bulkReason.trim() : undefined,
        });

        onBulkClose();
        setSelectedRequests([]);
        setBulkAction(null);
        setBulkReason("");
      } catch (error) {
        console.error("Bulk action failed:", error);
      }
    }
  };

  const getStatusBadge = (status: CollaborationRequestReadDto["status"]) => {
    switch (status) {
      case "Pending":
        return <Badge colorScheme="yellow">Pending</Badge>;
      case "Approved":
        return <Badge colorScheme="green">Approved</Badge>;
      case "Rejected":
        return <Badge colorScheme="red">Rejected</Badge>;
      default:
        return <Badge colorScheme="gray">Unknown</Badge>;
    }
  };

  const RequestCard = ({
    request,
  }: {
    request: CollaborationRequestReadDto;
  }) => (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      transition="all 0.2s"
    >
      <CardBody p={5}>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={2} flex="1">
              <HStack spacing={3}>
                <Icon as={FiUser} color="blue.500" boxSize={5} />
                <Text fontWeight="bold" fontSize="lg">
                  {request.username || `User ${request.userId}`}
                </Text>
                {getStatusBadge(request.status)}
                {request.status === "Pending" && (
                  <Checkbox
                    isChecked={selectedRequests.includes(request.id)}
                    onChange={(e) =>
                      handleSelectRequest(request.id, e.target.checked)
                    }
                    ml="auto"
                  />
                )}
              </HStack>

              <HStack spacing={4} fontSize="sm" color="gray.600">
                <HStack spacing={1}>
                  <Icon as={FiClock} boxSize={4} />
                  <Text>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </Text>
                </HStack>
                {request.reviewedAt && (
                  <HStack spacing={1}>
                    <Text>Reviewed:</Text>
                    <Text>
                      {new Date(request.reviewedAt).toLocaleDateString()}
                    </Text>
                  </HStack>
                )}
              </HStack>
            </VStack>
          </HStack>

          {request.message && (
            <Box>
              <HStack spacing={2} mb={2}>
                <Icon as={FiMessageSquare} color="gray.500" boxSize={4} />
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                  Message:
                </Text>
              </HStack>
              <Text
                fontSize="sm"
                color="gray.600"
                p={3}
                borderRadius="md"
                lineHeight="tall"
              >
                {request.message}
              </Text>
            </Box>
          )}

          {request.rejectionReason && (
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="red.600" mb={2}>
                Rejection Reason:
              </Text>
              <Text
                fontSize="sm"
                color="red.600"
                bg="red.50"
                p={3}
                borderRadius="md"
                lineHeight="tall"
              >
                {request.rejectionReason}
              </Text>
            </Box>
          )}

          {request.status === "Pending" && (
            <HStack spacing={3} justify="flex-end">
              <Button
                leftIcon={<Icon as={FiCheck} />}
                colorScheme="green"
                size="sm"
                onClick={() => handleApprove(request.id)}
                isLoading={isApproving}
              >
                Approve
              </Button>
              <Button
                leftIcon={<Icon as={FiX} />}
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={() => handleRejectClick(request.id)}
                isLoading={isRejecting}
              >
                Reject
              </Button>
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );

  if (isLoading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="lg" color="blue.500" />
        <Text>Loading collaboration requests...</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" mb={2}>
          Collaboration Requests
        </Heading>
        <Text color="gray.600">
          Manage collaboration requests for "{kdomTitle}"
        </Text>
      </Box>

      {requests.length === 0 ? (
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold">No collaboration requests yet</Text>
            <Text fontSize="sm">
              When users request to collaborate on your K-Dom, they'll appear
              here.
            </Text>
          </VStack>
        </Alert>
      ) : (
        <>
          {/* Pending Requests Section */}
          {pendingRequests.length > 0 && (
            <Box>
              <HStack justify="space-between" align="center" mb={4}>
                <Heading size="md" color="orange.600">
                  Pending Requests ({pendingRequests.length})
                </Heading>
                <HStack spacing={3}>
                  <Checkbox
                    isChecked={
                      selectedRequests.length === pendingRequests.length
                    }
                    isIndeterminate={
                      selectedRequests.length > 0 &&
                      selectedRequests.length < pendingRequests.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  >
                    Select All
                  </Checkbox>
                  {selectedRequests.length > 0 && (
                    <>
                      <Button
                        leftIcon={<Icon as={FiCheck} />}
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleBulkAction("approve")}
                      >
                        Approve Selected ({selectedRequests.length})
                      </Button>
                      <Button
                        leftIcon={<Icon as={FiX} />}
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction("reject")}
                      >
                        Reject Selected ({selectedRequests.length})
                      </Button>
                    </>
                  )}
                </HStack>
              </HStack>

              <VStack spacing={4} align="stretch">
                {pendingRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </VStack>
            </Box>
          )}

          {/* Reviewed Requests Section */}
          {reviewedRequests.length > 0 && (
            <Box>
              {pendingRequests.length > 0 && <Divider my={6} />}
              <Heading size="md" color="gray.600" mb={4}>
                Reviewed Requests ({reviewedRequests.length})
              </Heading>
              <VStack spacing={4} align="stretch">
                {reviewedRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </VStack>
            </Box>
          )}
        </>
      )}

      {/* Reject Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Collaboration Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>
                Please provide a reason for rejecting this collaboration
                request. This will help the user understand your decision.
              </Text>
              <FormControl isRequired>
                <FormLabel>Rejection Reason</FormLabel>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why you're rejecting this request..."
                  rows={4}
                  maxLength={500}
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {rejectionReason.length}/500
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleRejectConfirm}
              isDisabled={!rejectionReason.trim()}
              isLoading={isRejecting}
            >
              Reject Request
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bulk Action Modal */}
      <Modal isOpen={isBulkOpen} onClose={onBulkClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {bulkAction === "approve" ? "Approve" : "Reject"} Multiple Requests
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>
                You are about to {bulkAction} {selectedRequests.length}{" "}
                collaboration request(s).
              </Text>

              {bulkAction === "reject" && (
                <FormControl isRequired>
                  <FormLabel>
                    Rejection Reason (for all selected requests)
                  </FormLabel>
                  <Textarea
                    value={bulkReason}
                    onChange={(e) => setBulkReason(e.target.value)}
                    placeholder="Explain why you're rejecting these requests..."
                    rows={4}
                    maxLength={500}
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {bulkReason.length}/500
                  </Text>
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onBulkClose}>
              Cancel
            </Button>
            <Button
              colorScheme={bulkAction === "approve" ? "green" : "red"}
              onClick={handleBulkConfirm}
              isDisabled={bulkAction === "reject" && !bulkReason.trim()}
              isLoading={bulkActions.isPending}
            >
              {bulkAction === "approve" ? "Approve" : "Reject"}{" "}
              {selectedRequests.length} Request(s)
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
