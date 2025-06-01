// src/components/flag/FlagButton.tsx - Button pentru deschiderea flag dialog

import {
  Button,
  IconButton,
  MenuItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FiFlag } from "react-icons/fi";

import { FlagDialog } from "./FlagDialog";
import { useAuth } from "@/context/AuthContext";
import type { FlagButtonProps } from "@/types/Flag";

export function FlagButton({
  contentType,
  contentId,
  contentTitle,
  contentOwnerId,
  variant = "ghost",
  size = "sm",
  showLabel = true,
}: FlagButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Verifică dacă este conținutul utilizatorului curent
  const isOwnContent = user?.id === contentOwnerId;

  const handleClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to report content",
        status: "info",
        duration: 4000,
      });
      return;
    }

    if (isOwnContent) {
      toast({
        title: "Cannot report own content",
        description:
          "You cannot report your own content. Use edit or delete options instead.",
        status: "warning",
        duration: 4000,
      });
      return;
    }

    onOpen();
  };

  const handleSuccess = () => {
    toast({
      title: "Report submitted",
      description:
        "Thank you for helping keep our community safe. We'll review this report.",
      status: "success",
      duration: 5000,
    });
  };

  if (showLabel) {
    return (
      <>
        <Button
          leftIcon={<FiFlag />}
          variant={variant}
          size={size}
          colorScheme="red"
          onClick={handleClick}
          _hover={{ bg: "red.50", color: "red.600" }}
        >
          Report
        </Button>
        <FlagDialog
          contentType={contentType}
          contentId={contentId}
          contentTitle={contentTitle}
          contentOwnerId={contentOwnerId}
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={handleSuccess}
        />
      </>
    );
  }

  return (
    <>
      <IconButton
        aria-label="Report content"
        icon={<FiFlag />}
        variant={variant}
        size={size}
        colorScheme="red"
        onClick={handleClick}
        _hover={{ bg: "red.50", color: "red.600" }}
      />
      <FlagDialog
        contentType={contentType}
        contentId={contentId}
        contentTitle={contentTitle}
        contentOwnerId={contentOwnerId}
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleSuccess}
      />
    </>
  );
}

// Varianta pentru MenuItem (pentru dropdown-uri)
export function FlagMenuItem({
  contentType,
  contentId,
  contentTitle,
  contentOwnerId,
  onClose,
}: FlagButtonProps & { onClose?: () => void }) {
  const { user, isAuthenticated } = useAuth();
  const { isOpen, onOpen, onClose: onDialogClose } = useDisclosure();
  const toast = useToast();

  // Verifică dacă este conținutul utilizatorului curent
  const isOwnContent = user?.id === contentOwnerId;

  const handleClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to report content",
        status: "info",
        duration: 4000,
      });
      return;
    }

    if (isOwnContent) {
      toast({
        title: "Cannot report own content",
        description:
          "You cannot report your own content. Use edit or delete options instead.",
        status: "warning",
        duration: 4000,
      });
      return;
    }

    onClose?.(); // Închide menu-ul părinte
    onOpen();
  };

  const handleSuccess = () => {
    toast({
      title: "Report submitted",
      description:
        "Thank you for helping keep our community safe. We'll review this report.",
      status: "success",
      duration: 5000,
    });
  };

  return (
    <>
      <MenuItem
        icon={<FiFlag />}
        color="red.500"
        onClick={handleClick}
        _hover={{ bg: "red.50" }}
      >
        Report Content
      </MenuItem>
      <FlagDialog
        contentType={contentType}
        contentId={contentId}
        contentTitle={contentTitle}
        contentOwnerId={contentOwnerId}
        isOpen={isOpen}
        onClose={onDialogClose}
        onSuccess={handleSuccess}
      />
    </>
  );
}
