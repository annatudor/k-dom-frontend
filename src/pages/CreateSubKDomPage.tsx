// src/pages/CreateSubKDomPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Alert,
  AlertIcon,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
  Text,
  Badge,
  Flex,
  useColorModeValue,
  Divider,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiSave,
  FiEye,
  FiInfo,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";

import { getKDomBySlug, createSubKDom } from "@/api/kdom";
import { useThemes } from "@/hooks/useKDomData";
import { useAuth } from "@/context/AuthContext";
import { TiptapEditor } from "@/components/editor/TipTapEditor";
import { KDomContent } from "@/components/kdom/kdom-components/KDomContent";
import type { KDomSubCreateDto, KDomTheme } from "@/types/KDom";

export default function CreateSubKDomPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentHtml: "",
    theme: "" as KDomTheme | "",
  });
  const [previewMode, setPreviewMode] = useState(false);

  // Query pentru K-Dom-ul părinte
  const {
    data: parentKdom,
    isLoading: isParentLoading,
    error: parentError,
  } = useQuery({
    queryKey: ["kdom", slug],
    queryFn: () => getKDomBySlug(slug!),
    enabled: !!slug,
  });

  // Query pentru teme
  const { data: themes = [] } = useThemes();

  // Mutation pentru crearea sub-K-Dom-ului
  const createMutation = useMutation({
    mutationFn: (data: KDomSubCreateDto) => createSubKDom(parentKdom!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kdom", slug] });
      queryClient.invalidateQueries({
        queryKey: ["kdom-children", parentKdom?.id],
      });
      toast({
        title: "Sub-K-Dom created successfully!",
        description: "Your new sub-page has been submitted for review.",
        status: "success",
        duration: 5000,
      });
      navigate(`/kdom/${slug}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to create sub-K-Dom",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
      });
    },
  });

  // Loading state
  if (isParentLoading) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl">
          <VStack spacing={8} py={8}>
            <Spinner size="xl" />
            <Text>Loading parent K-Dom...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Error state
  if (parentError || !parentKdom) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl">
          <Alert status="error" mt={8}>
            <AlertIcon />
            Parent K-Dom not found or you don't have permission to create
            sub-pages.
          </Alert>
        </Container>
      </Box>
    );
  }

  // Permission check
  if (
    parentKdom.userId !== user?.id &&
    !parentKdom.collaborators?.includes(user?.id || 0) &&
    user?.role !== "admin" &&
    user?.role !== "moderator"
  ) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl">
          <Alert status="error" mt={8}>
            <AlertIcon />
            You don't have permission to create sub-pages for this K-Dom.
          </Alert>
        </Container>
      </Box>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validări
    if (!formData.title.trim()) {
      toast({
        title: "Title is required",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Description is required",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (!formData.contentHtml.trim()) {
      toast({
        title: "Content is required",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (!formData.theme) {
      toast({
        title: "Please select a theme",
        status: "error",
        duration: 3000,
      });
      return;
    }

    const createData: KDomSubCreateDto = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      contentHtml: formData.contentHtml,
      theme: formData.theme as KDomTheme,
    };

    createMutation.mutate(createData);
  };

  const canSubmit =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.contentHtml.trim() &&
    formData.theme;

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
            <BreadcrumbLink as={RouterLink} to={`/kdoms/${parentKdom.slug}`}>
              {parentKdom.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>Create Sub-Page</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <Card mb={6}>
          <CardHeader>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <VStack align="start" spacing={2}>
                <HStack spacing={3}>
                  <Icon as={FiPlus} boxSize={6} color="green.500" />
                  <Heading size="lg">Create Sub-K-Dom</Heading>
                </HStack>
                <Text color="gray.600">
                  Create a new sub-page under{" "}
                  <strong>{parentKdom.title}</strong>
                </Text>
              </VStack>

              <HStack spacing={3}>
                <Button
                  leftIcon={<FiArrowLeft />}
                  as={RouterLink}
                  to={`/kdoms/${parentKdom.slug}`}
                  variant="outline"
                >
                  Back to Parent
                </Button>
              </HStack>
            </Flex>
          </CardHeader>
        </Card>

        {/* Parent Info */}
        <Card mb={6} bg="blue.50" borderColor="blue.200">
          <CardBody>
            <VStack align="start" spacing={3}>
              <HStack spacing={2}>
                <Icon as={FiInfo} color="blue.500" />
                <Text fontWeight="bold" color="blue.700">
                  Sub-page inheritance
                </Text>
              </HStack>
              <Text fontSize="sm" color="blue.600">
                Your sub-page will inherit the following settings from the
                parent K-Dom:
              </Text>
              <HStack spacing={4} flexWrap="wrap">
                <Badge colorScheme="blue" px={3} py={1}>
                  Hub: {parentKdom.hub}
                </Badge>
                <Badge colorScheme="green" px={3} py={1}>
                  Language: {parentKdom.language}
                </Badge>
                {parentKdom.isForKids && (
                  <Badge colorScheme="orange" px={3} py={1}>
                    Child-friendly
                  </Badge>
                )}
              </HStack>
              <Text fontSize="sm" color="blue.600">
                You can choose your own theme and content, but other settings
                will match the parent.
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Form */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap={6}>
          <GridItem>
            <Card>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  {/* Title */}
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold" fontSize="lg">
                      Sub-page Title
                    </FormLabel>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter a descriptive title for your sub-page"
                      size="lg"
                    />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      This will be the main heading of your sub-page
                    </Text>
                  </FormControl>

                  {/* Description */}
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold" fontSize="lg">
                      Description
                    </FormLabel>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Briefly describe what this sub-page will cover..."
                      minH="100px"
                      resize="vertical"
                    />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Help readers understand what this sub-page is about
                    </Text>
                  </FormControl>

                  {/* Theme Selection */}
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold" fontSize="lg">
                      Theme
                    </FormLabel>
                    <Select
                      value={formData.theme}
                      onChange={(e) =>
                        handleInputChange("theme", e.target.value)
                      }
                      placeholder="Choose a visual theme"
                      size="lg"
                    >
                      {themes.map((theme) => (
                        <option key={theme} value={theme}>
                          {theme}
                        </option>
                      ))}
                    </Select>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      The visual style for your sub-page (can be different from
                      parent)
                    </Text>
                  </FormControl>

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
                        {formData.contentHtml ? (
                          <KDomContent
                            content={formData.contentHtml}
                            theme={(formData.theme as KDomTheme) || "Light"}
                          />
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
                          content={formData.contentHtml}
                          onChange={(html) =>
                            handleInputChange("contentHtml", html)
                          }
                          placeholder="Start writing your sub-page content..."
                        />
                      </Box>
                    )}
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      Write the main content for your sub-page. You can include
                      text, images, links, and formatting.
                    </Text>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Hierarchy Preview */}
              <Card>
                <CardHeader>
                  <HStack spacing={2}>
                    <Icon as={FiArrowRight} color="purple.500" />
                    <Heading size="md">Page Hierarchy</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <HStack spacing={2}>
                      <Text fontWeight="bold" color="blue.600">
                        {parentKdom.title}
                      </Text>
                      <Text color="gray.500">(Parent)</Text>
                    </HStack>
                    <HStack spacing={2} pl={4}>
                      <Icon as={FiArrowRight} color="gray.400" size={16} />
                      <Text fontWeight="semibold" color="green.600">
                        {formData.title || "Your Sub-page"}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        (New)
                      </Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Action Panel */}
              <Card>
                <CardHeader>
                  <Heading size="md">Ready to Create?</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <VStack align="start" spacing={2} fontSize="sm">
                      <HStack spacing={2}>
                        <Icon
                          as={formData.title ? FiCheck : FiX}
                          color={formData.title ? "green.500" : "gray.400"}
                          size={16}
                        />
                        <Text color={formData.title ? "green.600" : "gray.500"}>
                          Title provided
                        </Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Icon
                          as={formData.description ? FiCheck : FiX}
                          color={
                            formData.description ? "green.500" : "gray.400"
                          }
                          size={16}
                        />
                        <Text
                          color={
                            formData.description ? "green.600" : "gray.500"
                          }
                        >
                          Description added
                        </Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Icon
                          as={formData.theme ? FiCheck : FiX}
                          color={formData.theme ? "green.500" : "gray.400"}
                          size={16}
                        />
                        <Text color={formData.theme ? "green.600" : "gray.500"}>
                          Theme selected
                        </Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Icon
                          as={formData.contentHtml ? FiCheck : FiX}
                          color={
                            formData.contentHtml ? "green.500" : "gray.400"
                          }
                          size={16}
                        />
                        <Text
                          color={
                            formData.contentHtml ? "green.600" : "gray.500"
                          }
                        >
                          Content written
                        </Text>
                      </HStack>
                    </VStack>

                    <Divider />

                    <VStack spacing={3} align="stretch">
                      <Button
                        leftIcon={<FiSave />}
                        colorScheme="green"
                        size="lg"
                        onClick={handleSubmit}
                        isLoading={createMutation.isPending}
                        loadingText="Creating..."
                        isDisabled={!canSubmit}
                      >
                        Create Sub-Page
                      </Button>
                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        Your sub-page will be submitted for moderation
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Tips */}
              <Card bg="yellow.50" borderColor="yellow.200">
                <CardHeader>
                  <HStack spacing={2}>
                    <Icon as={FiInfo} color="yellow.600" />
                    <Heading size="sm" color="yellow.700">
                      Tips for Great Sub-pages
                    </Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack
                    align="start"
                    spacing={2}
                    fontSize="sm"
                    color="yellow.700"
                  >
                    <Text>• Choose a specific, descriptive title</Text>
                    <Text>
                      • Focus on a particular aspect of the parent topic
                    </Text>
                    <Text>• Include relevant links and references</Text>
                    <Text>• Use clear headings and structure</Text>
                    <Text>• Add images or media when appropriate</Text>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>

        {/* Footer Actions */}
        <Card mt={6}>
          <CardBody>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <Text fontSize="sm" color="gray.600">
                Sub-pages help organize related content and make it easier for
                users to find specific information.
              </Text>
              <HStack spacing={3}>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/kdoms/slug/${slug}`)}
                  isDisabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  leftIcon={<FiSave />}
                  colorScheme="green"
                  onClick={handleSubmit}
                  isLoading={createMutation.isPending}
                  loadingText="Creating..."
                  isDisabled={!canSubmit}
                >
                  Create Sub-K-Dom
                </Button>
              </HStack>
            </Flex>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
