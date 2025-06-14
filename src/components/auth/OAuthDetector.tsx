// src/components/auth/OAuthDetector.tsx
// Componentă pentru detectarea automată a callback-ului OAuth în orice pagină

import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoogleOAuth } from "@/hooks/useGoogleOAuth";
import { OAuthService } from "@/api/oauth";

export function OAuthDetector() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { handleGoogleCallback } = useGoogleOAuth();

  useEffect(() => {
    const checkForOAuthCallback = async () => {
      const currentUrl = window.location.href;

      // Verifică dacă suntem pe ruta de callback dedicată
      if (location.pathname === "/auth/google/callback") {
        return; // Lasă pagina dedicată să se ocupe
      }

      // Verifică dacă există parametri OAuth în URL
      if (OAuthService.hasAuthCode(currentUrl)) {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get("code");

          if (code) {
            // Afișează loading toast
            const loadingToast = toast({
              title: "Se procesează autentificarea...",
              status: "loading",
              duration: null,
              isClosable: false,
            });

            await handleGoogleCallback(code);

            // Închide loading toast
            toast.close(loadingToast);

            // Afișează success toast
            toast({
              title: "Autentificare reușită!",
              description: "Bun venit înapoi!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });

            // Curăță URL-ul
            OAuthService.cleanUrl();
          }
        } catch (error) {
          console.error("Eroare la procesarea OAuth:", error);

          toast({
            title: "Eroare la autentificare",
            description: "A apărut o problemă la conectarea cu Google.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });

          // Curăță URL-ul chiar și în caz de eroare
          OAuthService.cleanUrl();
        }
      }

      // Verifică dacă există eroare OAuth în URL
      if (OAuthService.hasAuthError(currentUrl)) {
        const error = OAuthService.getAuthError(currentUrl);

        toast({
          title: "Autentificare anulată",
          description: error || "Procesul de autentificare a fost întrerupt.",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });

        // Curăță URL-ul
        OAuthService.cleanUrl();
      }
    };

    checkForOAuthCallback();
  }, [location, handleGoogleCallback, toast, navigate]);

  // Această componentă nu randează nimic vizibil
  return null;
}
