// src/components/collaboration/CollaborationButton.tsx
import {
  Button,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { FiUserPlus, FiUsers } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { CollaborationRequestForm } from "./CollaborationRequestForm";

interface CollaborationButtonProps {
  kdomId: string;
  kdomTitle: string;
  kdomUserId: number;
  kdomCollaborators?: number[]; // Array of collaborator user IDs
  variant?: "button" | "icon";
  size?: "sm" | "md" | "lg";
  colorScheme?: string;
}

export function CollaborationButton({
  kdomId,
  kdomTitle,
  kdomUserId,
  kdomCollaborators = [],
  variant = "button",
  size = "md",
  colorScheme = "purple",
}: CollaborationButtonProps) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Check if user can request collaboration
  const canRequestCollaboration = () => {
    if (!user) return false;
    if (user.id === kdomUserId) return false; // Owner can't collaborate with themselves
    if (kdomCollaborators.includes(user.id)) return false; // Already a collaborator
    return true;
  };

  const getButtonText = () => {
    if (!user) return "Login to Collaborate";
    if (user.id === kdomUserId) return "You own this K-Dom";
    if (kdomCollaborators.includes(user.id)) return "You're a Collaborator";
    return "Request Collaboration";
  };

  const getTooltipText = () => {
    if (!user) return "Please log in to request collaboration access";
    if (user.id === kdomUserId)
      return "You cannot collaborate on your own K-Dom";
    if (kdomCollaborators.includes(user.id))
      return "You are already a collaborator on this K-Dom";
    return "Request permission to edit and contribute to this K-Dom";
  };

  const handleClick = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to request collaboration access.",
        status: "info",
        duration: 5000,
      });
      return;
    }

    if (!canRequestCollaboration()) {
      return; // Button should be disabled in this case
    }

    onOpen();
  };

  const handleSuccess = () => {
    onClose();
    toast({
      title: "Request sent successfully!",
      description: `Your collaboration request for "${kdomTitle}" has been submitted.`,
      status: "success",
      duration: 5000,
    });
  };

  const isDisabled = !canRequestCollaboration();

  if (variant === "icon") {
    return (
      <>
        <Tooltip label={getTooltipText()} hasArrow>
          <Button
            aria-label={getButtonText()}
            leftIcon={
              <Icon
                as={
                  kdomCollaborators.includes(user?.id || 0)
                    ? FiUsers
                    : FiUserPlus
                }
              />
            }
            colorScheme={colorScheme}
            variant={isDisabled ? "outline" : "solid"}
            size={size}
            onClick={handleClick}
            isDisabled={isDisabled}
            opacity={isDisabled ? 0.6 : 1}
          >
            {variant === "icon" ? "" : getButtonText()}
          </Button>
        </Tooltip>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <CollaborationRequestForm
              kdomId={kdomId}
              kdomTitle={kdomTitle}
              onSuccess={handleSuccess}
              onCancel={onClose}
            />
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Tooltip label={getTooltipText()} hasArrow isDisabled={!isDisabled}>
        <Button
          leftIcon={
            <Icon
              as={
                kdomCollaborators.includes(user?.id || 0) ? FiUsers : FiUserPlus
              }
            />
          }
          colorScheme={colorScheme}
          variant={isDisabled ? "outline" : "solid"}
          size={size}
          onClick={handleClick}
          isDisabled={isDisabled}
          opacity={isDisabled ? 0.6 : 1}
        >
          {getButtonText()}
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <CollaborationRequestForm
            kdomId={kdomId}
            kdomTitle={kdomTitle}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </ModalContent>
      </Modal>
    </>
  );
}
