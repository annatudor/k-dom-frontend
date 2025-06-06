// src/components/layout/NotificationDropdown.tsx
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack,
  Text,
  HStack,
  Badge,
  Button,
  Flex,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiBell, FiCheck, FiTrash2, FiCheckCircle } from "react-icons/fi";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import type { NotificationReadDto } from "@/types/Notification";

const NotificationItem: React.FC<{
  notification: NotificationReadDto;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onMarkAsRead, onDelete }) => {
  const bg = useColorModeValue(
    notification.isRead ? "gray.50" : "blue.50",
    notification.isRead ? "gray.700" : "blue.900"
  );
  const borderColor = useColorModeValue(
    notification.isRead ? "gray.200" : "blue.200",
    notification.isRead ? "gray.600" : "blue.600"
  );

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const notifDate = new Date(dateString);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "KDomApproved":
        return "✓";
      case "KDomRejected":
        return "✗";
      case "CommentReply":
        return "💬";
      case "PostLiked":
      case "CommentLiked":
        return "❤️";
      case "NewFollower":
        return "👤";
      case "MentionInComment":
      case "MentionInPost":
        return "@";
      default:
        return "🔔";
    }
  };

  return (
    <Box
      p={3}
      bg={bg}
      borderLeft="3px solid"
      borderLeftColor={notification.isRead ? "transparent" : "blue.400"}
      borderRadius="md"
      border="1px solid"
      borderColor={borderColor}
      mb={2}
      cursor="pointer"
      _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
    >
      <Flex justify="space-between" align="flex-start">
        <HStack spacing={2} flex="1">
          <Text fontSize="sm">{getNotificationIcon(notification.type)}</Text>
          <VStack align="flex-start" spacing={1} flex="1">
            <Text
              fontSize="sm"
              fontWeight={notification.isRead ? "normal" : "semibold"}
            >
              {notification.message}
            </Text>
            <HStack spacing={2}>
              <Text fontSize="xs" color="gray.500">
                {formatTimeAgo(notification.createdAt)}
              </Text>
              {notification.triggeredByUsername && (
                <Text fontSize="xs" color="blue.500">
                  by @{notification.triggeredByUsername}
                </Text>
              )}
            </HStack>
          </VStack>
        </HStack>

        <HStack spacing={1}>
          {!notification.isRead && (
            <IconButton
              icon={<FiCheck />}
              aria-label="Mark as read"
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
            />
          )}
          <IconButton
            icon={<FiTrash2 />}
            aria-label="Delete notification"
            size="xs"
            variant="ghost"
            colorScheme="red"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
          />
        </HStack>
      </Flex>
    </Box>
  );
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getFilteredNotifications,
  } = useNotifications();

  const userNotifications = getFilteredNotifications("user");
  const systemNotifications = getFilteredNotifications("system");

  return (
    <Box
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Popover isOpen={isOpen} placement="bottom-start" closeOnBlur={false}>
        <PopoverTrigger>
          <Box position="relative">
            <IconButton
              icon={<FiBell />}
              aria-label="Notifications"
              variant="ghost"
              size="sm"
            />
            {unreadCount > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="-1"
                right="-1"
                fontSize="xs"
                minW="20px"
                h="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Box>
        </PopoverTrigger>
        <PopoverContent w="400px" maxH="500px">
          <PopoverHeader>
            <Flex justify="space-between" align="center">
              <Text fontWeight="bold">Notifications</Text>
              {unreadCount > 0 && (
                <Button
                  size="xs"
                  variant="ghost"
                  leftIcon={<FiCheckCircle />}
                  onClick={markAllAsRead}
                >
                  Mark all read
                </Button>
              )}
            </Flex>
          </PopoverHeader>
          <PopoverBody p={0}>
            {loading ? (
              <Flex justify="center" p={4}>
                <Spinner size="sm" />
              </Flex>
            ) : (
              <Tabs isFitted variant="enclosed">
                <TabList>
                  <Tab fontSize="sm">
                    User
                    {userNotifications.filter((n) => !n.isRead).length > 0 && (
                      <Badge ml={2} colorScheme="blue" borderRadius="full">
                        {userNotifications.filter((n) => !n.isRead).length}
                      </Badge>
                    )}
                  </Tab>
                  <Tab fontSize="sm">
                    System
                    {systemNotifications.filter((n) => !n.isRead).length >
                      0 && (
                      <Badge ml={2} colorScheme="orange" borderRadius="full">
                        {systemNotifications.filter((n) => !n.isRead).length}
                      </Badge>
                    )}
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel p={3} maxH="350px" overflowY="auto">
                    {userNotifications.length === 0 ? (
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        textAlign="center"
                        py={4}
                      >
                        No user notifications
                      </Text>
                    ) : (
                      <VStack spacing={0} align="stretch">
                        {userNotifications.slice(0, 10).map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={markAsRead}
                            onDelete={deleteNotification}
                          />
                        ))}
                      </VStack>
                    )}
                  </TabPanel>
                  <TabPanel p={3} maxH="350px" overflowY="auto">
                    {systemNotifications.length === 0 ? (
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        textAlign="center"
                        py={4}
                      >
                        No system notifications
                      </Text>
                    ) : (
                      <VStack spacing={0} align="stretch">
                        {systemNotifications
                          .slice(0, 10)
                          .map((notification) => (
                            <NotificationItem
                              key={notification.id}
                              notification={notification}
                              onMarkAsRead={markAsRead}
                              onDelete={deleteNotification}
                            />
                          ))}
                      </VStack>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
