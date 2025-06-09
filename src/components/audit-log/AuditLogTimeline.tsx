// src/components/audit-log/AuditLogTimeline.tsx - FIXED VERSION
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Avatar,
  Divider,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import {
  FiUser,
  FiActivity,
  FiShield,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiX,
  FiEye,
  FiRefreshCw,
} from "react-icons/fi";
import { useAuditTimeline } from "@/hooks/useAuditLog";
import { getActionColor, getRelativeTime } from "@/api/auditLog";
import { AUDIT_ACTION_LABELS } from "@/types/AuditLog";
import type { AuditLogFilterDto, AuditAction } from "@/types/AuditLog";

interface AuditLogTimelineProps {
  filters?: Partial<AuditLogFilterDto>;
  maxItems?: number;
  showUserAvatars?: boolean;
  groupByDay?: boolean;
}

interface TimelineEntry {
  id: number;
  timestamp: string;
  action: AuditAction;
  userName?: string;
  description: string;
  details?: string;
  targetInfo?: {
    type: string;
    id: string;
  };
}

export function AuditLogTimeline({
  filters,
  maxItems = 50,
  showUserAvatars = true,
  groupByDay = true,
}: AuditLogTimelineProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const timelineBg = useColorModeValue("gray.50", "gray.700");

  const { timelineData, isLoading, isEmpty } = useAuditTimeline(filters);

  // Group timeline data by day if requested
  const groupedData = groupByDay
    ? groupTimelineByDay(timelineData)
    : { "All Events": timelineData };

  // Get icon for action
  const getActionIcon = (action: AuditAction) => {
    const iconMap: Record<string, React.ComponentType> = {
      CreateUser: FiUser,
      CreateKDom: FiPlus,
      EditKDom: FiEdit,
      DeleteKDom: FiTrash2,
      ApproveKDom: FiCheck,
      RejectKDom: FiX,
      ChangeRole: FiShield,
      LoginSuccess: FiUser,
      LoginFailed: FiX,
      ViewModerationDashboard: FiEye,
    };

    return iconMap[action] || FiActivity;
  };

  // Get action severity color
  const getActionSeverity = (
    action: AuditAction
  ): "low" | "medium" | "high" | "critical" => {
    const severityMap: Record<string, "low" | "medium" | "high" | "critical"> =
      {
        LoginFailed: "medium",
        ChangeRole: "high",
        DeleteKDom: "high",
        ForceDeleteKDom: "critical",
        CreateUser: "low",
        LoginSuccess: "low",
        CreateKDom: "low",
        EditKDom: "low",
        ApproveKDom: "low",
        RejectKDom: "low",
      };

    return severityMap[action] || "low";
  };

  if (isLoading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="xl" thickness="4px" color="blue.500" />
        <Text fontSize="lg" color="gray.600">
          Loading timeline...
        </Text>
      </VStack>
    );
  }

  if (isEmpty) {
    return (
      <Alert status="info">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">No timeline data</Text>
          <Text>No audit events found for the selected criteria.</Text>
        </VStack>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Timeline Header */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardBody>
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="bold">
                Activity Timeline
              </Text>
              <Text fontSize="sm" color="gray.600">
                Chronological view of system events
              </Text>
            </VStack>
            <HStack spacing={2}>
              <Badge colorScheme="blue" variant="subtle">
                {timelineData.length} Events
              </Badge>
              <IconButton
                icon={<FiRefreshCw />}
                size="sm"
                variant="ghost"
                aria-label="Refresh timeline"
                onClick={() => window.location.reload()}
              />
            </HStack>
          </HStack>
        </CardBody>
      </Card>

      {/* Timeline Content */}
      <Box position="relative">
        {Object.entries(groupedData).map(([dateGroup, events]) => (
          <Box key={dateGroup} mb={8}>
            {/* Date Header (for grouped timeline) */}
            {groupByDay && dateGroup !== "All Events" && (
              <Box mb={4}>
                <HStack spacing={3}>
                  <Text fontSize="md" fontWeight="bold" color="blue.600">
                    {dateGroup}
                  </Text>
                  <Divider />
                  <Badge colorScheme="blue" variant="outline">
                    {events.length} events
                  </Badge>
                </HStack>
              </Box>
            )}

            {/* Timeline Items */}
            <VStack spacing={0} align="stretch" position="relative">
              {/* Timeline Line */}
              <Box
                position="absolute"
                left="20px"
                top="0"
                bottom="0"
                width="2px"
                bg={timelineBg}
                zIndex={0}
              />

              {events.slice(0, maxItems).map((event, index) => {
                const IconComponent = getActionIcon(event.action);
                const severity = getActionSeverity(event.action);
                const isLast = index === events.length - 1;

                return (
                  <Box key={event.id} position="relative" pb={isLast ? 0 : 6}>
                    {/* Timeline Dot */}
                    <Box
                      position="absolute"
                      left="12px"
                      top="12px"
                      width="16px"
                      height="16px"
                      borderRadius="full"
                      bg={`${getActionColor(event.action)}.500`}
                      border="3px solid"
                      borderColor={cardBg}
                      zIndex={1}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box as={IconComponent} boxSize="8px" color="white" />
                    </Box>

                    {/* Event Card */}
                    <Box ml="50px">
                      <Card
                        bg={cardBg}
                        borderWidth="1px"
                        borderColor={borderColor}
                        shadow="sm"
                        _hover={{ shadow: "md" }}
                        borderLeft="4px solid"
                        borderLeftColor={`${getActionColor(event.action)}.500`}
                      >
                        <CardBody p={4}>
                          <VStack spacing={3} align="stretch">
                            {/* Event Header */}
                            <HStack justify="space-between" align="start">
                              <VStack align="start" spacing={1}>
                                <HStack spacing={2}>
                                  <Badge
                                    colorScheme={getActionColor(event.action)}
                                    variant="subtle"
                                  >
                                    {AUDIT_ACTION_LABELS[event.action] ||
                                      event.action}
                                  </Badge>
                                  {severity !== "low" && (
                                    <Badge
                                      colorScheme={
                                        severity === "critical"
                                          ? "red"
                                          : severity === "high"
                                          ? "orange"
                                          : "yellow"
                                      }
                                      variant="solid"
                                      size="sm"
                                    >
                                      {severity.toUpperCase()}
                                    </Badge>
                                  )}
                                </HStack>
                                <Text fontSize="md" fontWeight="medium">
                                  {event.description}
                                </Text>
                              </VStack>

                              <VStack align="end" spacing={1}>
                                <Text fontSize="xs" color="gray.500">
                                  {getRelativeTime(event.timestamp)}
                                </Text>
                                <Text fontSize="xs" color="gray.400">
                                  {new Date(
                                    event.timestamp
                                  ).toLocaleTimeString()}
                                </Text>
                              </VStack>
                            </HStack>

                            {/* Event Details */}
                            {event.details && (
                              <Box p={3} bg="gray.50" borderRadius="md">
                                <Text fontSize="sm" color="gray.700">
                                  {event.details}
                                </Text>
                              </Box>
                            )}

                            {/* Event Footer */}
                            <HStack justify="space-between" align="center">
                              <HStack spacing={3}>
                                {/* User Info */}
                                {showUserAvatars && (
                                  <HStack spacing={2}>
                                    <Avatar size="xs" name={event.userName} />
                                    <Text fontSize="sm" color="gray.600">
                                      {event.userName || "System"}
                                    </Text>
                                  </HStack>
                                )}

                                {/* Target Info */}
                                {event.targetInfo && (
                                  <HStack spacing={2}>
                                    <Text fontSize="xs" color="gray.500">
                                      Target:
                                    </Text>
                                    <Badge variant="outline" size="sm">
                                      {event.targetInfo.type}
                                    </Badge>
                                    <Text
                                      fontSize="xs"
                                      color="gray.500"
                                      fontFamily="mono"
                                    >
                                      {event.targetInfo.id.length > 12
                                        ? `${event.targetInfo.id.substring(
                                            0,
                                            12
                                          )}...`
                                        : event.targetInfo.id}
                                    </Text>
                                  </HStack>
                                )}
                              </HStack>

                              {/* Action Buttons */}
                              <HStack spacing={1}>
                                <Tooltip label="View full details">
                                  <IconButton
                                    icon={<FiEye />}
                                    size="xs"
                                    variant="ghost"
                                    aria-label="View details"
                                    onClick={() => {
                                      console.log(
                                        "View details for event:",
                                        event.id
                                      );
                                    }}
                                  />
                                </Tooltip>
                              </HStack>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    </Box>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        ))}
      </Box>

      {/* Load More */}
      {timelineData.length > maxItems && (
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody textAlign="center">
            <VStack spacing={3}>
              <Text fontSize="sm" color="gray.600">
                Showing {maxItems} of {timelineData.length} events
              </Text>
              <Badge colorScheme="blue" variant="outline">
                {timelineData.length - maxItems} more events available
              </Badge>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
}

// Helper function to group timeline data by day
function groupTimelineByDay(timelineData: TimelineEntry[]) {
  const grouped = timelineData.reduce((groups, event) => {
    const date = new Date(event.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, TimelineEntry[]>);

  // Sort groups by date (most recent first)
  const sortedGroups: Record<string, TimelineEntry[]> = {};
  Object.keys(grouped)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .forEach((date) => {
      sortedGroups[date] = grouped[date].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    });

  return sortedGroups;
}
