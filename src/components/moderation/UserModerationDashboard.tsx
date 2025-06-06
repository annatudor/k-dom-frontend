// src/components/moderation/UserModerationDashboard.tsx
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
  Progress,
} from "@chakra-ui/react";
import { FiClock, FiCheck, FiX, FiInfo } from "react-icons/fi";
import {
  useMyQuickStats,
  useMyPendingKDoms,
  useMyRejectedKDoms,
  useUserKDomStatuses,
} from "@/hooks/useModeration";
import { UserKDomStatusList } from "./UserKDomStatusList";
import { UserModerationHistory } from "./UserModerationHistory";

export function UserModerationDashboard() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const {
    data: quickStats,
    isLoading: statsLoading,
    error: statsError,
  } = useMyQuickStats();
  const { data: allStatuses, isLoading: allStatusesLoading } =
    useUserKDomStatuses();
  const { data: pendingKDoms, isLoading: pendingLoading } = useMyPendingKDoms();
  const { data: rejectedKDoms, isLoading: rejectedLoading } =
    useMyRejectedKDoms();

  if (statsLoading) {
    return (
      <Box py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" color="purple.500" />
          <Text fontSize="lg" color="gray.600">
            Loading your submission status...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (statsError || !quickStats) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load your moderation status. Please try again later.
      </Alert>
    );
  }

  const hasSubmissions = quickStats.totalSubmitted > 0;
  const hasNotifications = quickStats.hasNotifications;

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <VStack align="start" spacing={2} mb={6}>
            <HStack justify="space-between" w="full">
              <Heading size="xl" color="purple.600">
                Your K-DOM Submissions
              </Heading>
              {hasNotifications && (
                <Badge colorScheme="orange" fontSize="md" px={3} py={1}>
                  Action Required
                </Badge>
              )}
            </HStack>
            <Text fontSize="lg" color="gray.600">
              Track the status of your K-DOM submissions and moderation feedback
            </Text>
          </VStack>

          {!hasSubmissions ? (
            <Alert status="info">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">No K-DOM submissions yet</Text>
                <Text>
                  Once you create your first K-DOM, you'll be able to track its
                  moderation status here.
                </Text>
                <Button
                  colorScheme="purple"
                  size="sm"
                  mt={2}
                  as="a"
                  href="/start-kdom"
                >
                  Create Your First K-DOM
                </Button>
              </VStack>
            </Alert>
          ) : (
            <>
              {/* Quick Stats */}
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
                <Card bg={cardBg}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Total Submitted</StatLabel>
                      <StatNumber color="blue.500">
                        {quickStats.totalSubmitted}
                      </StatNumber>
                      <StatHelpText>K-DOMs created</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Pending Review</StatLabel>
                      <StatNumber color="orange.500">
                        {quickStats.pending}
                      </StatNumber>
                      <StatHelpText>Awaiting moderation</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Approved</StatLabel>
                      <StatNumber color="green.500">
                        {quickStats.approved}
                      </StatNumber>
                      <StatHelpText>Live K-DOMs</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Rejected</StatLabel>
                      <StatNumber color="red.500">
                        {quickStats.rejected}
                      </StatNumber>
                      <StatHelpText>Need attention</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Approval Rate */}
              {quickStats.totalSubmitted > 0 && (
                <Card bg={cardBg} mb={6}>
                  <CardBody>
                    <VStack spacing={4}>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="lg" fontWeight="bold">
                          Your Approval Rate
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="green.500">
                          {quickStats.approvalRate.toFixed(1)}%
                        </Text>
                      </HStack>

                      <Progress
                        value={quickStats.approvalRate}
                        colorScheme={
                          quickStats.approvalRate >= 80
                            ? "green"
                            : quickStats.approvalRate >= 60
                            ? "yellow"
                            : "red"
                        }
                        size="lg"
                        w="full"
                      />

                      <HStack
                        justify="space-between"
                        w="full"
                        fontSize="sm"
                        color="gray.600"
                      >
                        <Text>
                          {quickStats.approved} approved out of{" "}
                          {quickStats.totalSubmitted} submitted
                        </Text>
                        {quickStats.averageProcessingTime > 0 && (
                          <Text>
                            Avg. processing:{" "}
                            {Math.round(quickStats.averageProcessingTime)}h
                          </Text>
                        )}
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              )}

              {/* Main Content Tabs */}
              <Tabs colorScheme="purple" variant="enclosed">
                <TabList>
                  <Tab>
                    <HStack spacing={2}>
                      <FiInfo />
                      <Text>All Submissions</Text>
                      {quickStats.totalSubmitted > 0 && (
                        <Badge colorScheme="blue" borderRadius="full">
                          {quickStats.totalSubmitted}
                        </Badge>
                      )}
                    </HStack>
                  </Tab>

                  <Tab>
                    <HStack spacing={2}>
                      <FiClock />
                      <Text>Pending</Text>
                      {quickStats.pending > 0 && (
                        <Badge colorScheme="orange" borderRadius="full">
                          {quickStats.pending}
                        </Badge>
                      )}
                    </HStack>
                  </Tab>

                  <Tab>
                    <HStack spacing={2}>
                      <FiCheck />
                      <Text>Approved</Text>
                      {quickStats.approved > 0 && (
                        <Badge colorScheme="green" borderRadius="full">
                          {quickStats.approved}
                        </Badge>
                      )}
                    </HStack>
                  </Tab>

                  <Tab>
                    <HStack spacing={2}>
                      <FiX />
                      <Text>Rejected</Text>
                      {quickStats.rejected > 0 && (
                        <Badge colorScheme="red" borderRadius="full">
                          {quickStats.rejected}
                        </Badge>
                      )}
                    </HStack>
                  </Tab>

                  <Tab>
                    <HStack spacing={2}>
                      <Text>📊</Text>
                      <Text>History & Stats</Text>
                    </HStack>
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0} py={6}>
                    <UserKDomStatusList
                      statuses={allStatuses || []}
                      isLoading={allStatusesLoading}
                      emptyMessage="No K-DOM submissions found"
                      showAllInfo={true}
                    />
                  </TabPanel>

                  <TabPanel px={0} py={6}>
                    <UserKDomStatusList
                      statuses={pendingKDoms || []}
                      isLoading={pendingLoading}
                      emptyMessage="No pending K-DOMs. All your submissions have been processed!"
                    />
                  </TabPanel>

                  <TabPanel px={0} py={6}>
                    <UserKDomStatusList
                      statuses={
                        allStatuses?.filter((s) => s.status === "Approved") ||
                        []
                      }
                      isLoading={allStatusesLoading}
                      emptyMessage="No approved K-DOMs yet. Keep creating quality content!"
                    />
                  </TabPanel>

                  <TabPanel px={0} py={6}>
                    <UserKDomStatusList
                      statuses={rejectedKDoms || []}
                      isLoading={rejectedLoading}
                      emptyMessage="No rejected K-DOMs. Great job maintaining high quality!"
                      showRejectionReasons={true}
                    />
                  </TabPanel>

                  <TabPanel px={0} py={6}>
                    <UserModerationHistory />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
