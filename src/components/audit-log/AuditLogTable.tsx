// src/components/audit-log/AuditLogTable.tsx - FIXED VERSION
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Avatar,
  HStack,
  VStack,
  Tooltip,
  useColorModeValue,
  Button,
  Select,
  Input,
  FormControl,
  FormLabel,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Alert,
  AlertIcon,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiUser,
  FiEye,
} from "react-icons/fi";
import { useFilteredAuditLogs, useAuditLogExport } from "@/hooks/useAuditLog";
import {
  getActionColor,
  getTargetTypeColor,
  formatAction,
  formatAuditDate,
} from "@/api/auditLog";
import type {
  AuditLogReadDto,
  AuditAction,
  AuditLogFilterDto,
} from "@/types/AuditLog";
import { AUDIT_ACTION_LABELS } from "@/types/AuditLog";

interface AuditLogTableProps {
  logs?: AuditLogReadDto[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  isLoading?: boolean;
  showFilters?: boolean;
  showExport?: boolean;
  pageSize?: number;
}

export function AuditLogTable({
  logs: propLogs,
  currentPage: propCurrentPage,
  totalPages: propTotalPages,
  onPageChange,
  onNextPage,
  onPreviousPage,
  hasNextPage: propHasNextPage,
  hasPreviousPage: propHasPreviousPage,
  isLoading: propIsLoading,
  showFilters = true,
  showExport = true,
  pageSize = 20,
}: AuditLogTableProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Local filter state
  const [localFilters, setLocalFilters] = useState<Partial<AuditLogFilterDto>>({
    action: undefined,
    userId: undefined,
    from: undefined,
    to: undefined,
    search: undefined,
  });

  // Use internal hook only if no external data provided
  const {
    data: auditData,
    isLoading: internalIsLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    goToPage: internalGoToPage,
    changePageSize,
    refetch,
  } = useFilteredAuditLogs(propLogs ? undefined : { pageSize });

  const { exportAuditLogs, isExporting } = useAuditLogExport();

  // Use external data if provided, otherwise use internal data
  const logs = propLogs || auditData?.items || [];
  const currentPage = propCurrentPage || auditData?.currentPage || 1;
  const totalPages = propTotalPages || auditData?.totalPages || 1;
  const isLoading =
    propIsLoading !== undefined ? propIsLoading : internalIsLoading;
  const hasNextPage =
    propHasNextPage !== undefined
      ? propHasNextPage
      : auditData
      ? currentPage < totalPages
      : false;
  const hasPreviousPage =
    propHasPreviousPage !== undefined ? propHasPreviousPage : currentPage > 1;

  // Handle pagination
  const handlePageChange = onPageChange || internalGoToPage;
  const handleNextPage =
    onNextPage ||
    (() => {
      if (hasNextPage) {
        handlePageChange(currentPage + 1);
      }
    });
  const handlePreviousPage =
    onPreviousPage ||
    (() => {
      if (hasPreviousPage) {
        handlePageChange(currentPage - 1);
      }
    });

  // Handle filter application
  const applyFilters = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(localFilters).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    );

