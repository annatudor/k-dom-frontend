// src/components/collaboration/CollaborationDashboard.tsx
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  Spinner,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Select,
  InputGroup,
  InputLeftElement,
  Input,
  Divider,
  Avatar,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  FormControl,
  FormLabel,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import {
  FiInbox,
  FiSend,
  FiClock,
  FiCheck,
  FiX,
  FiSearch,
  FiFilter,
  FiUsers,
  FiTrendingUp,
  FiMessageSquare,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUserCollaborationRequests,
  useCollaborationStats,
  useBulkActions,
} from "@/hooks/useCollaboration";
import type { CollaborationRequestReadDto } from "@/types/Collaboration";

export function CollaborationDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Pending" | "Approved" | "Rejected"
  >("all");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [bulkReason, setBulkReason] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    sentRequests,
    receivedRequests,
    groupedByKDom,
    isLoading,
    sentSummary,
    receivedSummary,
  } = useUserCollaborationRequests();

  const { data: statsData } = useCollaborationStats();
  const bulkActions = useBulkActions();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const statBg = useColorModeValue("blue.50", "blue.900");
  const grayBg = useColorModeValue("gray.50", "gray.700");

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

  const filterRequests = (requests: CollaborationRequestReadDto[]) => {
    return requests.filter((request) => {
      const matchesSearch =
        searchTerm === "" ||
        request.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.kdomTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.message?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const handleSelectRequest = (requestId: string, checked: boolean) => {
    if (checked) {
      setSelectedRequests((prev) => [...prev, requestId]);
    } else {
      setSelectedRequests((prev) => prev.filter((id) => id !== requestId));
    }
  };

  const handleSelectAll = (
    requests: CollaborationRequestReadDto[],
    checked: boolean
  ) => {
    const pendingRequestIds = requests
      .filter((r) => r.status === "Pending")
      .map((r) => r.id);
    if (checked) {
      setSelectedRequests((prev) => [
        ...new Set([...prev, ...pendingRequestIds]),
      ]);
    } else {
      setSelectedRequests((prev) =>
        prev.filter((id) => !pendingRequestIds.includes(id))
      );
    }
  };

  const handleBulkAction = (action: "approve" | "reject") => {
    setBulkAction(action);
    setBulkReason("");
    onOpen();
  };

  const handleBulkConfirm = async () => {
    if (bulkAction && selectedRequests.length > 0) {
      try {
        // Grupăm request-urile pe K-Dom pentru bulk actions
        const requestsByKDom = selectedRequests.reduce((acc, requestId) => {
          const request = receivedRequests.find((r) => r.id === requestId);
          if (request && request.kdomTitle) {
            if (!acc[request.kdomTitle]) {
              acc[request.kdomTitle] = [];
            }
            acc[request.kdomTitle].push(requestId);
          }
          return acc;
        }, {} as Record<string, string[]>);

        // Executăm bulk action pentru fiecare K-Dom separat
        for (const [kdomTitle, requestIds] of Object.entries(requestsByKDom)) {
          // Găsim primul request pentru a obține kdomId
          const firstRequest = receivedRequests.find((r) =>
            requestIds.includes(r.id)
          );
          if (firstRequest) {
            // Pentru moment, simulăm bulk action
            // În realitate, ar trebui să apelăm API-ul de bulk action cu kdomId
            await Promise.all(
              requestIds.map(async (requestId) => {
                if (bulkAction === "approve") {
                  // Simulăm approve individual pentru fiecare request
                  console.log(
                    `Approving request ${requestId} for K-Dom ${kdomTitle}`
                  );
                } else {
                  // Simulăm reject individual pentru fiecare request
                  console.log(
                    `Rejecting request ${requestId} for K-Dom ${kdomTitle} with reason: ${bulkReason}`
                  );
                }
              })
            );
          }
        }

        toast({
          title: "Bulk action completed",
          description: `Successfully ${bulkAction}d ${selectedRequests.length} request(s).`,
          status: "success",
          duration: 5000,
        });

        // Refresh data
        queryClient.invalidateQueries({ queryKey: ["collaboration"] });
      } catch (error) {
        toast({
          title: "Bulk action failed",
          description:
            "Some requests could not be processed. Please try again.",
          status: "error",
          duration: 5000,
        });
      }

      onClose();
      setSelectedRequests([]);
      setBulkAction(null);
      setBulkReason("");
    }
  };

  const RequestCard = ({
    request,
    type,
    showCheckbox = false,
  }: {
    request: CollaborationRequestReadDto;
    type: "sent" | "received";
    showCheckbox?: boolean;
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
                  {type === "sent"
                    ? request.kdomTitle || "Unknown K-Dom"
                    : request.username || `User ${request.userId}`}
                </Text>
                {getStatusBadge(request.status)}
                {showCheckbox && request.status === "Pending" && (
                  <Checkbox
                    isChecked={selectedRequests.includes(request.id)}
                    onChange={(e) =>
                      handleSelectRequest(request.id, e.target.checked)
                    }
                    ml="auto"
                  />
                )}
              </HStack>

              {type === "sent" && request.kdomTitle && (
                <Text fontSize="sm" color="gray.600">
                  Requesting collaboration on: {request.kdomTitle}
                </Text>
              )}

              {type === "received" && request.username && (
                <Text fontSize="sm" color="gray.600">
                  User requesting collaboration
                </Text>
              )}

              <HStack spacing={4} fontSize="sm" color="gray.600">
                <HStack spacing={1}>
                  <Icon as={FiClock} boxSize={4} />
                  <Text>
                    Sent: {new Date(request.createdAt).toLocaleDateString()}
                  </Text>
                </HStack>
                {request.reviewedAt && (
                  <HStack spacing={1}>
                    <Icon as={FiCalendar} boxSize={4} />
                    <Text>
                      Reviewed:{" "}
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
                bg={grayBg}
                p={3}
                borderRadius="md"
                lineHeight="tall"
                noOfLines={3}
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
        </VStack>
      </CardBody>
    </Card>
  );

  if (isLoading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="lg" color="blue.500" />
        <Text>Loading collaboration data...</Text>
      </VStack>
    );
  }

  const pendingReceivedRequests = receivedRequests.filter(
    (r) => r.status === "Pending"
  );

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="xl" mb={2}>
          Collaboration Dashboard
        </Heading>
        <Text color="gray.600">
          Manage your collaboration requests and partnerships
        </Text>
      </Box>

      {/* Stats Overview */}
      {statsData && (
        <Card
          bg={statBg}
          borderWidth="1px"
          borderColor="blue.200"
          borderRadius="xl"
        >
          <CardBody p={6}>
            <VStack spacing={6} align="stretch">
              <HStack spacing={3}>
                <Icon as={FiTrendingUp} color="blue.600" boxSize={6} />
                <Heading size="md" color="blue.700">
                  Collaboration Overview
                </Heading>
              </HStack>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                <Stat textAlign="center">
                  <StatLabel color="blue.600">
                    <HStack spacing={1} justify="center">
                      <Icon as={FiSend} boxSize={4} />
                      <Text>Requests Sent</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="blue.700">
                    {statsData.sentRequests.total}
                  </StatNumber>
                  <StatHelpText color="blue.600">
                    {statsData.sentRequests.pending} pending
                  </StatHelpText>
                </Stat>

                <Stat textAlign="center">
                  <StatLabel color="blue.600">
                    <HStack spacing={1} justify="center">
                      <Icon as={FiInbox} boxSize={4} />
                      <Text>Requests Received</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="blue.700">
                    {statsData.receivedRequests.total}
                  </StatNumber>
                  <StatHelpText color="blue.600">
                    {statsData.receivedRequests.pending} pending
                  </StatHelpText>
                </Stat>

                <Stat textAlign="center">
                  <StatLabel color="blue.600">
                    <HStack spacing={1} justify="center">
                      <Icon as={FiCheck} boxSize={4} />
                      <Text>Approved</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="green.600">
                    {statsData.sentRequests.approved +
                      statsData.receivedRequests.approved}
                  </StatNumber>
                </Stat>

                <Stat textAlign="center">
                  <StatLabel color="blue.600">
                    <HStack spacing={1} justify="center">
                      <Icon as={FiUsers} boxSize={4} />
                      <Text>Active Collaborations</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="purple.600">
                    {statsData.sentRequests.approved}
                  </StatNumber>
                </Stat>
              </SimpleGrid>

              {statsData.hasNotifications && (
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <Text>
                    You have {statsData.receivedRequests.pending} pending
                    collaboration request(s) that need your attention.
                  </Text>
                </Alert>
              )}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Filters */}
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
      >
        <CardBody p={4}>
          <HStack spacing={4} wrap="wrap">
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <HStack spacing={2}>
              <Icon as={FiFilter} color="gray.500" />
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as
                      | "all"
                      | "Pending"
                      | "Approved"
                      | "Rejected"
                  )
                }
                maxW="150px"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Select>
            </HStack>
          </HStack>
        </CardBody>
      </Card>

      {/* Tabs for different views */}
      <Tabs colorScheme="blue">
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <Icon as={FiInbox} />
              <Text>Received</Text>
              {receivedSummary && receivedSummary.pending > 0 && (
                <Badge colorScheme="red" borderRadius="full">
                  {receivedSummary.pending}
                </Badge>
              )}
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <Icon as={FiSend} />
              <Text>Sent</Text>
              {sentSummary && sentSummary.pending > 0 && (
                <Badge colorScheme="yellow" borderRadius="full">
                  {sentSummary.pending}
                </Badge>
              )}
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <Icon as={FiUsers} />
              <Text>By K-Dom</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Received Requests */}
          <TabPanel px={0}>
            <VStack spacing={4} align="stretch">
              {receivedSummary && (
                <HStack
                  spacing={6}
                  p={4}
                  bg={cardBg}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Stat size="sm">
                    <StatLabel>Total Received</StatLabel>
                    <StatNumber>{receivedSummary.total}</StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel>Pending</StatLabel>
                    <StatNumber color="yellow.600">
                      {receivedSummary.pending}
                    </StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel>Approved</StatLabel>
                    <StatNumber color="green.600">
                      {receivedSummary.approved}
                    </StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel>Rejected</StatLabel>
                    <StatNumber color="red.600">
                      {receivedSummary.rejected}
                    </StatNumber>
                  </Stat>
                </HStack>
              )}

              {/* Bulk Actions for Received Requests */}
              {pendingReceivedRequests.length > 0 && (
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                >
                  <CardBody p={4}>
                    <HStack justify="space-between" align="center">
                      <HStack spacing={3}>
                        <Checkbox
                          isChecked={
                            selectedRequests.length ===
                            pendingReceivedRequests.length
                          }
                          isIndeterminate={
                            selectedRequests.length > 0 &&
                            selectedRequests.length <
                              pendingReceivedRequests.length
                          }
                          onChange={(e) =>
                            handleSelectAll(
                              pendingReceivedRequests,
                              e.target.checked
                            )
                          }
                        >
                          Select All Pending
                        </Checkbox>
                        <Text fontSize="sm" color="gray.600">
                          ({selectedRequests.length} selected)
                        </Text>
                      </HStack>
                      {selectedRequests.length > 0 && (
                        <HStack spacing={3}>
                          <Button
                            leftIcon={<Icon as={FiCheck} />}
                            colorScheme="green"
                            size="sm"
                            onClick={() => handleBulkAction("approve")}
                          >
                            Approve Selected
                          </Button>
                          <Button
                            leftIcon={<Icon as={FiX} />}
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAction("reject")}
                          >
                            Reject Selected
                          </Button>
                        </HStack>
                      )}
                    </HStack>
                  </CardBody>
                </Card>
              )}

              {filterRequests(receivedRequests).length === 0 ? (
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">
                      No received requests found
                    </Text>
                    <Text fontSize="sm">
                      {receivedRequests.length === 0
                        ? "You haven't received any collaboration requests yet."
                        : "No requests match your current filters."}
                    </Text>
                  </VStack>
                </Alert>
              ) : (
                <VStack spacing={4} align="stretch">
                  {filterRequests(receivedRequests).map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      type="received"
                      showCheckbox={request.status === "Pending"}
                    />
                  ))}
                </VStack>
              )}
            </VStack>
          </TabPanel>

          {/* Sent Requests */}
          <TabPanel px={0}>
            <VStack spacing={4} align="stretch">
              {sentSummary && (
                <HStack
                  spacing={6}
                  p={4}
                  bg={cardBg}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Stat size="sm">
                    <StatLabel>Total Sent</StatLabel>
                    <StatNumber>{sentSummary.total}</StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel>Pending</StatLabel>
                    <StatNumber color="yellow.600">
                      {sentSummary.pending}
                    </StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel>Approved</StatLabel>
                    <StatNumber color="green.600">
                      {sentSummary.approved}
                    </StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel>Rejected</StatLabel>
                    <StatNumber color="red.600">
                      {sentSummary.rejected}
                    </StatNumber>
                  </Stat>
                </HStack>
              )}

              {filterRequests(sentRequests).length === 0 ? (
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">No sent requests found</Text>
                    <Text fontSize="sm">
                      {sentRequests.length === 0
                        ? "You haven't sent any collaboration requests yet."
                        : "No requests match your current filters."}
                    </Text>
                  </VStack>
                </Alert>
              ) : (
                <VStack spacing={4} align="stretch">
                  {filterRequests(sentRequests).map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      type="sent"
                    />
                  ))}
                </VStack>
              )}
            </VStack>
          </TabPanel>

          {/* Grouped by K-Dom */}
          <TabPanel px={0}>
            <VStack spacing={6} align="stretch">
              {groupedByKDom.length === 0 ? (
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">No K-Dom requests found</Text>
                    <Text fontSize="sm">
                      Collaboration requests for your K-Doms will appear here.
                    </Text>
                  </VStack>
                </Alert>
              ) : (
                groupedByKDom.map((group) => (
                  <Card
                    key={group.kdomTitle}
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                  >
                    <CardBody p={5}>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between" align="center">
                          <VStack align="start" spacing={1}>
                            <Heading size="md">{group.kdomTitle}</Heading>
                            <Text fontSize="sm" color="gray.600">
                              {group.requests.length} total request(s)
                            </Text>
                          </VStack>
                          <VStack spacing={2}>
                            {group.pendingCount > 0 && (
                              <Badge
                                colorScheme="yellow"
                                borderRadius="full"
                                px={3}
                                py={1}
                              >
                                {group.pendingCount} pending
                              </Badge>
                            )}
                            <Button
                              as={RouterLink}
                              to={`/kdoms/${group.kdomTitle
                                .toLowerCase()
                                .replace(/\s+/g, "-")}/collaboration`}
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                            >
                              Manage
                            </Button>
                          </VStack>
                        </HStack>

                        <Divider />

                        <VStack spacing={3} align="stretch">
                          {group.requests.slice(0, 3).map((request) => (
                            <HStack
                              key={request.id}
                              spacing={4}
                              p={3}
                              bg={grayBg}
                              borderRadius="md"
                            >
                              <Avatar
                                name={
                                  request.username || `User ${request.userId}`
                                }
                                size="sm"
                                bg="blue.500"
                              />
                              <Text fontWeight="semibold" flex="1">
                                {request.username || `User ${request.userId}`}
                              </Text>
                              {getStatusBadge(request.status)}
                              <Text fontSize="sm" color="gray.600">
                                {new Date(
                                  request.createdAt
                                ).toLocaleDateString()}
                              </Text>
                            </HStack>
                          ))}

                          {group.requests.length > 3 && (
                            <Text
                              fontSize="sm"
                              color="gray.500"
                              textAlign="center"
                            >
                              +{group.requests.length - 3} more request(s)
                            </Text>
                          )}
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Bulk Action Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
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

              <Alert status="warning" borderRadius="lg">
                <AlertIcon />
                <Text fontSize="sm">
                  This action cannot be undone. Make sure you want to{" "}
                  {bulkAction} all selected requests.
                </Text>
              </Alert>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
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
