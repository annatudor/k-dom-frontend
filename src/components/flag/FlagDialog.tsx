// src/components/flag/FlagDialog.tsx - Updated with improved logic
import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  RadioGroup,
  Radio,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Icon,
  useColorModeValue,
  Badge,
  Progress,
} from "@chakra-ui/react";
import { FiFlag, FiAlertTriangle, FiShield, FiCheck } from "react-icons/fi";
import { useCreateFlag } from "@/hooks/useFlags";
import { useAuth } from "@/context/AuthContext";
import { getApplicableReasons } from "@/types/Flag";
import type { FlagDialogProps, ContentType } from "@/types/Flag";

export function FlagDialog({
  contentType,
  contentId,
  contentTitle,
  contentOwnerId,
  isOpen,
  onClose,
  onSuccess,
}: FlagDialogProps) {
  const { user } = useAuth();
  const { submitFlag, isSubmitting } = useCreateFlag();

  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [step, setStep] = useState<"select" | "confirm" | "success">("select");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const overlayBg = useColorModeValue("blackAlpha.300", "blackAlpha.600");
  const contentBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Get applicable reasons for this content type
  const applicableReasons = getApplicableReasons(contentType);

  // Check if user is trying to report their own content
  const isOwnContent = user?.id === contentOwnerId;

  const selectedReasonData = applicableReasons.find(
    (r) => r.id === selectedReason
  );
  const finalReason =
    selectedReason === "other"
      ? customReason.trim()
      : selectedReasonData?.label || "";

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    setStep("select");
    setSubmitError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedReason) return;

    const reason =
      selectedReason === "other"
        ? customReason.trim()
        : selectedReasonData?.label || "";

    if (!reason) return;

    setSubmitError(null);

    try {
      await submitFlag({
        contentType: contentType as ContentType,
        contentId,
        reason,
      });

      setStep("success");
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 2000);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit report. Please try again."
      );
    }
  };

  const handleContinue = () => {
    if (!canSubmit) return;
    setStep("confirm");
  };

  const canSubmit =
    selectedReason &&
    (selectedReason !== "other" || customReason.trim().length >= 10);

  // Helper function to get content type display name
  const getContentTypeDisplayName = (type: string) => {
    switch (type) {
      case "KDom":
        return "K-Dom";
      case "Post":
        return "Post";
      case "Comment":
        return "Comment";
      default:
        return type;
    }
  };

  // Not authenticated
  if (!user) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay bg={overlayBg} />
        <ModalContent bg={contentBg}>
          <ModalHeader>
            <HStack spacing={3}>
              <Icon as={FiShield} color="blue.500" />
              <Text>Authentication Required</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <AlertTitle>Please log in to report content</AlertTitle>
                <AlertDescription>
                  You need to be logged in to flag inappropriate content.
                </AlertDescription>
              </VStack>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  // User trying to report own content
  if (isOwnContent) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay bg={overlayBg} />
        <ModalContent bg={contentBg}>
          <ModalHeader>
            <HStack spacing={3}>
              <Icon as={FiAlertTriangle} color="orange.500" />
              <Text>Cannot Report Own Content</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" borderRadius="lg">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <AlertTitle>You cannot report your own content</AlertTitle>
                <AlertDescription>
                  If you want to remove or edit this content, use the edit or
                  delete options instead.
                </AlertDescription>
              </VStack>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="blue" onClick={onClose}>
                Got it
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay bg={overlayBg} />
      <ModalContent bg={contentBg} mx={4}>
        <ModalHeader pb={4}>
          <HStack spacing={3} align="center">
            <Icon
              as={step === "success" ? FiCheck : FiFlag}
              color={step === "success" ? "green.500" : "red.500"}
              boxSize={6}
            />
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="bold">
                {step === "success"
                  ? "Report Submitted"
                  : step === "confirm"
                  ? "Confirm Report"
                  : `Report ${getContentTypeDisplayName(contentType)}`}
              </Text>
              {contentTitle && step !== "success" && (
                <Text fontSize="sm" color="gray.500" fontWeight="normal">
                  Reporting: {contentTitle}
                </Text>
              )}
            </VStack>
          </HStack>

          {/* Progress indicator */}
          {step !== "success" && (
            <Box mt={4}>
              <Progress
                value={step === "select" ? 50 : 100}
                colorScheme="red"
                size="sm"
                borderRadius="full"
              />
              <HStack
                justify="space-between"
                mt={1}
                fontSize="xs"
                color="gray.500"
              >
                <Text>Select Reason</Text>
                <Text>Confirm</Text>
              </HStack>
            </Box>
          )}
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody pb={6}>
          {step === "select" && (
            <VStack spacing={6} align="stretch">
              {/* Info Alert */}
              <Alert status="info" borderRadius="lg" size="sm">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="semibold">
                    Help us maintain a safe community
                  </Text>
                  <Text fontSize="sm">
                    Your report will be reviewed by our moderation team. False
                    reports may result in account restrictions.
                  </Text>
                </VStack>
              </Alert>

              {/* Content Info */}
              <Box
                p={4}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
              >
                <VStack align="start" spacing={2}>
                  <HStack spacing={2}>
                    <Badge
                      colorScheme={
                        contentType === "KDom"
                          ? "purple"
                          : contentType === "Post"
                          ? "blue"
                          : "green"
                      }
                      variant="subtle"
                    >
                      {getContentTypeDisplayName(contentType)}
                    </Badge>
                    <Text fontSize="sm" fontWeight="semibold">
                      ID: {contentId}
                    </Text>
                  </HStack>
                  {contentTitle && (
                    <Text fontSize="sm" color="gray.600">
                      "{contentTitle}"
                    </Text>
                  )}
                </VStack>
              </Box>

              {/* Reason Selection */}
              <VStack align="stretch" spacing={4}>
                <Text fontSize="md" fontWeight="semibold">
                  Why are you reporting this{" "}
                  {getContentTypeDisplayName(contentType).toLowerCase()}?
                </Text>

                <RadioGroup value={selectedReason} onChange={setSelectedReason}>
                  <VStack align="stretch" spacing={3}>
                    {applicableReasons.map((reason) => (
                      <Box
                        key={reason.id}
                        p={3}
                        borderWidth="1px"
                        borderColor={
                          selectedReason === reason.id ? "red.300" : borderColor
                        }
                        borderRadius="lg"
                        cursor="pointer"
                        _hover={{ borderColor: "red.200", bg: "red.50" }}
                        onClick={() => setSelectedReason(reason.id)}
                        transition="all 0.2s"
                      >
                        <Radio value={reason.id} colorScheme="red">
                          <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                              <Text fontWeight="semibold">{reason.label}</Text>
                              <Badge
                                size="xs"
                                colorScheme={
                                  reason.category === "harmful"
                                    ? "red"
                                    : reason.category === "spam"
                                    ? "orange"
                                    : reason.category === "inappropriate"
                                    ? "yellow"
                                    : "gray"
                                }
                              >
                                {reason.category}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              {reason.description}
                            </Text>
                          </VStack>
                        </Radio>
                      </Box>
                    ))}
                  </VStack>
                </RadioGroup>

                {/* Custom Reason Input */}
                {selectedReason === "other" && (
                  <VStack align="stretch" spacing={2}>
                    <Text fontSize="sm" fontWeight="semibold">
                      Please describe the issue:
                    </Text>
                    <Textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder={`Describe why this ${getContentTypeDisplayName(
                        contentType
                      ).toLowerCase()} should be removed...`}
                      rows={3}
                      maxLength={500}
                    />
                    <HStack justify="space-between">
                      <Text fontSize="xs" color="gray.500">
                        {customReason.length}/500 characters
                      </Text>
                      {selectedReason === "other" &&
                        customReason.length < 10 && (
                          <Text fontSize="xs" color="red.500">
                            At least 10 characters required
                          </Text>
                        )}
                    </HStack>
                  </VStack>
                )}
              </VStack>
            </VStack>
          )}

          {step === "confirm" && (
            <VStack spacing={6} align="stretch">
              <Alert status="warning" borderRadius="lg">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <AlertTitle>Confirm Report</AlertTitle>
                  <AlertDescription>
                    Are you sure you want to report this{" "}
                    {getContentTypeDisplayName(contentType).toLowerCase()} for:
                    "{finalReason}"?
                  </AlertDescription>
                </VStack>
              </Alert>

              <Box
                p={4}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
              >
                <VStack align="start" spacing={2}>
                  <Text fontWeight="semibold">Report Summary:</Text>
                  <Text fontSize="sm">
                    Content Type: {getContentTypeDisplayName(contentType)}
                  </Text>
                  <Text fontSize="sm">Reason: {finalReason}</Text>
                  {contentTitle && (
                    <Text fontSize="sm">Content: "{contentTitle}"</Text>
                  )}
                </VStack>
              </Box>

              {submitError && (
                <Alert status="error" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <AlertTitle>Submission Failed</AlertTitle>
                    <AlertDescription>{submitError}</AlertDescription>
                  </VStack>
                </Alert>
              )}
            </VStack>
          )}

          {step === "success" && (
            <VStack spacing={6} align="center" py={8}>
              <Icon as={FiCheck} color="green.500" boxSize={16} />
              <VStack spacing={2} textAlign="center">
                <Text fontSize="lg" fontWeight="bold" color="green.600">
                  Report Submitted Successfully
                </Text>
                <Text fontSize="sm" color="gray.600" maxW="sm">
                  Thank you for helping keep our community safe. Our moderation
                  team will review this report.
                </Text>
              </VStack>
            </VStack>
          )}
        </ModalBody>

        {step !== "success" && (
          <ModalFooter>
            <HStack spacing={3}>
              <Button
                variant="ghost"
                onClick={handleClose}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
              {step === "select" && (
                <Button
                  colorScheme="red"
                  onClick={handleContinue}
                  isDisabled={!canSubmit}
                  leftIcon={<FiFlag />}
                >
                  Continue
                </Button>
              )}
              {step === "confirm" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setStep("select")}
                    isDisabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    loadingText="Submitting..."
                    leftIcon={<FiFlag />}
                  >
                    Submit Report
                  </Button>
                </>
              )}
            </HStack>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
