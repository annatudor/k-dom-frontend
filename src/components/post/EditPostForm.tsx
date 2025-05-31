// src/components/post/EditPostForm.tsx
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  useToast,
  useColorModeValue,
  Text,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FiEdit3, FiEye, FiSave, FiX } from "react-icons/fi";

import { updatePost } from "@/api/post";
import { searchKDomTags } from "@/api/kdom";
import { TiptapEditor } from "@/components/editor/TipTapEditor";
import { KDomTagSelector } from "./KDomTagSelector";
import type { PostEditDto, PostReadDto } from "@/types/Post";
import type { KDomTagSearchResultDto } from "@/types/KDom";

interface EditPostFormProps {
  post: PostReadDto;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditPostForm({ post, onCancel, onSuccess }: EditPostFormProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [content, setContent] = useState(post.contentHtml);
  const [selectedTags, setSelectedTags] = useState<KDomTagSearchResultDto[]>(
    []
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Load existing tags when component mounts
  useEffect(() => {
    const loadExistingTags = async () => {
      if (post.tags && post.tags.length > 0) {
        try {
          // Convert slugs back to full tag objects
          const tagPromises = post.tags.map(async (slug) => {
            const results = await searchKDomTags(slug);
            return results.find((result) => result.slug === slug);
          });

          const resolvedTags = await Promise.all(tagPromises);
          const validTags = resolvedTags.filter(
            Boolean
          ) as KDomTagSearchResultDto[];
          setSelectedTags(validTags);
        } catch (error) {
          console.error("Failed to load existing tags:", error);
        }
      }
      setIsLoadingTags(false);
    };

    loadExistingTags();
  }, [post.tags]);

  // Mutation pentru actualizarea postării
  const updateMutation = useMutation({
    mutationFn: (data: PostEditDto) => updatePost(post.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });

      toast({
        title: "Post updated successfully!",
        status: "success",
        duration: 3000,
      });

      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Failed to update post",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Content is required",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Convert tags to slugs for backend
    const tags = selectedTags.map((tag) => tag.slug);

    const postData: PostEditDto = {
      contentHtml: content,
      tags,
    };

    updateMutation.mutate(postData);
  };

  const hasChanges =
    content !== post.contentHtml ||
    JSON.stringify(selectedTags.map((t) => t.slug).sort()) !==
      JSON.stringify((post.tags || []).sort());

  const canSubmit = content.trim() && !updateMutation.isPending && hasChanges;

  if (isLoadingTags) {
    return (
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
      >
        <CardBody p={6}>
          <Text>Loading post data...</Text>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="lg"
    >
      <CardBody p={6}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Icon as={FiEdit3} color="orange.500" boxSize={6} />
              <Text fontSize="xl" fontWeight="bold">
                Edit Post
              </Text>
            </HStack>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              leftIcon={<FiX />}
            >
              Cancel
            </Button>
          </HStack>

          {/* Original creation info */}
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" fontWeight="bold">
                Editing post from{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
              <Text fontSize="xs">
                Changes will be marked as edited and timestamped
              </Text>
            </VStack>
          </Alert>

          {/* Tag Selector */}
          <KDomTagSelector
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            maxTags={3}
          />

          {/* Content Editor */}
          <Box>
            <Tabs
              index={previewMode ? 1 : 0}
              variant="enclosed"
              colorScheme="orange"
            >
              <TabList>
                <Tab onClick={() => setPreviewMode(false)}>
                  <HStack spacing={2}>
                    <FiEdit3 size={16} />
                    <Text>Edit</Text>
                  </HStack>
                </Tab>
                <Tab onClick={() => setPreviewMode(true)}>
                  <HStack spacing={2}>
                    <FiEye size={16} />
                    <Text>Preview</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                {/* Edit Tab */}
                <TabPanel p={0} pt={4}>
                  <Box minH="300px">
                    <TiptapEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Edit your post content..."
                    />
                  </Box>
                </TabPanel>

                {/* Preview Tab */}
                <TabPanel p={0} pt={4}>
                  <Box
                    minH="300px"
                    p={6}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={cardBg}
                  >
                    {content ? (
                      <Box
                        dangerouslySetInnerHTML={{ __html: content }}
                        sx={{
                          "& h1, & h2, & h3, & h4, & h5, & h6": {
                            fontWeight: "bold",
                            mb: 4,
                          },
                          "& p": {
                            mb: 4,
                            lineHeight: "1.6",
                          },
                          "& ul, & ol": {
                            mb: 4,
                            pl: 6,
                          },
                          "& blockquote": {
                            borderLeft: "4px solid",
                            borderColor: "orange.400",
                            pl: 4,
                            my: 4,
                            fontStyle: "italic",
                          },
                          "& code": {
                            bg: "gray.100",
                            px: 2,
                            py: 1,
                            borderRadius: "md",
                            fontSize: "sm",
                          },
                          "& pre": {
                            bg: "gray.100",
                            p: 4,
                            borderRadius: "md",
                            overflow: "auto",
                            my: 4,
                          },
                        }}
                      />
                    ) : (
                      <VStack py={12} spacing={4} color="gray.500">
                        <FiEye size={48} />
                        <Text fontSize="lg">No content to preview</Text>
                        <Text>Switch to edit mode to modify content</Text>
                      </VStack>
                    )}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Changes indicator */}
          {hasChanges && (
            <Alert status="warning" borderRadius="lg">
              <AlertIcon />
              <Text fontSize="sm">You have unsaved changes to this post</Text>
            </Alert>
          )}

          {/* Action Buttons */}
          <HStack justify="space-between" align="center" pt={4}>
            <Text fontSize="sm" color="gray.600">
              Last edited:{" "}
              {post.editedAt
                ? new Date(post.editedAt).toLocaleString()
                : "Never"}
            </Text>

            <HStack spacing={3}>
              <Button
                variant="outline"
                onClick={onCancel}
                isDisabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                leftIcon={<FiSave />}
                colorScheme="orange"
                onClick={handleSubmit}
                isLoading={updateMutation.isPending}
                loadingText="Saving..."
                isDisabled={!canSubmit}
                size="lg"
              >
                Save Changes
              </Button>
            </HStack>
          </HStack>

          {/* Footer Info */}
          <Box pt={2} borderTop="1px solid" borderColor={borderColor}>
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Edited posts will show an "edited" badge and the timestamp of the
              last modification
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}
