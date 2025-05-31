// src/pages/CreatePostPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  CardHeader,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
  Text,
  Flex,
  useColorModeValue,
  Divider,
  Icon,
  Alert,
  AlertIcon,
  Badge,
} from "@chakra-ui/react";
import {
  FiSave,
  FiArrowLeft,
  FiEye,
  FiSettings,
  FiTag,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

import { createPost } from "@/api/post";
import { useAuth } from "@/context/AuthContext";
import { TiptapEditor } from "@/components/editor/TipTapEditor";
import { KDomTagSelector } from "@/components/post/KDomTagSelector";
import type { PostCreateDto } from "@/types/Post";
import type { KDomTagSearchResultDto } from "@/types/KDom";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Form state - using K-Dom objects instead of strings
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<KDomTagSearchResultDto[]>(
    []
  );
  const [previewMode, setPreviewMode] = useState(false);

  // Mutation pentru crearea postării
  const createMutation = useMutation({
    mutationFn: (data: PostCreateDto) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post created successfully!",
        description: "Your post has been published.",
        status: "success",
        duration: 5000,
      });
      navigate("/"); // Sau către o pagină de posts
    },
    onError: (error) => {
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
      });
    },
  });

  const handleSubmit = async () => {
    // Validări
    if (!content.trim()) {
      toast({
        title: "Content is required",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Convert K-Dom objects to tag strings for the API
    const tagStrings = selectedTags.map((tag) => tag.slug);

    const postData: PostCreateDto = {
      contentHtml: content,
      tags: tagStrings,
    };

    createMutation.mutate(postData);
  };

  const canSubmit = content.trim().length > 0;

  if (!user) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl">
          <Alert status="error" mt={8}>
            <AlertIcon />
            You must be logged in to create a post.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} pt="80px">
      <Container maxW="container.xl" py={6}>
        {/* Breadcrumb */}
        <Breadcrumb mb={6} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/posts">
              Posts
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>Create Post</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <Card mb={6}>
          <CardHeader>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <VStack align="start" spacing={2}>
                <HStack spacing={3}>
                  <Icon as={FiSettings} boxSize={6} color="green.500" />
                  <Heading size="lg">Create New Post</Heading>
                </HStack>
                <Text color="gray.600">
                  Share your thoughts, ideas, or updates with the community
                </Text>
              </VStack>

              <HStack spacing={3}>
                <Button
                  leftIcon={<FiArrowLeft />}
                  as={RouterLink}
                  to="/"
                  variant="outline"
                >
                  Back
                </Button>
              </HStack>
            </Flex>
          </CardHeader>
        </Card>

        {/* Form */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Tag Selection */}
              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="lg">
                  <HStack spacing={2}>
                    <Icon as={FiTag} />
                    <Text>Tags (K-Doms)</Text>
                  </HStack>
                </FormLabel>
                <KDomTagSelector
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                />
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Add relevant K-Dom tags to help others discover your post.
                  Your post will appear in the discussion section of tagged
                  K-Doms.
                </Text>
              </FormControl>

              {/* Selected Tags Preview */}
              {selectedTags.length > 0 && (
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>
                    Selected Tags:
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        colorScheme="blue"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                      >
                        #{tag.slug}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              )}

              <Divider />

              {/* Content Editor */}
              <FormControl isRequired>
                <HStack justify="space-between" align="center" mb={3}>
                  <FormLabel fontWeight="semibold" fontSize="lg" mb={0}>
                    Content
                  </FormLabel>
                  <Button
                    leftIcon={<FiEye />}
                    size="sm"
                    variant={previewMode ? "solid" : "outline"}
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? "Edit" : "Preview"}
                  </Button>
                </HStack>

                {previewMode ? (
                  <Box
                    minH="400px"
                    p={6}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={cardBg}
                  >
                    {content ? (
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                      <VStack py={12} spacing={4} color="gray.500">
                        <FiEye size={48} />
                        <Text fontSize="lg">No content to preview</Text>
                        <Text>Switch to edit mode to add content</Text>
                      </VStack>
                    )}
                  </Box>
                ) : (
                  <Box minH="400px">
                    <TiptapEditor
                      content={content}
                      onChange={setContent}
                      placeholder="What's on your mind? Share your thoughts, ideas, or updates..."
                    />
                  </Box>
                )}
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Write your post content. You can include text, images, links,
                  and formatting.
                </Text>
              </FormControl>

              <Divider />

              {/* Action Panel */}
              <Box p={4} borderRadius="lg">
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" align="center">
                    <Text fontWeight="semibold">Ready to publish?</Text>
                    <HStack spacing={4}>
                      <HStack spacing={2}>
                        <Icon
                          as={content.trim() ? FiCheck : FiX}
                          color={content.trim() ? "green.500" : "gray.400"}
                          size={16}
                        />
                        <Text
                          color={content.trim() ? "green.600" : "gray.500"}
                          fontSize="sm"
                        >
                          Content added
                        </Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Icon
                          as={selectedTags.length > 0 ? FiCheck : FiX}
                          color={
                            selectedTags.length > 0 ? "green.500" : "gray.400"
                          }
                          size={16}
                        />
                        <Text
                          color={
                            selectedTags.length > 0 ? "green.600" : "gray.500"
                          }
                          fontSize="sm"
                        >
                          Tags selected ({selectedTags.length})
                        </Text>
                      </HStack>
                    </HStack>
                  </HStack>

                  <HStack spacing={3} justify="end">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/")}
                      isDisabled={createMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      leftIcon={<FiSave />}
                      colorScheme="green"
                      onClick={handleSubmit}
                      isLoading={createMutation.isPending}
                      loadingText="Publishing..."
                      isDisabled={!canSubmit}
                      size="lg"
                    >
                      Publish Post
                    </Button>
                  </HStack>

                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    Your post will be visible to all users and appear in the
                    tagged K-Doms' discussion sections.
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Tips */}
        <Card mt={6} bg="blue.50" borderColor="blue.200">
          <CardHeader>
            <HStack spacing={2}>
              <Icon as={FiTag} color="blue.600" />
              <Heading size="sm" color="blue.700">
                Tips for Great Posts
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={2} fontSize="sm" color="blue.700">
              <Text>• Use relevant K-Dom tags to reach the right audience</Text>
              <Text>• Write clear, engaging content that adds value</Text>
              <Text>• Include links, images, or media when appropriate</Text>
              <Text>• Be respectful and follow community guidelines</Text>
              <Text>• Engage with comments and discussions on your posts</Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
