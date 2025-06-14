// src/hooks/useGoogleOAuth.ts
// Hook pentru gestionarea OAuth cu Google

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { OAuthService } from "@/api/oauth";
import { buildGoogleAuthUrl, validateOAuthConfig } from "@/config/oauth";

interface UseGoogleOAuthReturn {
  isLoading: boolean;
  initiateGoogleAuth: () => void;
  handleGoogleCallback: (code: string) => Promise<void>;
  errorMessage: string | null;
  isConfigValid: boolean;
  clearError: () => void;
}

export function useGoogleOAuth(): UseGoogleOAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();

  const isConfigValid = validateOAuthConfig();

  // Curăță eroarea
  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  // Inițiază procesul de autentificare cu Google
  const initiateGoogleAuth = useCallback(() => {
    if (!isConfigValid) {
      setErrorMessage("Google OAuth is not configured properly");
      return;
    }

    setErrorMessage(null);

    // Salvează URL-ul curent pentru a reveni după autentificare
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== "/auth/login" && currentPath !== "/auth/register") {
      sessionStorage.setItem("oauth_return_url", currentPath);
    }

    try {
      const authUrl = buildGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initializing Google authentication:", error);
      setErrorMessage("Error initializing Google authentication");
    }
  }, [isConfigValid]);

  // Procesează callback-ul de la Google
  const handleGoogleCallback = useCallback(
    async (code: string) => {
      if (!code) {
        setErrorMessage("Authorization code missing");
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await OAuthService.authenticateWithGoogle(code);

        // Folosim funcția login din AuthContext pentru a seta token-ul
        if (response.token) {
          login(response);

          // Verifică dacă există URL de întoarcere salvat
          const returnUrl = sessionStorage.getItem("oauth_return_url");
          if (returnUrl) {
            sessionStorage.removeItem("oauth_return_url");
            // Nu navigăm aici, lăsăm componenta care apelează să decidă
          }
        } else {
          throw new Error("Token missing in server response");
        }

        // Curăță URL-ul de parametrii OAuth
        OAuthService.cleanUrl();
      } catch (err) {
        console.error("Google authentication error:", err);

        let errorMsg = "Google authentication failed. Please try again.";

        // Personalizează mesajul de eroare bazat pe tipul erorii
        if (err instanceof Error) {
          if (err.message.includes("Invalid authorization code")) {
            errorMsg = "Authorization code is invalid or expired.";
          } else if (err.message.includes("User not found")) {
            errorMsg = "Google account is not associated with a KDom account.";
          } else if (err.message.includes("Account disabled")) {
            errorMsg = "Your account has been disabled.";
          } else if (err.message.includes("Network")) {
            errorMsg = "Connection problem. Please check your internet.";
          }
        }

        setErrorMessage(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  return {
    isLoading,
    initiateGoogleAuth,
    handleGoogleCallback,
    errorMessage,
    isConfigValid,
    clearError,
  };
}
