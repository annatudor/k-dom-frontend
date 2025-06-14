// src/components/auth/GoogleAuthButton.tsx
// Componenta buton pentru autentificare cu Google - Chakra UI actualizată

import {
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  IconButton,
} from "@chakra-ui/react";
import { GrFormClose } from "react-icons/gr";
import { useGoogleOAuth } from "@/hooks/useGoogleOAuth";

interface GoogleAuthButtonProps {
  variant?: "signin" | "signup";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  showErrorInline?: boolean;
}

export function GoogleAuthButton({
  variant = "signin",
  size = "md",
  disabled = false,
  showErrorInline = true,
}: GoogleAuthButtonProps) {
  const {
    initiateGoogleAuth,
    isLoading,
    errorMessage,
    isConfigValid,
    clearError,
  } = useGoogleOAuth();

  const buttonText =
    variant === "signin" ? "Continue with Google" : "Sign up with Google";

  const handleClick = () => {
    if (!disabled && !isLoading) {
      clearError(); // Curăță erorile anterioare
      initiateGoogleAuth();
    }
  };

  if (!isConfigValid) {
    return (
      <Alert status="error" size="sm">
        <AlertIcon />
        <AlertDescription fontSize="sm">
          Google OAuth is not configured properly. Please contact administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size={size}
        width="full"
        onClick={handleClick}
        isDisabled={disabled || isLoading || !isConfigValid}
        isLoading={isLoading}
        loadingText="Connecting..."
        spinner={<Spinner size="sm" />}
        leftIcon={!isLoading ? <GoogleIcon /> : undefined}
        bg="white"
        borderColor="gray.300"
        color="gray.700"
        fontWeight="medium"
        _hover={{
          bg: "gray.50",
          borderColor: "gray.400",
          transform: "translateY(-1px)",
          shadow: "md",
        }}
        _active={{
          bg: "gray.100",
          transform: "translateY(0)",
        }}
        _disabled={{
          opacity: 0.6,
          cursor: "not-allowed",
          _hover: {
            transform: "none",
            shadow: "none",
          },
        }}
        transition="all 0.2s"
      >
        {!isLoading && buttonText}
      </Button>

      {showErrorInline && errorMessage && (
        <Alert status="error" size="sm" mt={2}>
          <AlertIcon />
          <AlertDescription fontSize="sm" flex="1">
            {errorMessage}
          </AlertDescription>
          <IconButton
            size="xs"
            variant="ghost"
            colorScheme="red"
            aria-label="Close error"
            icon={<GrFormClose />}
            onClick={clearError}
          />
        </Alert>
      )}
    </>
  );
}

// Iconița Google SVG
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="flex-shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
