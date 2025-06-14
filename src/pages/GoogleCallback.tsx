// src/pages/auth/GoogleCallback.tsx
// Pagina care procesează callback-ul OAuth de la Google - Chakra UI

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Center,
  Icon,
} from "@chakra-ui/react";
import { FiCheck } from "react-icons/fi";
import { GrFormClose } from "react-icons/gr";
import { useGoogleOAuth } from "@/hooks/useGoogleOAuth";
import { OAuthService } from "@/api/oauth";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleGoogleCallback } = useGoogleOAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Verifică dacă există eroare în URL
        if (OAuthService.hasAuthError(window.location.href)) {
          const error = OAuthService.getAuthError(window.location.href);
          throw new Error(error || "Authentication cancelled");
        }

        // Extract authorization code
        const code = searchParams.get("code");
        if (!code) {
          throw new Error("Authorization code missing");
        }

        // Process authentication
        await handleGoogleCallback(code);

        setStatus("success");

        // Redirect after a short pause
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error"
        );

        // Redirect to login after error
        setTimeout(() => {
          navigate("/auth/login", { replace: true });
        }, 3000);
      }
    };

    processCallback();
  }, [searchParams, handleGoogleCallback, navigate]);

  return (
    <Box minH="100vh" bg="gray.50" py={20}>
      <Container maxW="md">
        <Center>
          <Box
            bg="white"
            rounded="lg"
            shadow="md"
            p={8}
            textAlign="center"
            w="full"
          >
            <VStack spacing={6}>
              {status === "loading" && (
                <>
                  <Spinner size="xl" color="blue.500" thickness="4px" />
                  <VStack spacing={2}>
                    <Heading size="lg" color="gray.900">
                      Processing authentication...
                    </Heading>
                    <Text color="gray.600">Please wait a few seconds.</Text>
                  </VStack>
                </>
              )}

              {status === "success" && (
                <>
                  <Box
                    w={12}
                    h={12}
                    bg="green.100"
                    rounded="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiCheck} w={6} h={6} color="green.600" />
                  </Box>
                  <VStack spacing={2}>
                    <Heading size="lg" color="gray.900">
                      Authentication successful!
                    </Heading>
                    <Text color="gray.600">
                      You will be redirected shortly...
                    </Text>
                  </VStack>
                </>
              )}

              {status === "error" && (
                <>
                  <Box
                    w={12}
                    h={12}
                    bg="red.100"
                    rounded="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={GrFormClose} w={6} h={6} color="red.600" />
                  </Box>
                  <VStack spacing={4}>
                    <Heading size="lg" color="gray.900">
                      Authentication error
                    </Heading>
                    <Alert status="error" variant="subtle">
                      <AlertIcon />
                      <AlertDescription>
                        {errorMessage || "An unexpected error occurred."}
                      </AlertDescription>
                    </Alert>
                    <Text fontSize="sm" color="gray.500">
                      You will be redirected to the login page...
                    </Text>
                  </VStack>
                </>
              )}
            </VStack>
          </Box>
        </Center>
      </Container>
    </Box>
  );
}
