import { useState } from "react";
import {
  HStack,
  VStack,
  Text,
  Button,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Avatar,
  Box,
  Divider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useUserFollowLists } from "@/hooks/useUserFollow";
import { FollowButton } from "./FollowButton";

interface FollowStatsProps {
  userId: number;
  followersCount: number;
  followingCount: number;
  username?: string;
}

export function FollowStats({
  userId,
  followersCount,
  followingCount,
  username,
}: FollowStatsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers"
  );
  const { followers, following } = useUserFollowLists(userId);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleTabClick = (tab: "followers" | "following") => {
    setActiveTab(tab);
    onOpen();
  };

  return (
    <>
      <HStack spacing={6} divider={<Divider orientation="vertical" h="20px" />}>
        <Button
          variant="ghost"
          onClick={() => handleTabClick("followers")}
          p={2}
          h="auto"
          _hover={{ bg: "transparent", transform: "scale(1.05)" }}
          transition="transform 0.2s"
        >
          <VStack spacing={1}>
            <Text fontSize="xl" fontWeight="bold" color="blue.600">
              {followersCount}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Followers
            </Text>
          </VStack>
        </Button>

        <Button
          variant="ghost"
          onClick={() => handleTabClick("following")}
          p={2}
          h="auto"
          _hover={{ bg: "transparent", transform: "scale(1.05)" }}
          transition="transform 0.2s"
        >
          <VStack spacing={1}>
            <Text fontSize="xl" fontWeight="bold" color="green.600">
              {followingCount}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Following
            </Text>
          </VStack>
        </Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={bgColor} borderColor={borderColor}>
          <ModalHeader>
            {activeTab === "followers"
              ? `${username || "User"}'s Followers`
              : `${username || "User"} is Following`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              {(activeTab === "followers" ? followers : following).map(
                (user) => (
                  <HStack
                    key={user.id}
                    spacing={4}
                    p={4}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    _hover={{ bg: "gray.50" }}
                    transition="background 0.2s"
                  >
                    <Avatar size="md" name={user.username} />
                    <VStack align="start" spacing={1} flex="1">
                      <Text
                        as={RouterLink}
                        to={`/profile/${user.id}`}
                        fontWeight="semibold"
                        _hover={{
                          color: "blue.600",
                          textDecoration: "underline",
                        }}
                      >
                        {user.username}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Member since {new Date().getFullYear()}
                      </Text>
                    </VStack>
                    <FollowButton
                      userId={user.id}
                      username={user.username}
                      size="sm"
                    />
                  </HStack>
                )
              )}

              {(activeTab === "followers" ? followers : following).length ===
                0 && (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500">
                    {activeTab === "followers"
                      ? "No followers yet"
                      : "Not following anyone yet"}
                  </Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
