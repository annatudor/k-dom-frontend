// src/components/moderation/AdminModerationHistory.tsx
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiClock,
  FiCheck,
  FiX,
} from "react-icons/fi";
import {
  useRecentModerationActions,
  useTopModerators,
} from "@/hooks/useModeration";
import {
  formatProcessingTime,
  getModerationStatusColor,
} from "@/api/moderation";
import type { ModerationDecision } from "@/types/Moderation";

interface AdminModerationHistoryProps {
  limit?: number;
  showFilters?: boolean;
  showExport?: boolean;
}

export function AdminModerationHistory({
  limit = 50,
  showFilters = true,
  showExport = true,
}: AdminModerationHistoryProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [filterDecision, setFilterDecision] = useState<ModerationDecision | "">(
    ""
  );
  const [filterModerator, setFilterModerator] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: actions,
    isLoading,
    error,
    refetch,
  } = useRecentModerationActions(limit);
  const { data: topModerators } = useTopModerators(30, 10);

  if (isLoading) {
    return (
      <VStack spacing={4}>
        <Spinner size="xl" thickness="4px" color="purple.500" />
        <Text fontSize="lg" color="gray.600">
          Loading moderation history...
        </Text>
      </VStack>
    );
  }

  if (error || !actions) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load moderation history. Please try again later.
      </Alert>
    );
  }

  // Filter actions based on search and filters
  const filteredActions = actions.filter((action) => {
    const matchesDecision =
      !filterDecision || action.decision === filterDecision;
    const matchesModerator =
      !filterModerator ||
      action.moderatorUsername
        .toLowerCase()
        .includes(filterModerator.toLowerCase());
    const matchesSearch =
      !searchTerm ||
      action.kdomTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.authorUsername.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDecision && matchesModerator && matchesSearch;
  });

  // Calculate stats from filtered actions
  const approvedCount = filteredActions.filter(
    (a) => a.decision === "Approved"
  ).length;
  const rejectedCount = filteredActions.filter(
    (a) => a.decision === "Rejected"
  ).length;
  const totalProcessed = filteredActions.length;
  const approvalRate =
    totalProcessed > 0 ? (approvedCount / totalProcessed) * 100 : 0;

  const exportHistory = () => {
    const csvContent = [
      [
        "Date",
        "K-DOM",
        "Author",
        "Moderator",
        "Decision",
        "Processing Time",
        "Reason",
      ].join(","),
      ...filteredActions.map((action) =>
        [
          new Date(action.actionDate).toLocaleDateString(),
          `"${action.kdomTitle}"`,
          action.authorUsername,
          action.moderatorUsername,
          action.decision,
          formatProcessingTime(action.processingTime),
          `"${action.reason || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `moderation-history-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Total Actions</StatLabel>
              <StatNumber color="blue.500">{totalProcessed}</StatNumber>
              <StatHelpText>In current view</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Approval Rate</StatLabel>
              <StatNumber color="green.500">
                {approvalRate.toFixed(1)}%
              </StatNumber>
              <StatHelpText>{approvedCount} approved</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Rejected</StatLabel>
              <StatNumber color="red.500">{rejectedCount}</StatNumber>
              <StatHelpText>K-DOMs declined</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Active Moderators</StatLabel>
              <StatNumber color="purple.500">
                {topModerators?.length || 0}
              </StatNumber>
              <StatHelpText>Last 30 days</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      {showFilters && (
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack justify="space-between">
              <HStack spacing={2}>
                <FiFilter />
                <Text fontWeight="bold">Filters</Text>
              </HStack>

              {showExport && (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<FiDownload />}
                  onClick={exportHistory}
                  isDisabled={filteredActions.length === 0}
                >
                  Export CSV
                </Button>
              )}
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">Search K-DOM or Author</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <FiSearch color="gray" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="sm"
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Decision</FormLabel>
                <Select
                  value={filterDecision}
                  onChange={(e) =>
                    setFilterDecision(e.target.value as ModerationDecision | "")
                  }
                  size="sm"
                >
                  <option value="">All Decisions</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Moderator</FormLabel>
                <Input
                  placeholder="Moderator username..."
                  value={filterModerator}
                  onChange={(e) => setFilterModerator(e.target.value)}
                  size="sm"
                />
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>
      )}

      {/* History Table */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardHeader>
          <HStack justify="space-between">
            <Text fontWeight="bold">Moderation History</Text>
            <Text fontSize="sm" color="gray.600">
              Showing {filteredActions.length} of {actions.length} actions
            </Text>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          {filteredActions.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">No actions found</Text>
                <Text>
                  {actions.length === 0
                    ? "No moderation actions have been performed yet."
                    : "No actions match your current filters."}
                </Text>
              </VStack>
            </Alert>
          ) : (
            <Box overflowX="auto">
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>K-DOM</Th>
                    <Th>Author</Th>
                    <Th>Moderator</Th>
                    <Th>Decision</Th>
                    <Th>Processing Time</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredActions.map((action) => (
                    <Tr key={action.id}>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm">
                            {new Date(action.actionDate).toLocaleDateString()}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(action.actionDate).toLocaleTimeString()}
                          </Text>
                        </VStack>
                      </Td>

                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            noOfLines={1}
                            maxW="200px"
                          >
                            {action.kdomTitle}
                          </Text>
                          {action.reason && action.decision === "Rejected" && (
                            <Text
                              fontSize="xs"
                              color="red.600"
                              noOfLines={2}
                              maxW="200px"
                            >
                              Reason: {action.reason}
                            </Text>
                          )}
                        </VStack>
                      </Td>

                      <Td>
                        <Text fontSize="sm">{action.authorUsername}</Text>
                      </Td>

                      <Td>
                        <HStack spacing={2}>
                          <Avatar size="xs" name={action.moderatorUsername} />
                          <Text fontSize="sm">{action.moderatorUsername}</Text>
                        </HStack>
                      </Td>

                      <Td>
                        <HStack spacing={2}>
                          {action.decision === "Approved" ? (
                            <FiCheck color="green" size={14} />
                          ) : (
                            <FiX color="red" size={14} />
                          )}
                          <Badge
                            colorScheme={getModerationStatusColor(
                              action.decision
                            )}
                            fontSize="xs"
                          >
                            {action.decision}
                          </Badge>
                        </HStack>
                      </Td>

                      <Td>
                        <HStack spacing={1}>
                          <FiClock size={12} />
                          <Text fontSize="sm">
                            {formatProcessingTime(action.processingTime)}
                          </Text>
                        </HStack>
                      </Td>

                      <Td>
                        <Button
                          size="xs"
                          variant="ghost"
                          leftIcon={<FiEye />}
                          as="a"
                          href={`/kdoms/${action.kdomId}`}
                          target="_blank"
                        >
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Load More */}
      {actions.length >= limit && (
        <Box textAlign="center">
          <Button
            variant="outline"
            onClick={() => refetch()}
            isLoading={isLoading}
          >
            Load More Actions
          </Button>
        </Box>
      )}
    </VStack>
  );
}
