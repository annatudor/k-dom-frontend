// src/components/audit-log/AuditLogDashboard.tsx - MISSING COMPONENT
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiBarChart2,
  FiList,
  FiClock,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import { useAuditStats, useAuditPermissions } from "@/hooks/useAuditLog";
import { AuditLogTable } from "./AuditLogTable";
import { AuditLogStats } from "./AuditLogStats";
import { AuditLogTimeline } from "./AuditLogTimeline";

export function AuditLogDashboard() {
  const { canViewAuditLogs } = useAuditPermissions();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useAuditStats();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  if (!canViewAuditLogs) {
    return (
      <Alert status="error">
        <AlertIcon />
        You don't have permission to access audit logs.
      </Alert>
    );
  }

  if (statsLoading) {
    return (
      <Box py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" color="blue.500" />
          <Text fontSize="lg" color="gray.600">
            Loading audit dashboard...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (statsError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load audit dashboard. Please try again later.
      </Alert>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={1}>
              <Heading size="xl" color="blue.600">
                Audit Dashboard
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Monitor system activities and user actions
              </Text>
            </VStack>

            <HStack spacing={2}>
              <Tooltip label="Export audit logs">
                <IconButton
                  icon={<FiDownload />}
                  variant="outline"
                  size="sm"
                  aria-label="Export logs"
                  onClick={() => {
                    // Implementation would go here
                    console.log("Export audit logs");
                  }}
                />
              </Tooltip>
              <Tooltip label="Refresh dashboard">
                <IconButton
                  icon={<FiRefreshCw />}
                  variant="outline"
                  size="sm"
                  aria-label="Refresh"
                  onClick={() => {
                    window.location.reload();
                  }}
                />
              </Tooltip>
            </HStack>
          </HStack>

          {/* Quick Stats */}
          {stats && (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Total Activities</StatLabel>
                    <StatNumber color="blue.500">
                      {stats.totalLogs.toLocaleString()}
                    </StatNumber>
                    <StatHelpText>All time</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Today</StatLabel>
                    <StatNumber color="green.500">
                      {stats.todayCount}
                    </StatNumber>
                    <StatHelpText>Activities logged</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>This Week</StatLabel>
                    <StatNumber color="purple.500">
                      {stats.weekCount}
                    </StatNumber>
                    <StatHelpText>Weekly activity</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Security Events</StatLabel>
                    <StatNumber
                      color={
                        stats.securityEvents > 50
                          ? "red.500"
                          : stats.securityEvents > 20
                          ? "orange.500"
                          : "green.500"
                      }
                    >
                      {stats.securityEvents}
                    </StatNumber>
                    <StatHelpText>
                      {stats.failedLogins} failed logins
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>
          )}

          {/* Security Alert */}
          {stats && stats.failedLogins > 20 && (
            <Alert
              status={stats.failedLogins > 50 ? "error" : "warning"}
              borderRadius="md"
              mb={6}
            >
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">
                  {stats.failedLogins > 50 ? "High" : "Medium"} Security
                  Activity Detected
                </Text>
                <Text fontSize="sm">
                  {stats.failedLogins} failed login attempts detected.
                  {stats.failedLogins > 50 &&
                    " Immediate attention recommended."}
                </Text>
              </VStack>
            </Alert>
          )}
        </Box>

        {/* Main Content */}
        <Tabs colorScheme="blue" variant="enclosed">
          <TabList>
            <Tab>
              <HStack spacing={2}>
                <FiList />
                <Text>Recent Logs</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <FiClock />
                <Text>Timeline</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <FiBarChart2 />
                <Text>Statistics</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <FiActivity />
                <Text>Real-time</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Recent Logs Tab */}
            <TabPanel px={0} py={6}>
              <Card bg={cardBg}>
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="lg" fontWeight="bold">
                        Recent Audit Logs
                      </Text>
                      <Badge colorScheme="blue" variant="subtle">
                        Last 100 entries
                      </Badge>
                    </HStack>
                    <AuditLogTable
                      showFilters={true}
                      showExport={true}
                      pageSize={25}
                    />
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Timeline Tab */}
            <TabPanel px={0} py={6}>
              <Card bg={cardBg}>
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="lg" fontWeight="bold">
                        Activity Timeline
                      </Text>
                      <Badge colorScheme="purple" variant="subtle">
                        Chronological view
                      </Badge>
                    </HStack>
                    <AuditLogTimeline
                      maxItems={50}
                      showUserAvatars={true}
                      groupByDay={true}
                    />
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Statistics Tab */}
            <TabPanel px={0} py={6}>
              <AuditLogStats stats={stats} />
            </TabPanel>

            {/* Real-time Tab */}
            <TabPanel px={0} py={6}>
              <Card bg={cardBg}>
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="lg" fontWeight="bold">
                        Real-time Monitoring
                      </Text>
                      <HStack spacing={2}>
                        <Badge colorScheme="green" variant="solid">
                          LIVE
                        </Badge>
                        <Text fontSize="sm" color="gray.600">
                          Updates every 30s
                        </Text>
                      </HStack>
                    </HStack>

                    {/* Real-time Stats */}
                    <SimpleGrid
                      columns={{ base: 1, md: 3 }}
                      spacing={4}
                      w="full"
                    >
                      <Card variant="outline">
                        <CardBody>
                          <Stat>
                            <StatLabel>Active Sessions</StatLabel>
                            <StatNumber color="green.500">
                              {stats?.topUsers?.length || 0}
                            </StatNumber>
                            <StatHelpText>Users online</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>

                      <Card variant="outline">
                        <CardBody>
                          <Stat>
                            <StatLabel>Actions/Min</StatLabel>
                            <StatNumber color="blue.500">
                              {Math.round((stats?.todayCount || 0) / (24 * 60))}
                            </StatNumber>
                            <StatHelpText>Average rate</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>

                      <Card variant="outline">
                        <CardBody>
                          <Stat>
                            <StatLabel>System Health</StatLabel>
                            <StatNumber
                              color={
                                (stats?.failedLogins || 0) > 50
                                  ? "red.500"
                                  : (stats?.failedLogins || 0) > 20
                                  ? "orange.500"
                                  : "green.500"
                              }
                            >
                              {(stats?.failedLogins || 0) > 50
                                ? "CRITICAL"
                                : (stats?.failedLogins || 0) > 20
                                ? "WARNING"
                                : "HEALTHY"}
                            </StatNumber>
                            <StatHelpText>Security status</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </SimpleGrid>

                    {/* Recent Activity Stream */}
                    <Box w="full">
                      <Text fontSize="md" fontWeight="bold" mb={4}>
                        Live Activity Stream
                      </Text>
                      <AuditLogTimeline
                        maxItems={10}
                        showUserAvatars={true}
                        groupByDay={false}
                        filters={{
                          from: new Date(
                            Date.now() - 60 * 60 * 1000
                          ).toISOString(), // Last hour
                        }}
                      />
                    </Box>

                    {/* Auto-refresh Notice */}
                    <Alert status="info" size="sm">
                      <AlertIcon />
                      <Text fontSize="sm">
                        This view automatically refreshes every 30 seconds to
                        show real-time system activity. Use the refresh button
                        to manually update data.
                      </Text>
                    </Alert>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Footer Info */}
        <Card bg={cardBg}>
          <CardBody>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="bold">
                  Audit System Status
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {stats?.lastActivity
                    ? `Last activity: ${new Date(
                        stats.lastActivity
                      ).toLocaleString()}`
                    : "No recent activity"}
                </Text>
              </VStack>
              <HStack spacing={4}>
                <Badge colorScheme="green" variant="subtle">
                  OPERATIONAL
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<FiActivity />}
                  onClick={() => {
                    // Implementation for system health check
                    console.log("Check system health");
                  }}
                >
                  System Health
                </Button>
              </HStack>
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
