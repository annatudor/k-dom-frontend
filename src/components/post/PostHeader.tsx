// src/components/post/PostHeader.tsx
import {
  VStack,
  HStack,
  Box,
  Text,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  useColorModeValue,
  Icon,
  Divider,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiEdit3,
  FiEye,
  FiHeart,
  FiMessageCircle,
  FiUser,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

import type { PostReadDto } from "@/types/Post";

interface PostHeaderProps {
  post: PostReadDto;
}

export function PostHeader({ post }: PostHeaderProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="sm"
    >
      <CardBody p={6}>
        <VStack spacing={6} align="stretch">
          {/* Author Info */}
          <HStack spacing={4} align="center">
            <Avatar size="lg" name={post.username} />
            <VStack align="start" spacing={2} flex="1">
              <HStack spacing={2} align="center">
                <Text fontSize="xl" fontWeight="bold">
                  {post.username}
                </Text>
                <Button
                  as={RouterLink}
                  to={`/profile/${post.userId}`}
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  leftIcon={<FiUser />}
                >
                  View Profile
                </Button>
              </HStack>
              <HStack spacing={4} fontSize="sm" color={textColor}>
                <HStack spacing={1}>
                  <Icon as={FiCalendar} />
                  <Text>
                    Posted {new Date(post.createdAt).toLocaleDateString()}
                  </Text>
                </HStack>
                {post.isEdited && post.editedAt && (
                  <HStack spacing={1}>
                    <Icon as={FiEdit3} />
                    <Text>
                      Edited {new Date(post.editedAt).toLocaleDateString()}
                    </Text>
                  </HStack>
                )}
              </HStack>
            </VStack>
          </HStack>

          <Divider />

          {/* Post Stats */}
          <HStack spacing={6} justify="center">
            <VStack spacing={1} align="center">
              <HStack spacing={1} color="red.500">
                <Icon as={FiHeart} />
                <Text fontWeight="bold">{post.likeCount}</Text>
              </HStack>
              <Text fontSize="sm" color={textColor}>
                Likes
              </Text>
            </VStack>

            <VStack spacing={1} align="center">
              <HStack spacing={1} color="blue.500">
                <Icon as={FiMessageCircle} />
                <Text fontWeight="bold">∞</Text>
              </HStack>
              <Text fontSize="sm" color={textColor}>
                Comments
              </Text>
            </VStack>

            <VStack spacing={1} align="center">
              <HStack spacing={1} color="purple.500">
                <Icon as={FiEye} />
                <Text fontWeight="bold">~</Text>
              </HStack>
              <Text fontSize="sm" color={textColor}>
                Views
              </Text>
            </VStack>
          </HStack>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <>
              <Divider />
              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={3}>
                  Tagged K-Doms:
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      as={RouterLink}
                      to={`/kdoms/slug/${tag}`}
                      colorScheme="blue"
                      variant="subtle"
                      px={3}
                      py={2}
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="medium"
                      _hover={{
                        bg: "blue.100",
                        textDecoration: "none",
                        transform: "translateY(-1px)",
                      }}
                      cursor="pointer"
                      transition="all 0.2s"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            </>
          )}

          {/* Edit Status */}
          {post.isEdited && (
            <>
              <Divider />
              <Box
                p={3}
                bg="orange.50"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="orange.200"
              >
                <HStack spacing={2} align="center">
                  <Icon as={FiEdit3} color="orange.500" />
                  <Text fontSize="sm" color="orange.700">
                    This post has been edited.{" "}
                    {post.editedAt && (
                      <>
                        Last modification:{" "}
                        {new Date(post.editedAt).toLocaleString()}
                      </>
                    )}
                  </Text>
                </HStack>
              </Box>
            </>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
