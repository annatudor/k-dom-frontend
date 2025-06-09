// src/components/audit-log/AuditLogStats.tsx - FIXED VERSION
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Badge,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiUsers,
  FiShield,
  FiAlertTriangle,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";
import { useAuditStats } from "@/hooks/useAuditLog";
import { getActionColor } from "@/api/auditLog";
import { AUDIT_ACTION_LABELS } from "@/types/AuditLog";
import type { AuditStatsDto } from "@/types/AuditLog";

interface AuditLogStatsProps {
  stats?: AuditStatsDto;
}

export function AuditLogStats({ stats: propStats }: AuditLogStatsProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { data: fetchedStats, isLoading, error } = useAuditStats();

  const stats = propStats || fetchedStats;

  if (isLoading && !propStats) {
    return (
      <VStack spacing={4}>
        <Spinner size="xl" thickness="4px" color="purple.500" />
        <Text fontSize="lg" color="gray.600">
          Loading audit statistics...
        </Text>
      </VStack>
    );
  }

  if (error && !propStats) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load audit statistics. Please try again later.
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert status="info">
        <AlertIcon />
        No statistics available.
      </Alert>
    );
  }

  // Calculate additional metrics
  const weeklyGrowth =
    stats.weekCount > 0
      ? ((stats.todayCount * 7 - stats.weekCount) / stats.weekCount) * 100
      : 0;

  const securityAlertLevel =
    stats.failedLogins > 50
      ? "high"
      : stats.failedLogins > 20
      ? "medium"
      : "low";

  return (
    <VStack spacing={6} align="stretch">
      {/* Overview Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack spacing={2}>
                  <FiActivity />
                  <Text>Total Logs</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="blue.500">
                {stats.totalLogs.toLocaleString()}
              </StatNumber>
              <StatHelpText>All time activities</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack spacing={2}>
                  <FiClock />
                  <Text>Today</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="green.500">{stats.todayCount}</StatNumber>
              <StatHelpText>
                {weeklyGrowth >= 0 ? "+" : ""}
                {weeklyGrowth.toFixed(1)}% from avg
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack spacing={2}>
                  <FiTrendingUp />
                  <Text>This Week</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="purple.500">{stats.weekCount}</StatNumber>
              <StatHelpText>Weekly activity</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack spacing={2}>
                  <FiAlertTriangle />
                  <Text>Security Events</Text>
                </HStack>
              </StatLabel>
              <StatNumber
                color={
                  securityAlertLevel === "high"
                    ? "red.500"
                    : securityAlertLevel === "medium"
                    ? "orange.500"
                    : "green.500"
                }
              >
                {stats.securityEvents}
              </StatNumber>
              <StatHelpText>{stats.failedLogins} failed logins</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Security Alert */}
      {securityAlertLevel !== "low" && (
        <Alert
          status={securityAlertLevel === "high" ? "error" : "warning"}
          borderRadius="md"
        >
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">
              {securityAlertLevel === "high" ? "High" : "Medium"} Security
              Activity Detected
            </Text>
            <Text fontSize="sm">
              {stats.failedLogins} failed login attempts detected.
              {securityAlertLevel === "high" &&
                " Immediate attention recommended."}
            </Text>
          </VStack>
        </Alert>
      )}

      {/* Detailed Analytics */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Top Actions */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold">
              Most Common Actions
            </Text>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              {stats.topActions.slice(0, 5).map((actionStat, index) => (
                <Box key={actionStat.action}>
                  <HStack justify="space-between" mb={2}>
                    <HStack spacing={2}>
                      <Badge
                        colorScheme={getActionColor(actionStat.action)}
                        variant="subtle"
                      >
                        #{index + 1}
                      </Badge>
                      <Text fontSize="sm" fontWeight="medium">
                        {AUDIT_ACTION_LABELS[actionStat.action] ||
                          actionStat.action}
                      </Text>
                    </HStack>
                    <VStack align="end" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold">
                        {actionStat.count.toLocaleString()}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {actionStat.percentage.toFixed(1)}%
                      </Text>
                    </VStack>
                  </HStack>
                  <Progress
                    value={actionStat.percentage}
                    size="sm"
                    colorScheme={getActionColor(actionStat.action)}
                  />
                  {index < stats.topActions.slice(0, 5).length - 1 && (
                    <Divider mt={4} />
                  )}
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Top Users */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold">
              Most Active Users
            </Text>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              {stats.topUsers.slice(0, 5).map((userStat, index) => (
                <Box key={userStat.userId}>
                  <HStack justify="space-between">
                    <HStack spacing={3}>
                      <Badge
                        colorScheme="blue"
                        variant="subtle"
                        borderRadius="full"
                      >
                        #{index + 1}
                      </Badge>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {userStat.username || `User ${userStat.userId}`}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          ID: {userStat.userId}
                        </Text>
                      </VStack>
                    </HStack>
                    <VStack align="end" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold" color="blue.600">
                        {userStat.actionCount}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        actions
                      </Text>
                    </VStack>
                  </HStack>
                  {index < stats.topUsers.slice(0, 5).length - 1 && (
                    <Divider mt={4} />
                  )}
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* System Health */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardHeader>
          <Text fontSize="lg" fontWeight="bold">
            System Health Overview
          </Text>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <VStack align="center" spacing={3}>
              <Box
                p={4}
                borderRadius="full"
                bg={
                  securityAlertLevel === "low"
                    ? "green.100"
                    : securityAlertLevel === "medium"
                    ? "orange.100"
                    : "red.100"
                }
              >
                <FiShield
                  size={24}
                  color={
                    securityAlertLevel === "low"
                      ? "green"
                      : securityAlertLevel === "medium"
                      ? "orange"
                      : "red"
                  }
                />
              </Box>
              <Text fontSize="sm" fontWeight="bold" textAlign="center">
                Security Status
              </Text>
              <Badge
                colorScheme={
                  securityAlertLevel === "low"
                    ? "green"
                    : securityAlertLevel === "medium"
                    ? "orange"
                    : "red"
                }
                fontSize="sm"
                px={3}
                py={1}
              >
                {securityAlertLevel.toUpperCase()}
              </Badge>
            </VStack>

            <VStack align="center" spacing={3}>
              <Box p={4} borderRadius="full" bg="blue.100">
                <FiActivity size={24} color="blue" />
              </Box>
              <Text fontSize="sm" fontWeight="bold" textAlign="center">
                Activity Level
              </Text>
              <Badge
                colorScheme={
                  stats.todayCount > 100
                    ? "green"
                    : stats.todayCount > 50
                    ? "yellow"
                    : "gray"
                }
                fontSize="sm"
                px={3}
                py={1}
              >
                {stats.todayCount > 100
                  ? "HIGH"
                  : stats.todayCount > 50
                  ? "NORMAL"
                  : "LOW"}
              </Badge>
            </VStack>

            <VStack align="center" spacing={3}>
              <Box p={4} borderRadius="full" bg="purple.100">
                <FiUsers size={24} color="purple" />
              </Box>
              <Text fontSize="sm" fontWeight="bold" textAlign="center">
                Active Users
              </Text>
              <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                {stats.topUsers.length} USERS
              </Badge>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Last Activity */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardBody>
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" fontWeight="bold">
                Last System Activity
              </Text>
              <Text fontSize="sm" color="gray.600">
                {stats.lastActivity
                  ? new Date(stats.lastActivity).toLocaleString()
                  : "No recent activity"}
              </Text>
            </VStack>
            <Badge colorScheme="green" variant="subtle">
              ACTIVE
            </Badge>
          </HStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
