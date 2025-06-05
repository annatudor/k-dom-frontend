// src/components/moderation/ModerationStats.tsx
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { useModerationStats, useTopModerators } from "@/hooks/useModeration";
import type { ModerationStatsDto } from "@/types/Moderation";

interface ModerationStatsProps {
  stats?: ModerationStatsDto;
  showTopModerators?: boolean;
}

export function ModerationStats({
  stats: propStats,
  showTopModerators = true,
}: ModerationStatsProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { data: fetchedStats, isLoading: statsLoading } = useModerationStats();
  const { data: topModerators, isLoading: moderatorsLoading } =
    useTopModerators(30, 5);

  const stats = propStats || fetchedStats;

  if (statsLoading && !propStats) {
    return (
      <VStack spacing={4}>
        <Text>Loading moderation statistics...</Text>
      </VStack>
    );
  }

  if (!stats) {
    return <Text color="gray.500">No statistics available</Text>;
  }

  // Calculate additional metrics
  const totalProcessedToday =
    stats.totalApprovedToday + stats.totalRejectedToday;
  const totalProcessedWeek =
    stats.totalApprovedThisWeek + stats.totalRejectedThisWeek;
  const totalProcessedMonth =
    stats.totalApprovedThisMonth + stats.totalRejectedThisMonth;

  const approvalRateToday =
    totalProcessedToday > 0
      ? Math.round((stats.totalApprovedToday / totalProcessedToday) * 100)
      : 0;

  const approvalRateWeek =
    totalProcessedWeek > 0
      ? Math.round((stats.totalApprovedThisWeek / totalProcessedWeek) * 100)
      : 0;

  const approvalRateMonth =
    totalProcessedMonth > 0
      ? Math.round((stats.totalApprovedThisMonth / totalProcessedMonth) * 100)
      : 0;

  return (
    <VStack spacing={6} align="stretch">
      {/* Overview Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {/* Today's Performance */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader pb={3}>
            <Text fontSize="lg" fontWeight="bold">
              Today's Activity
            </Text>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              <Stat>
                <StatLabel>Processed</StatLabel>
                <StatNumber>{totalProcessedToday}</StatNumber>
                <StatHelpText>
                  {stats.totalApprovedToday} approved,{" "}
                  {stats.totalRejectedToday} rejected
                </StatHelpText>
              </Stat>

              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Approval Rate
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {approvalRateToday}%
                  </Text>
                </HStack>
                <Progress
                  value={approvalRateToday}
                  colorScheme={
                    approvalRateToday >= 70
                      ? "green"
                      : approvalRateToday >= 50
                      ? "yellow"
                      : "red"
                  }
                  size="sm"
                />
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Weekly Performance */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader pb={3}>
            <Text fontSize="lg" fontWeight="bold">
              This Week
            </Text>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              <Stat>
                <StatLabel>Processed</StatLabel>
                <StatNumber>{totalProcessedWeek}</StatNumber>
                <StatHelpText>
                  {stats.totalApprovedThisWeek} approved,{" "}
                  {stats.totalRejectedThisWeek} rejected
                </StatHelpText>
              </Stat>

              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Approval Rate
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {approvalRateWeek}%
                  </Text>
                </HStack>
                <Progress
                  value={approvalRateWeek}
                  colorScheme={
                    approvalRateWeek >= 70
                      ? "green"
                      : approvalRateWeek >= 50
                      ? "yellow"
                      : "red"
                  }
                  size="sm"
                />
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Monthly Performance */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader pb={3}>
            <Text fontSize="lg" fontWeight="bold">
              This Month
            </Text>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              <Stat>
                <StatLabel>Processed</StatLabel>
                <StatNumber>{totalProcessedMonth}</StatNumber>
                <StatHelpText>
                  {stats.totalApprovedThisMonth} approved,{" "}
                  {stats.totalRejectedThisMonth} rejected
                </StatHelpText>
              </Stat>

              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Approval Rate
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {approvalRateMonth}%
                  </Text>
                </HStack>
                <Progress
                  value={approvalRateMonth}
                  colorScheme={
                    approvalRateMonth >= 70
                      ? "green"
                      : approvalRateMonth >= 50
                      ? "yellow"
                      : "red"
                  }
                  size="sm"
                />
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* System Performance */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Processing Time */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader pb={3}>
            <Text fontSize="lg" fontWeight="bold">
              System Performance
            </Text>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              <Stat>
                <StatLabel>Average Processing Time</StatLabel>
                <StatNumber>
                  {Math.round(stats.averageProcessingTimeHours)}h
                </StatNumber>
                <StatHelpText>Time from submission to decision</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Current Queue</StatLabel>
                <StatNumber color="orange.500">{stats.totalPending}</StatNumber>
                <StatHelpText>K-DOMs awaiting review</StatHelpText>
              </Stat>
            </VStack>
          </CardBody>
        </Card>

        {/* Top Moderators */}
        {showTopModerators && (
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader pb={3}>
              <Text fontSize="lg" fontWeight="bold">
                Top Moderators (30 days)
              </Text>
            </CardHeader>
            <CardBody pt={0}>
              {moderatorsLoading ? (
                <Text fontSize="sm" color="gray.500">
                  Loading moderator stats...
                </Text>
              ) : !topModerators || topModerators.length === 0 ? (
                <Text fontSize="sm" color="gray.500">
                  No moderator activity yet
                </Text>
              ) : (
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Moderator</Th>
                      <Th isNumeric>Actions</Th>
                      <Th isNumeric>Approved</Th>
                      <Th isNumeric>Rejected</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {topModerators.map((moderator, index) => {
                      const approvalRate =
                        moderator.totalActions > 0
                          ? Math.round(
                              (moderator.approvedCount /
                                moderator.totalActions) *
                                100
                            )
                          : 0;

                      return (
                        <Tr key={moderator.moderatorUsername}>
                          <Td>
                            <HStack spacing={2}>
                              <Avatar
                                size="xs"
                                name={moderator.moderatorUsername}
                              />
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="medium">
                                  {moderator.moderatorUsername}
                                </Text>
                                {index === 0 && (
                                  <Badge colorScheme="gold" size="xs">
                                    Top Performer
                                  </Badge>
                                )}
                              </VStack>
                            </HStack>
                          </Td>
                          <Td isNumeric>
                            <VStack spacing={0}>
                              <Text fontSize="sm" fontWeight="bold">
                                {moderator.totalActions}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {approvalRate}% approved
                              </Text>
                            </VStack>
                          </Td>
                          <Td isNumeric>
                            <Text fontSize="sm" color="green.600">
                              {moderator.approvedCount}
                            </Text>
                          </Td>
                          <Td isNumeric>
                            <Text fontSize="sm" color="red.600">
                              {moderator.rejectedCount}
                            </Text>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        )}
      </SimpleGrid>

      {/* Quality Metrics */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardHeader pb={3}>
          <Text fontSize="lg" fontWeight="bold">
            Quality Metrics
          </Text>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            <VStack align="center" spacing={2}>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {approvalRateMonth}%
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Monthly Approval Rate
              </Text>
            </VStack>

            <VStack align="center" spacing={2}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                {Math.round(stats.averageProcessingTimeHours)}h
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Avg Response Time
              </Text>
            </VStack>

            <VStack align="center" spacing={2}>
              <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                {stats.totalPending}
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Pending Queue
              </Text>
            </VStack>

            <VStack align="center" spacing={2}>
              <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                {topModerators?.length || 0}
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Active Moderators
              </Text>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  );
}
