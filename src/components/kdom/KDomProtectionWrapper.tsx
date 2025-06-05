// src/components/kdom/KDomProtectionWrapper.tsx
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Spinner, VStack, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { getKDomBySlug } from "@/api/kdom";
import { useKDomAccess } from "@/hooks/useKDomAccess";
import { KDomRestrictedAccess } from "./KDomRestrictedAccess";
import type { KDomAccessCheckResult } from "@/types/Moderation";

interface KDomProtectionWrapperProps {
  children:
    | ReactNode
    | ((kdom: any, accessResult: KDomAccessCheckResult) => ReactNode);
  action:
    | "view"
    | "edit"
    | "discussion"
    | "history"
    | "metadata"
    | "create-sub"
    | "collaborate";
  autoRedirect?: boolean;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
}

/**
 * Wrapper care protejează rutele K-DOM pe baza statusului de moderare
 * și permisiunilor utilizatorului
 */
export function KDomProtectionWrapper({
  children,
  action,
  autoRedirect = true,
  loadingComponent,
  errorComponent,
}: KDomProtectionWrapperProps) {
  const { slug } = useParams<{ slug: string }>();

  // Query pentru K-DOM
  const {
    data: kdom,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kdom", slug],
    queryFn: () => getKDomBySlug(slug!),
    enabled: !!slug,
    retry: false,
  });

  // Verificare acces
  const accessResult = useKDomAccess({ kdom, action });

  // Loading state
  if (isLoading) {
    return (
      loadingComponent || (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="gray.50"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack spacing={4}>
            <Spinner size="xl" thickness="4px" color="blue.500" />
            <Text fontSize="lg" color="gray.600">
              Loading K-DOM...
            </Text>
          </VStack>
        </Box>
      )
    );
  }

  // Error state
  if (error || !kdom) {
    return (
      errorComponent || (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="gray.50"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={8}
        >
          <Alert status="error" borderRadius="lg" maxW="500px">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">K-DOM not found</Text>
              <Text>This K-DOM doesn't exist or has been removed.</Text>
            </VStack>
          </Alert>
        </Box>
      )
    );
  }

  // Access denied
  if (!accessResult.hasAccess) {
    return (
      <KDomRestrictedAccess
        accessResult={accessResult}
        kdomTitle={kdom.title}
        kdomSlug={kdom.slug}
        action={getActionDisplayName(action)}
        autoRedirect={autoRedirect}
      />
    );
  }

  // Access granted - render children
  if (typeof children === "function") {
    return <>{children(kdom, accessResult)}</>;
  }

  return <>{children}</>;
}

/**
 * Convertește acțiunea în text pentru afișare
 */
function getActionDisplayName(action: string): string {
  switch (action) {
    case "view":
      return "view";
    case "edit":
      return "edit";
    case "discussion":
      return "access discussion";
    case "history":
      return "view history";
    case "metadata":
      return "edit settings";
    case "create-sub":
      return "create sub-pages";
    case "collaborate":
      return "collaborate on";
    default:
      return "access";
  }
}

/**
 * Hook pentru utilizarea ușoară a wrapper-ului în componente
 */
export function useKDomProtection(
  action: KDomProtectionWrapperProps["action"]
) {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: kdom,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kdom", slug],
    queryFn: () => getKDomBySlug(slug!),
    enabled: !!slug,
    retry: false,
  });

  const accessResult = useKDomAccess({ kdom, action });

  return {
    kdom,
    isLoading,
    error,
    accessResult,
    hasAccess: accessResult.hasAccess,
    slug,
  };
}

/**
 * HOC pentru protejarea paginilor K-DOM
 */
export function withKDomProtection<P extends object>(
  Component: React.ComponentType<
    P & { kdom: any; accessResult: KDomAccessCheckResult }
  >,
  action: KDomProtectionWrapperProps["action"]
) {
  return function ProtectedKDomComponent(props: P) {
    return (
      <KDomProtectionWrapper action={action}>
        {(kdom, accessResult) => (
          <Component {...props} kdom={kdom} accessResult={accessResult} />
        )}
      </KDomProtectionWrapper>
    );
  };
}