    updateFilters({
      ...cleanFilters,
      page: 1, // Reset to first page
    });
  };

  const clearFilters = () => {
    setLocalFilters({
      action: undefined,
      userId: undefined,
      from: undefined,
      to: undefined,
      search: undefined,
    });
    resetFilters();
  };

  const handleExport = () => {
    exportAuditLogs(filters);
  };

  if (isLoading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="xl" thickness="4px" color="blue.500" />
        <Text fontSize="lg" color="gray.600">
          Loading audit logs...
        </Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">Failed to load audit logs</Text>
          <Text>{error.message}</Text>
          <Button
            size="sm"
            onClick={() => refetch()}
            leftIcon={<FiRefreshCw />}
          >
            Retry
          </Button>
        </VStack>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Filters */}
      {showFilters && (
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack justify="space-between">
              <HStack spacing={2}>
                <FiFilter />
                <Text fontWeight="bold">Filters</Text>
              </HStack>
              <HStack spacing={2}>
                {showExport && (
                  <Button
                    size="sm"
                    leftIcon={<FiDownload />}
                    onClick={handleExport}
                    isLoading={isExporting}
                    loadingText="Exporting..."
                  >
                    Export CSV
                  </Button>
                )}
                <Button
                  size="sm"
                  leftIcon={<FiRefreshCw />}
                  onClick={() => refetch()}
                  isLoading={isLoading}
                >
                  Refresh
                </Button>
              </HStack>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4} mb={4}>
              <FormControl>
                <FormLabel fontSize="sm">Action</FormLabel>
                <Select
                  size="sm"
                  value={localFilters.action || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      action: (e.target.value as AuditAction) || undefined,
                    }))
                  }
                  placeholder="All actions"
                >
                  {Object.entries(AUDIT_ACTION_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">User ID</FormLabel>
                <Input
                  size="sm"
                  type="number"
                  value={localFilters.userId?.toString() || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      userId: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    }))
                  }
                  placeholder="User ID"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">From Date</FormLabel>
                <Input
                  size="sm"
                  type="datetime-local"
                  value={localFilters.from || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      from: e.target.value || undefined,
                    }))
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">To Date</FormLabel>
                <Input
                  size="sm"
                  type="datetime-local"
                  value={localFilters.to || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      to: e.target.value || undefined,
                    }))
                  }
                />
              </FormControl>

              <VStack spacing={2} align="stretch">
                <Button size="sm" colorScheme="blue" onClick={applyFilters}>
                  Apply Filters
                </Button>
                <Button size="sm" variant="ghost" onClick={clearFilters}>
                  Clear All
                </Button>
              </VStack>
            </SimpleGrid>
          </CardBody>
        </Card>
      )}

      {/* Results Info */}
      <HStack justify="space-between" align="center">
        <Text fontSize="sm" color="gray.600">
          Showing {logs.length} entries
          {auditData && ` of ${auditData.totalCount || 0} total`}
          (Page {currentPage} of {totalPages})
        </Text>
        {!propLogs && (
          <Select
            size="sm"
            width="auto"
            value={filters?.pageSize || pageSize}
            onChange={(e) => changePageSize(parseInt(e.target.value))}
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </Select>
        )}
      </HStack>

      {/* Table */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardBody p={0}>
          {logs.length === 0 ? (
            <Alert status="info" m={4}>
              <AlertIcon />
              No audit logs found matching your criteria.
            </Alert>
          ) : (
            <Box overflowX="auto">
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Date & Time</Th>
                    <Th>User</Th>
                    <Th>Action</Th>
                    <Th>Target</Th>
                    <Th>Details</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {logs.map((log: AuditLogReadDto) => (
                    <Tr key={log.id} _hover={{ bg: "gray.50" }}>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="medium">
                            {formatAuditDate(log.createdAt).split(",")[0]}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {formatAuditDate(log.createdAt).split(",")[1]}
                          </Text>
                        </VStack>
                      </Td>

                      <Td>
                        <HStack spacing={2}>
                          {log.userId ? (
                            <>
                              <Avatar size="xs" name={`User ${log.userId}`} />
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="medium">
                                  User {log.userId}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  ID: {log.userId}
                                </Text>
                              </VStack>
                            </>
                          ) : (
                            <HStack spacing={2}>
                              <FiUser color="gray" size={16} />
                              <Text fontSize="sm" color="gray.500">
                                System
                              </Text>
                            </HStack>
                          )}
                        </HStack>
                      </Td>

                      <Td>
                        <Badge
                          colorScheme={getActionColor(log.action)}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {AUDIT_ACTION_LABELS[log.action] ||
                            formatAction(log.action)}
                        </Badge>
                      </Td>

                      <Td>
                        <VStack align="start" spacing={1}>
                          <Badge
                            colorScheme={getTargetTypeColor(log.targetType)}
                            variant="outline"
                            fontSize="xs"
                          >
                            {log.targetType}
                          </Badge>
                          {log.targetId && (
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              fontFamily="mono"
                            >
                              {log.targetId.length > 20
                                ? `${log.targetId.substring(0, 20)}...`
                                : log.targetId}
                            </Text>
                          )}
                        </VStack>
                      </Td>

                      <Td maxWidth="300px">
                        {log.details ? (
                          <Tooltip label={log.details} hasArrow>
                            <Text
                              fontSize="sm"
                              noOfLines={2}
                              color="gray.600"
                              cursor="help"
                            >
                              {log.details}
                            </Text>
                          </Tooltip>
                        ) : (
                          <Text
                            fontSize="sm"
                            color="gray.400"
                            fontStyle="italic"
                          >
                            No details
                          </Text>
                        )}
                      </Td>

                      <Td>
                        <IconButton
                          icon={<FiEye />}
                          size="xs"
                          variant="ghost"
                          aria-label="View details"
                          onClick={() => {
                            // Handle view details - could open modal or navigate
                            console.log("View details for log:", log.id);
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <HStack justify="center" spacing={4}>
          <Button
            size="sm"
            onClick={handlePreviousPage}
            isDisabled={!hasPreviousPage}
          >
            Previous
          </Button>

          <HStack spacing={1}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  size="sm"
                  variant={page === currentPage ? "solid" : "ghost"}
                  colorScheme={page === currentPage ? "blue" : "gray"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}
          </HStack>

          <Button size="sm" onClick={handleNextPage} isDisabled={!hasNextPage}>
            Next
          </Button>
        </HStack>
      )}
    </VStack>
  );
}
