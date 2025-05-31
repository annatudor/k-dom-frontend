// src/components/post/CreatePostForm.tsx
import { useState } from "react";
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
} from "@chakra-ui/react";
import { FiEdit3, FiEye, FiSend, FiX } from "react-icons/fi";

import { createPost } from "@/api/post";
import { useAuth } from "@/context/AuthContext";
import { TiptapEditor } from "@/components/editor/TipTapEditor";
import { KDomTagSelector } from "./KDomTagSelector";
import type { PostCreateDto } from "@/types/Post";
import type { KDomTagSearchResultDto } from "@/types/KDom";

interface CreatePostFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  defaultKDomTag?: KDomTagSearchResultDto; // Pentru când creăm postarea din pagina unui K-Dom
}

export function CreatePostForm({
  isOpen = true,
  onClose,
  onSuccess,
  defaultKDomTag,
}: CreatePostFormProps) {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<KDomTagSearchResultDto[]>(
    defaultKDomTag ? [defaultKDomTag] : []
  );
  const [previewMode, setPreviewMode] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Mutation pentru crearea postării
  const createMutation = useMutation({
    mutationFn: (data: PostCreateDto) => createPost(data),
    onSuccess: () => {
      // Invalidez cache-ul pentru postări
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });

      // Reset form
      setContent("");
      setSelectedTags(defaultKDomTag ? [defaultKDomTag] : []);
      setPreviewMode(false);

      toast({
        title: "Post created successfully!",
        status: "success",
        duration: 3000,
      });

      onSuccess?.();
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

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Content is required",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Convertesc tag-urile în slug-uri pentru backend
    const tags = selectedTags.map((tag) => tag.slug);

    const postData: PostCreateDto = {
      contentHtml: content,
      tags,
      kdomId: selectedTags.length > 0 ? selectedTags[0].id : undefined,
    };

    createMutation.mutate(postData);
  };

  const canSubmit = content.trim() && !createMutation.isPending;

  if (!isOpen) return null;

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
              <Icon as={FiEdit3} color="blue.500" boxSize={6} />
              <Text fontSize="xl" fontWeight="bold">
                Create New Post
              </Text>
            </HStack>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                leftIcon={<FiX />}
              >
                Cancel
              </Button>
            )}
          </HStack>

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
              colorScheme="blue"
            >
              <TabList>
                <Tab onClick={() => setPreviewMode(false)}>
                  <HStack spacing={2}>
                    <FiEdit3 size={16} />
                    <Text>Write</Text>
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
                      placeholder="What's on your mind? Share your thoughts, ideas, or start a discussion..."
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
                            borderColor: "blue.400",
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
                        <Text>Switch to write mode to add content</Text>
                      </VStack>
                    )}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Action Buttons */}
          <HStack justify="space-between" align="center" pt={4}>
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="gray.600">
                Posting as <strong>{user?.username}</strong>
              </Text>
              {selectedTags.length > 0 && (
                <Text fontSize="sm" color="blue.600">
                  Tagged in {selectedTags.length} K-Dom
                  {selectedTags.length > 1 ? "s" : ""}
                </Text>
              )}
            </VStack>

            <HStack spacing={3}>
              {onClose && (
                <Button
                  variant="outline"
                  onClick={onClose}
                  isDisabled={createMutation.isPending}
                >
                  Cancel
                </Button>
              )}
              <Button
                leftIcon={<FiSend />}
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={createMutation.isPending}
                loadingText="Publishing..."
                isDisabled={!canSubmit}
                size="lg"
              >
                Publish Post
              </Button>
            </HStack>
          </HStack>

          {/* Footer Info */}
          <Box pt={2} borderTop="1px solid" borderColor={borderColor}>
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Your post will be visible to all users and will appear in the
              feeds of people following the tagged K-Doms
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}
