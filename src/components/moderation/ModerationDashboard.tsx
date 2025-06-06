// src/components/moderation/ModerationDashboard.tsx
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
} from "@chakra-ui/react";
import {
  useModerationDashboard,
  useModerationPermissions,
} from "@/hooks/useModeration";
import { PendingKDomsGrid } from "./PendingKDomsGrid";
import { RecentModerationActions } from "./RecentModerationActions";
import { ModerationStats } from "./ModerationStats";
import { AdminModerationHistory } from "./AdminModerationHistory";

export function ModerationDashboard() {
  const { canViewDashboard } = useModerationPermissions();
  const { data: dashboard, isLoading, error } = useModerationDashboard();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  if (!canViewDashboard) {
    return (
      <Alert status="error">
        <AlertIcon />
        You don't have permission to access the moderation dashboard.
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" color="purple.500" />
          <Text fontSize="lg" color="gray.600">
            Loading moderation dashboard...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (error || !dashboard) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load moderation dashboard. Please try again later.
      </Alert>
    );
  }

  const urgentCount = dashboard.pendingKDoms.filter(
    (k) => k.priority === "Urgent"
  ).length;
  const highPriorityCount = dashboard.pendingKDoms.filter(
    (k) => k.priority === "High"
  ).length;

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={1}>
              <Heading size="xl" color="purple.600">
                Moderation Dashboard
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Manage K-DOM submissions and review queue
              </Text>
            </VStack>

            {dashboard.stats.totalPending > 0 && (
              <VStack spacing={2}>
                {urgentCount > 0 && (
                  <Badge colorScheme="red" fontSize="md" px={3} py={1}>
                    {urgentCount} Urgent
                  </Badge>
                )}
                {highPriorityCount > 0 && (
                  <Badge colorScheme="orange" fontSize="md" px={3} py={1}>
                    {highPriorityCount} High Priority
                  </Badge>
                )}
                <Badge colorScheme="yellow" fontSize="md" px={3} py={1}>
                  {dashboard.stats.totalPending} Total Pending
                </Badge>
              </VStack>
            )}
          </HStack>

          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Pending Review</StatLabel>
                  <StatNumber color="orange.500">
                    {dashboard.stats.totalPending}
                  </StatNumber>
                  <StatHelpText>Awaiting moderation</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Approved Today</StatLabel>
                  <StatNumber color="green.500">
                    {dashboard.stats.totalApprovedToday}
                  </StatNumber>
                  <StatHelpText>Published today</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Rejected Today</StatLabel>
                  <StatNumber color="red.500">
                    {dashboard.stats.totalRejectedToday}
                  </StatNumber>
                  <StatHelpText>Declined today</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Avg. Processing</StatLabel>
                  <StatNumber color="blue.500">
                    {Math.round(dashboard.stats.averageProcessingTimeHours)}h
                  </StatNumber>
                  <StatHelpText>Response time</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>

        {/* Main Content */}
        <Tabs colorScheme="purple" variant="enclosed">
          <TabList>
            <Tab>
              <HStack spacing={2}>
                <Text>Pending K-DOMs</Text>
                {dashboard.stats.totalPending > 0 && (
                  <Badge colorScheme="orange" borderRadius="full">
                    {dashboard.stats.totalPending}
                  </Badge>
                )}
              </HStack>
            </Tab>
            <Tab>Recent Actions</Tab>
            <Tab>Statistics</Tab>
            <Tab>Full History</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0} py={6}>
              <PendingKDomsGrid
                pendingKDoms={dashboard.pendingKDoms}
                showBulkActions={true}
              />
            </TabPanel>

            <TabPanel px={0} py={6}>
              <RecentModerationActions
                actions={dashboard.recentActions}
                showLoadMore={true}
              />
            </TabPanel>

            <TabPanel px={0} py={6}>
              <ModerationStats stats={dashboard.stats} />
            </TabPanel>

            <TabPanel px={0} py={6}>
              <AdminModerationHistory
                limit={100}
                showFilters={true}
                showExport={true}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
}
