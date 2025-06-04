import { useState, useEffect } from "react";
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
  Checkbox,
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
} from "@chakra-ui/react";
import { FiSave, FiArrowLeft, FiSettings } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

import { getKDomBySlug, updateMetadataBySlug } from "@/api/kdom";
import { useLanguages, useHubs, useThemes } from "@/hooks/useKDomData";
import { useAuth } from "@/context/AuthContext";
import { ParentKDomSearch } from "@/components/kdom/kdom-components/ParentKDomSearch";
import type {
  KDomUpdateMetadataDto,
  Language,
  Hub,
  KDomTheme,
  KDomTagSearchResultDto,
} from "@/types/KDom";

export default function EditKDomMetadataPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const bgColor = useColorModeValue("gray.50", "gray.900");

  // Form state - fără parentId ca string
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hub: "" as Hub | "",
    language: "" as Language | "",
    theme: "" as KDomTheme | "",
    isForKids: false,
  });

  // Separate state pentru parent selection
  const [selectedParent, setSelectedParent] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Query pentru detaliile K-Dom-ului
  const {
    data: kdom,
    isLoading: isKdomLoading,
    error: kdomError,
  } = useQuery({
    queryKey: ["kdom", slug],
    queryFn: () => getKDomBySlug(slug!),
    enabled: !!slug,
  });

  // Queries pentru opțiuni
  const { data: languages = [] } = useLanguages();
  const { data: hubs = [] } = useHubs();
  const { data: themes = [] } = useThemes();

  // Mutation pentru actualizarea metadatelor
  const updateMutation = useMutation({
    mutationFn: (data: KDomUpdateMetadataDto) =>
      updateMetadataBySlug(slug!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kdom", slug] });
      toast({
        title: "Metadata updated successfully",
        status: "success",
        duration: 3000,
      });
      navigate(`/kdom/${slug}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to update metadata",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
      });
    },
  });

  // Inițializarea formularului cu datele K-Dom-ului
  useEffect(() => {
    if (kdom) {
      setFormData({
        title: kdom.title,
        description: kdom.description,
        hub: kdom.hub,
        language: kdom.language,
        theme: kdom.theme,
        isForKids: kdom.isForKids,
      });

      // TODO: Încarcă parent info dacă există
      // Momentan setăm null, dar în viitor poți face un query pentru parent details
      if (kdom.parentId) {
        // Aici ar trebui să faci un query pentru a obține detaliile parent-ului
        // Pentru acum, setăm doar ID-ul
        setSelectedParent({
          id: kdom.parentId,
          title: "Loading parent...", // Placeholder
        });
      }
    }
  }, [kdom]);

  // Verificarea permisiunilor
  if (isKdomLoading) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl">
          <VStack spacing={8} py={8}>
            <Spinner size="xl" />
            <Text>Loading K-Dom...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (kdomError || !kdom) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl">
          <Alert status="error" mt={8}>
            <AlertIcon />
            K-Dom not found or you don't have permission to edit it.
          </Alert>
        </Container>
      </Box>
    );
  }

  if (
    kdom.userId !== user?.id &&
    user?.role !== "admin" &&
    user?.role !== "moderator"
  ) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl">
          <Alert status="error" mt={8}>
            <AlertIcon />
            You don't have permission to edit this K-Dom's metadata.
          </Alert>
        </Container>
      </Box>
    );
  }

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleParentSelect = (parent: KDomTagSearchResultDto | null) => {
    if (parent) {
      setSelectedParent({
        id: parent.id,
        title: parent.title,
      });
    } else {
      setSelectedParent(null);
    }
  };

  const handleSubmit = async () => {
    // Validări de bază
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

    if (!formData.hub || !formData.language || !formData.theme) {
      toast({
        title: "Please fill in all required fields",
        status: "error",
        duration: 3000,
      });
      return;
    }

    const updateData: KDomUpdateMetadataDto = {
      kdomSlug: slug!,
      title: formData.title.trim(),
      description: formData.description.trim(),
      hub: formData.hub as Hub,
      language: formData.language as Language,
      theme: formData.theme as KDomTheme,
      isForKids: formData.isForKids,
      parentId: selectedParent?.id || undefined, // Trimite undefined în loc de null
    };

    console.log("Sending update data:", updateData);
    updateMutation.mutate(updateData);
  };

  const hasChanges =
    formData.title !== kdom.title ||
    formData.description !== kdom.description ||
    formData.hub !== kdom.hub ||
    formData.language !== kdom.language ||
    formData.theme !== kdom.theme ||
    formData.isForKids !== kdom.isForKids ||
    selectedParent?.id !== kdom.parentId;

  return (
    <Box minH="100vh" bg={bgColor} pt="80px">
      <Container maxW="container.lg" py={6}>
        {/* Breadcrumb */}
        <Breadcrumb mb={6} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to={`/kdom/${kdom.slug}`}>
              {kdom.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>Edit Metadata</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <Card mb={6}>
          <CardHeader>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <VStack align="start" spacing={2}>
                <HStack spacing={3}>
                  <FiSettings size={24} />
                  <Heading size="lg">Edit K-Dom Metadata</Heading>
                </HStack>
                <Text color="gray.600">
                  Update the basic information and hierarchy for your K-Dom
                </Text>
              </VStack>

              <HStack spacing={3}>
                <Button
                  leftIcon={<FiArrowLeft />}
                  as={RouterLink}
                  to={`/kdom/${kdom.slug}`}
                  variant="outline"
                >
                  Back to K-Dom
                </Button>
              </HStack>
            </Flex>
          </CardHeader>
        </Card>

        {/* Warning despre schimbările importante */}
        <Alert status="warning" mb={6} borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">Important Notice</Text>
            <Text fontSize="sm">
              Changes to metadata like title, hub, or language may affect how
              your K-Dom is discovered and categorized. These changes will be
              logged in the edit history.
            </Text>
          </VStack>
        </Alert>

        {/* Form */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Current Status */}
              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Current Status
                </Text>
                <HStack spacing={4} flexWrap="wrap">
                  <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                    {kdom.hub}
                  </Badge>
                  <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                    {kdom.language}
                  </Badge>
                  <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                    {kdom.theme}
                  </Badge>
                  {kdom.isForKids && (
                    <Badge
                      colorScheme="orange"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      Child-friendly
                    </Badge>
                  )}
                </HStack>
              </Box>

              <Divider />

              {/* Title */}
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter K-Dom title"
                  size="lg"
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  This is the main title that will appear across the platform
                </Text>
              </FormControl>

              {/* Description */}
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe what this K-Dom is about..."
                  minH="100px"
                  resize="vertical"
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  A clear description helps users understand what your K-Dom
                  covers
                </Text>
              </FormControl>

              {/* Parent K-Dom Search */}
              <ParentKDomSearch
                currentKDomId={kdom.id}
                selectedParentId={selectedParent?.id}
                selectedParentTitle={selectedParent?.title}
                onParentSelect={handleParentSelect}
              />

              {/* Hub Selection */}
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Hub</FormLabel>
                <Select
                  value={formData.hub}
                  onChange={(e) => handleInputChange("hub", e.target.value)}
                  placeholder="Select a hub"
                  size="lg"
                >
                  {hubs.map((hub) => (
                    <option key={hub} value={hub}>
                      {hub}
                    </option>
                  ))}
                </Select>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  The main category that best describes your K-Dom's content
                </Text>
              </FormControl>

              {/* Language Selection */}
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Language</FormLabel>
                <Select
                  value={formData.language}
                  onChange={(e) =>
                    handleInputChange("language", e.target.value)
                  }
                  placeholder="Select a language"
                  size="lg"
                >
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language === "En"
                        ? "English"
                        : language === "Ro"
                        ? "Romanian"
                        : language === "Kr"
                        ? "Korean"
                        : language === "Jp"
                        ? "Japanese"
                        : language === "Fr"
                        ? "French"
                        : language === "De"
                        ? "German"
                        : language}
                    </option>
                  ))}
                </Select>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  The primary language of your K-Dom's content
                </Text>
              </FormControl>

              {/* Theme Selection */}
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Visual Theme</FormLabel>
                <Select
                  value={formData.theme}
                  onChange={(e) => handleInputChange("theme", e.target.value)}
                  placeholder="Select a theme"
                  size="lg"
                >
                  {themes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme === "Light"
                        ? "Light Theme"
                        : theme === "Dark"
                        ? "Dark Theme"
                        : theme === "Vibrant"
                        ? "Vibrant Theme"
                        : theme === "Pastel"
                        ? "Pastel Theme"
                        : theme}
                    </option>
                  ))}
                </Select>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  The visual style that will be applied to your K-Dom
                </Text>
              </FormControl>

              {/* Child-friendly Checkbox */}
              <FormControl>
                <Checkbox
                  isChecked={formData.isForKids}
                  onChange={(e) =>
                    handleInputChange("isForKids", e.target.checked)
                  }
                  size="lg"
                >
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">
                      Directed to children under 13
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      This K-Dom contains content specifically created for
                      children
                    </Text>
                  </VStack>
                </Checkbox>
              </FormControl>

              <Divider />

              {/* Preview of Changes */}
              {hasChanges && (
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold">Changes Detected</Text>
                    <Text fontSize="sm">
                      You have unsaved changes to your K-Dom metadata. These
                      changes will be saved to the edit history.
                    </Text>
                  </VStack>
                </Alert>
              )}

              {/* Action Buttons */}
              <HStack spacing={4} justify="end" pt={4}>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/kdom/${slug}`)}
                  isDisabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  leftIcon={<FiSave />}
                  colorScheme="blue"
                  onClick={handleSubmit}
                  isLoading={updateMutation.isPending}
                  isDisabled={!hasChanges}
                  loadingText="Saving..."
                  size="lg"
                >
                  Save Changes
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Info Footer */}
        <Card mt={6}>
          <CardBody>
            <VStack align="start" spacing={3}>
              <Heading size="sm">About Metadata Changes</Heading>
              <VStack align="start" spacing={2} fontSize="sm" color="gray.600">
                <Text>
                  • <strong>Title changes</strong> will update how your K-Dom
                  appears in search results
                </Text>
                <Text>
                  • <strong>Hub changes</strong> may move your K-Dom to a
                  different category
                </Text>
                <Text>
                  • <strong>Language changes</strong> affect content
                  recommendations and discovery
                </Text>
                <Text>
                  • <strong>Parent changes</strong> update the hierarchical
                  structure
                </Text>
                <Text>
                  • All metadata changes are logged and can be viewed in the
                  edit history
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
