// src/pages/EditKDomPage.tsx - Actualizat cu useKDomPermissions
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Button,
  Text,
  Alert,
  AlertIcon,
  Spinner,
  Badge,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Textarea,
  Checkbox,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiSave,
  FiEye,
  FiClock,
  FiAlertCircle,
  FiCheck,
  FiSettings,
  FiLock,
  FiShield,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

import { getKDomBySlug, editKDomBySlug } from "@/api/kdom";
import { useKDomPermissions } from "@/hooks/useKDomPermissions";
import { TiptapEditor } from "@/components/editor/TipTapEditor";
import { useAutosave } from "@/hooks/useAutosave";
import { KDomContent } from "@/components/kdom/kdom-components/KDomContent";
import type { KDomEditDto } from "@/types/KDom";

export default function EditKDomPage() {
  const { slug } = useParams<{ slug: string }>();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [editNote, setEditNote] = useState("");
  const [isMinorEdit, setIsMinorEdit] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const {
    isOpen: isEditNoteOpen,
    onOpen: onEditNoteOpen,
    onClose: onEditNoteClose,
  } = useDisclosure();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Query pentru detaliile K-Dom-ului
  const {
    data: kdom,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kdom", slug],
    queryFn: () => getKDomBySlug(slug!),
    enabled: !!slug,
  });

  // ✅ FOLOSIM NOUL HOOK PENTRU PERMISIUNI
  const permissions = useKDomPermissions(kdom);

  // Mutation pentru editarea K-Dom-ului
  const editMutation = useMutation({
    mutationFn: (data: KDomEditDto) => editKDomBySlug(slug!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kdom", slug] });
      toast({
        title: "Changes saved successfully",
        status: "success",
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save changes",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
      });
    },
  });

  // Inițializăm conținutul când se încarcă K-Dom-ul
  useEffect(() => {
    if (kdom && !content) {
      setContent(kdom.contentHtml || "");
    }
  }, [kdom, content]);

  // Hook pentru autosave
  const autosave = useAutosave({
    kdomSlug: slug!,
    content,
    initialContent: kdom?.contentHtml || "",
    onSave: editMutation.mutateAsync,
    enabled: !!kdom && permissions.canEdit,
  });

  // Funcția pentru salvarea manuală
  const handleManualSave = async () => {
    if (!editNote.trim()) {
      onEditNoteOpen();
      return;
    }

    try {
      await autosave.saveNow(editNote, isMinorEdit);
      setEditNote("");
      setIsMinorEdit(false);
      onEditNoteClose();
    } catch {
      // Error-ul este deja gestionat în mutation
    }
  };

  const handleSaveWithNote = async () => {
    try {
      await autosave.saveNow(editNote || "Manual save", isMinorEdit);
      setEditNote("");
      setIsMinorEdit(false);
      onEditNoteClose();
    } catch {
      // Error-ul este deja gestionat în mutation
    }
  };

  // ✅ VERIFICĂRI DE SECURITATE CU NOUL HOOK
  if (isLoading) {
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

  if (error || !kdom) {
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

  // ✅ VERIFICARE PERMISIUNI CENTRALIZATĂ
  if (!permissions.canEdit) {
    return (
      <Box minH="100vh" bg={bgColor} pt="80px">
        <Container maxW="container.xl">
          <Alert status="error" mt={8} borderRadius="lg">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">Access Denied</Text>
              <Text>{permissions.reason}</Text>
              <Text fontSize="sm" color="gray.600">
                Current role: {permissions.role}
              </Text>
              <Button
                as={RouterLink}
                to={`/kdoms/slug/${slug}`}
                colorScheme="blue"
                size="sm"
                mt={2}
              >
                Return to K-Dom
              </Button>
            </VStack>
          </Alert>
        </Container>
      </Box>
    );
  }

  // ✅ HELPER PENTRU CULOAREA ROLULUI
  const getRoleColor = () => {
    switch (permissions.role) {
      case "owner":
        return "gold";
      case "collaborator":
        return "purple";
      case "admin":
        return "red";
      case "moderator":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg={bgColor}
      overflowY="auto"
      zIndex={1}
      pt="80px"
    >
      <Box w="100vw" px={8} py={6}>
        {/* Breadcrumb */}
        <Breadcrumb mb={6} fontSize="sm" flexShrink={0}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to={`/kdom/slug/${kdom.slug}`}>
              {kdom.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>Edit</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Container pentru conținut */}
        <Box w="100%">
          {/* Header cu informații despre permisiuni */}
          <Box
            bg={cardBg}
            borderRadius="lg"
            p={6}
            mb={6}
            borderWidth="1px"
            borderColor={borderColor}
            flexShrink={0}
          >
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <VStack align="start" spacing={3}>
                <Heading size="lg">Edit: {kdom.title}</Heading>
                <HStack spacing={4} flexWrap="wrap">
                  <Badge colorScheme="blue">{kdom.hub}</Badge>
                  <Badge colorScheme="green">{kdom.language}</Badge>
                  {kdom.isForKids && (
                    <Badge colorScheme="orange">Child-friendly</Badge>
                  )}
                  {/* ✅ BADGE PENTRU ROL */}
                  <Badge colorScheme={getRoleColor()}>
                    {permissions.role === "owner" ? (
                      <FiShield style={{ marginRight: "0.25em" }} />
                    ) : permissions.role === "admin" ||
                      permissions.role === "moderator" ? (
                      <FiLock style={{ marginRight: "0.25em" }} />
                    ) : null}
                    {permissions.role.charAt(0).toUpperCase() +
                      permissions.role.slice(1)}
                  </Badge>
                </HStack>
                {/* ✅ AFIȘĂM MOTIVUL PERMISIUNII */}
                <Text fontSize="sm" color="gray.600">
                  {permissions.reason}
                </Text>
              </VStack>

              {/* Status și acțiuni */}
              <VStack align="end" spacing={2}>
                {/* Status autosave */}
                <HStack spacing={2}>
                  {autosave.isSaving && (
                    <HStack spacing={1} color="blue.500">
                      <Spinner size="sm" />
                      <Text fontSize="sm">Saving...</Text>
                    </HStack>
                  )}
                  {autosave.lastSaved && !autosave.isSaving && (
                    <HStack spacing={1} color="green.500">
                      <FiCheck size={16} />
                      <Text fontSize="sm">
                        Saved {autosave.lastSaved.toLocaleTimeString()}
                      </Text>
                    </HStack>
                  )}
                  {autosave.hasUnsavedChanges && !autosave.isSaving && (
                    <HStack spacing={1} color="orange.500">
                      <FiAlertCircle size={16} />
                      <Text fontSize="sm">Unsaved changes</Text>
                    </HStack>
                  )}
                  {autosave.error && (
                    <HStack spacing={1} color="red.500">
                      <FiAlertCircle size={16} />
                      <Text fontSize="sm">Save failed</Text>
                    </HStack>
                  )}
                </HStack>

                {/* Butoane acțiuni */}
                <HStack spacing={2}>
                  <Button
                    leftIcon={<FiEye />}
                    variant={previewMode ? "solid" : "outline"}
                    colorScheme="blue"
                    onClick={() => setPreviewMode(!previewMode)}
                    size="sm"
                  >
                    {previewMode ? "Edit" : "Preview"}
                  </Button>
                  {/* ✅ AFIȘĂM BUTONUL DOAR DACĂ POATE VEDEA ISTORICUL */}
                  {permissions.canViewEditHistory && (
                    <Button
                      leftIcon={<FiClock />}
                      variant="outline"
                      size="sm"
                      as={RouterLink}
                      to={`/kdom/${slug}/history`}
                    >
                      History
                    </Button>
                  )}
                  {/* ✅ AFIȘĂM BUTONUL DOAR DACĂ POATE EDITA METADATA */}
                  {permissions.canEditMetadata && (
                    <Button
                      leftIcon={<FiSettings />}
                      variant="outline"
                      size="sm"
                      as={RouterLink}
                      to={`/kdom/${slug}/metadata`}
                    >
                      Settings
                    </Button>
                  )}
                  <Button
                    leftIcon={<FiSave />}
                    colorScheme="green"
                    onClick={handleManualSave}
                    isLoading={editMutation.isPending}
                    size="sm"
                  >
                    Save
                  </Button>
                </HStack>
              </VStack>
            </Flex>
          </Box>

          {/* Conținutul principal */}
          <Box
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            height="calc(100vh - 280px)"
            display="flex"
            flexDirection="column"
          >
            <Tabs
              index={previewMode ? 1 : 0}
              variant="enclosed"
              display="flex"
              flexDirection="column"
              height="100%"
            >
              <TabList flexShrink={0}>
                <Tab onClick={() => setPreviewMode(false)}>
                  <HStack spacing={2}>
                    <FiSettings size={16} />
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

              <TabPanels flex="1" display="flex" overflow="hidden">
                {/* Tab Editor */}
                <TabPanel
                  p={0}
                  display="flex"
                  flexDirection="column"
                  height="100%"
                  width="100%"
                >
                  <Box
                    flex="1"
                    overflow="hidden"
                    position="relative"
                    sx={{
                      "& .ProseMirror-focused": {
                        outline: "none",
                      },
                      "& .ProseMirror": {
                        height: "100%",
                        padding: "1rem",
                        border: "none",
                        outline: "none",
                        overflow: "auto",
                      },
                    }}
                  >
                    <TiptapEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Start editing your K-Dom content..."
                    />
                  </Box>

                  {/* Form pentru descrierea schimbărilor */}
                  {!previewMode && (
                    <Box
                      p={6}
                      borderTop="1px"
                      borderColor={borderColor}
                      bg={cardBg}
                      flexShrink={0}
                      maxHeight="200px"
                      overflowY="auto"
                    >
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Describe what you changed
                          </FormLabel>
                          <Textarea
                            placeholder="Describe what you changed..."
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            size="sm"
                            resize="vertical"
                            minH="80px"
                            maxH="120px"
                          />
                        </FormControl>

                        <HStack justify="space-between" align="center">
                          <Checkbox
                            isChecked={isMinorEdit}
                            onChange={(e) => setIsMinorEdit(e.target.checked)}
                            size="sm"
                          >
                            This is a minor edit
                          </Checkbox>

                          <HStack spacing={2}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditNote("");
                                setIsMinorEdit(false);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              colorScheme="green"
                              size="sm"
                              leftIcon={<FiSave />}
                              onClick={handleSaveWithNote}
                              isLoading={editMutation.isPending}
                              isDisabled={!editNote.trim()}
                            >
                              Save
                            </Button>
                          </HStack>
                        </HStack>

                        <Text fontSize="xs" color="gray.500">
                          Please note that all contributions to the K-Dom are
                          considered to be released under the CC-BY-SA license.
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </TabPanel>

                {/* Tab Preview */}
                <TabPanel
                  p={0}
                  display="flex"
                  flexDirection="column"
                  height="100%"
                  width="100%"
                >
                  <Box p={6} flex="1" overflowY="auto" height="100%">
                    {content ? (
                      <KDomContent content={content} theme={kdom.theme} />
                    ) : (
                      <VStack py={12} spacing={4} color="gray.500">
                        <FiEye size={48} />
                        <Text fontSize="lg">No content to preview</Text>
                        <Text>Switch to edit mode to add content</Text>
                      </VStack>
                    )}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Footer cu informații */}
          <Box
            mt={6}
            p={4}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            flexShrink={0}
          >
            <HStack justify="space-between" wrap="wrap" gap={4}>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="gray.600">
                  <strong>Last edited:</strong>{" "}
                  {kdom.lastEditedAt
                    ? new Date(kdom.lastEditedAt).toLocaleString()
                    : "Never"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Created:</strong>{" "}
                  {new Date(kdom.createdAt).toLocaleString()}
                </Text>
                {/* ✅ AFIȘĂM INFORMAȚII DESPRE PERMISIUNI */}
                <Text fontSize="sm" color="gray.600">
                  <strong>Your permissions:</strong> {permissions.role} (
                  {permissions.canEditMetadata ? "full access" : "content only"}
                  )
                </Text>
              </VStack>
              <VStack align="end" spacing={1}>
                <Text fontSize="xs" color="gray.500">
                  Changes are automatically saved as you type
                </Text>
                {!permissions.canEditMetadata && (
                  <Text fontSize="xs" color="orange.600">
                    Note: You can edit content but not K-Dom settings
                  </Text>
                )}
              </VStack>
            </HStack>
          </Box>
        </Box>
      </Box>

      {/* Modal pentru edit note */}
      <Modal isOpen={isEditNoteOpen} onClose={onEditNoteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Save Changes</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Edit Summary</FormLabel>
                <Textarea
                  placeholder="Describe what you changed..."
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Checkbox
                  isChecked={isMinorEdit}
                  onChange={(e) => setIsMinorEdit(e.target.checked)}
                >
                  This is a minor edit
                </Checkbox>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Minor edits include typo fixes, formatting, and small changes
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditNoteClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={handleSaveWithNote}
              isLoading={editMutation.isPending}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
