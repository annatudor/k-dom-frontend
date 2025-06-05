// src/components/moderation/UserModerationHistory.tsx
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
  Progress,
  Divider,
} from "@chakra-ui/react";
import {
  FiTrendingUp,
  FiClock,
  FiCheck,
  FiX,
  FiCalendar,
} from "react-icons/fi";
import { useUserModerationHistory } from "@/hooks/useModeration";
import {
  formatProcessingTime,
  getModerationStatusColor,
} from "@/api/moderation";

export function UserModerationHistory() {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { data: history, isLoading, error } = useUserModerationHistory();

  if (isLoading) {
    return (
      <VStack spacing={4}>
        <Spinner size="xl" thickness="4px" color="purple.500" />
        <Text fontSize="lg" color="gray.600">
          Loading your moderation history...
        </Text>
      </VStack>
    );
  }

  if (error || !history) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load moderation history. Please try again later.
      </Alert>
    );
  }

  if (history.allSubmissions.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">No submission history</Text>
          <Text>
            You haven't submitted any K-DOMs yet. Create your first K-DOM to
            start building your history!
          </Text>
        </VStack>
      </Alert>
    );
  }

  const calculateApprovalRate = () => {
    const approved = history.allSubmissions.filter(
      (s) => s.status === "Approved"
    ).length;
    const total = history.allSubmissions.length;
    return total > 0 ? (approved / total) * 100 : 0;
  };

  const calculateAverageProcessingTime = () => {
    const processedSubmissions = history.allSubmissions.filter(
      (s) => s.processingTime
    );
    if (processedSubmissions.length === 0) return 0;

    const totalHours = processedSubmissions.reduce((sum, submission) => {
      // Parse processing time (assuming format like "2.15:30:45" for 2 days, 15 hours, 30 minutes, 45 seconds)
      const timeStr = submission.processingTime || "0";
      const parts = timeStr.split(/[.:]/).map(Number);
      let hours = 0;

      if (parts.length >= 2) {
        hours = (parts[0] || 0) * 24 + (parts[1] || 0); // days to hours + hours
      }

      return sum + hours;
    }, 0);

    return Math.round(totalHours / processedSubmissions.length);
  };

  const approvalRate = calculateApprovalRate();
  const avgProcessingTime = calculateAverageProcessingTime();
  const pendingCount = history.allSubmissions.filter(
    (s) => s.status === "Pending"
  ).length;
  const approvedCount = history.allSubmissions.filter(
    (s) => s.status === "Approved"
  ).length;
  const rejectedCount = history.allSubmissions.filter(
    (s) => s.status === "Rejected"
  ).length;

  return (
    <VStack spacing={6} align="stretch">
      {/* Summary Stats */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardHeader>
          <Text fontSize="lg" fontWeight="bold">
            Your Submission Summary
          </Text>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            <Stat>
              <StatLabel>Total Submissions</StatLabel>
              <StatNumber color="blue.500">
                {history.allSubmissions.length}
              </StatNumber>
              <StatHelpText>K-DOMs created</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Approval Rate</StatLabel>
              <StatNumber color="green.500">
                {approvalRate.toFixed(1)}%
              </StatNumber>
              <StatHelpText>
                {approvedCount} of {history.allSubmissions.length}
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Avg. Processing</StatLabel>
              <StatNumber color="purple.500">{avgProcessingTime}h</StatNumber>
              <StatHelpText>Response time</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Status Breakdown</StatLabel>
              <HStack spacing={2} mt={2}>
                <Badge colorScheme="green" fontSize="xs">
                  {approvedCount}
                </Badge>
                <Badge colorScheme="orange" fontSize="xs">
                  {pendingCount}
                </Badge>
                <Badge colorScheme="red" fontSize="xs">
                  {rejectedCount}
                </Badge>
              </HStack>
              <StatHelpText>Approved • Pending • Rejected</StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Approval Rate Progress */}
          <Box mt={6}>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium">
                Approval Rate Progress
              </Text>
              <Text fontSize="sm" color="gray.600">
                {approvalRate.toFixed(1)}%
              </Text>
            </HStack>
            <Progress
              value={approvalRate}
              colorScheme={
                approvalRate >= 80
                  ? "green"
                  : approvalRate >= 60
                  ? "yellow"
                  : "red"
              }
              size="lg"
            />
            <HStack
              justify="space-between"
              mt={1}
              fontSize="xs"
              color="gray.500"
            >
              <Text>0%</Text>
              <Text>50%</Text>
              <Text>100%</Text>
            </HStack>
          </Box>
        </CardBody>
      </Card>

      {/* Recent Decisions */}
      {history.recentDecisions.length > 0 && (
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold">
              Recent Moderation Decisions
            </Text>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              {history.recentDecisions.slice(0, 5).map((decision) => (
                <Box key={decision.id}>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack spacing={3}>
                        <Box>
                          {decision.decision === "Approved" ? (
                            <FiCheck color="green" size={16} />
                          ) : (
                            <FiX color="red" size={16} />
                          )}
                        </Box>
                        <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                          {decision.kdomTitle}
                        </Text>
                        <Badge
                          colorScheme={getModerationStatusColor(
                            decision.decision
                          )}
                          fontSize="xs"
                        >
                          {decision.decision}
                        </Badge>
                      </HStack>

                      <HStack spacing={4} fontSize="xs" color="gray.500">
                        <HStack spacing={1}>
                          <FiCalendar size={12} />
                          <Text>
                            {new Date(decision.actionDate).toLocaleDateString()}
                          </Text>
                        </HStack>
                        <HStack spacing={1}>
                          <FiClock size={12} />
                          <Text>
                            {formatProcessingTime(decision.processingTime)}
                          </Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Avatar size="xs" name={decision.moderatorUsername} />
                          <Text>{decision.moderatorUsername}</Text>
                        </HStack>
                      </HStack>

                      {decision.reason && decision.decision === "Rejected" && (
                        <Box
                          mt={2}
                          p={2}
                          bg="red.50"
                          borderRadius="md"
                          w="full"
                        >
                          <Text
                            fontSize="xs"
                            color="red.600"
                            fontWeight="medium"
                          >
                            Reason: {decision.reason}
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </HStack>

                  {history.recentDecisions.indexOf(decision) <
                    history.recentDecisions.slice(0, 5).length - 1 && (
                    <Divider mt={4} />
                  )}
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Performance Insights */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardHeader>
          <HStack spacing={2}>
            <FiTrendingUp />
            <Text fontSize="lg" fontWeight="bold">
              Performance Insights
            </Text>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={4} align="stretch">
            {/* Approval Rate Insights */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Quality Score
              </Text>
              {approvalRate >= 80 ? (
                <Alert status="success" size="sm">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Excellent! You have a high approval rate of{" "}
                    {approvalRate.toFixed(1)}%. Keep creating quality content!
                  </Text>
                </Alert>
              ) : approvalRate >= 60 ? (
                <Alert status="warning" size="sm">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Good work! Your approval rate is {approvalRate.toFixed(1)}%.
                    Consider reviewing rejected submissions for improvement
                    tips.
                  </Text>
                </Alert>
              ) : (
                <Alert status="info" size="sm">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Your approval rate is {approvalRate.toFixed(1)}%. Review our
                    community guidelines and learn from feedback to improve your
                    submissions.
                  </Text>
                </Alert>
              )}
            </Box>

            {/* Processing Time Insights */}
            {avgProcessingTime > 0 && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  Processing Time
                </Text>
                <HStack spacing={2}>
                  <FiClock size={14} />
                  <Text fontSize="sm" color="gray.600">
                    Your K-DOMs are typically processed in {avgProcessingTime}{" "}
                    hours
                    {avgProcessingTime <= 24 && " - faster than average!"}
                    {avgProcessingTime > 48 &&
                      " - this may indicate complexity or quality issues"}
                  </Text>
                </HStack>
              </Box>
            )}

            {/* Recent Activity */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Recent Activity
              </Text>
              <HStack spacing={2}>
                <FiCalendar size={14} />
                <Text fontSize="sm" color="gray.600">
                  {history.allSubmissions.length > 0
                    ? `Last submission: ${new Date(
                        history.allSubmissions[0].createdAt
                      ).toLocaleDateString()}`
                    : "No recent submissions"}
                </Text>
              </HStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
