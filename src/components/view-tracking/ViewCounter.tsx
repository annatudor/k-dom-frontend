// src/components/view-tracking/ViewCounter.tsx - ÎNLOCUIEȘTE FIȘIERUL EXISTENT
import {
  HStack,
  Text,
  Icon,
  Skeleton,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";
import { useViewTracking, useViewCount } from "@/hooks/useViewTracking";

interface ViewCounterProps {
  contentType: "Post" | "KDom";
  contentId: string;
  variant?: "minimal" | "detailed" | "badge";
  size?: "sm" | "md" | "lg";
  enableTracking?: boolean;
}

export function ViewCounter({
  contentType,
  contentId,
  variant = "minimal",
  size = "md",
  enableTracking = true,
}: ViewCounterProps) {
  const textColor = useColorModeValue("gray.600", "gray.400");

  // CORECTEAZĂ: Apelează hook-urile întotdeauna, nu condiționat
  const trackingResult = useViewTracking({ contentType, contentId });
  const countResult = useViewCount(contentType, contentId);

  // Alege rezultatul pe baza enableTracking
  const { viewCount, isLoadingCount } = enableTracking
    ? {
        viewCount: trackingResult.viewCount,
        isLoadingCount: trackingResult.isLoadingCount,
      }
    : {
        viewCount: countResult.viewCount,
        isLoadingCount: countResult.isLoading,
      };

  // Loading state
  if (isLoadingCount) {
    return <Skeleton height="20px" width="60px" />;
  }

  // Format view count
  const formatViewCount = (count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${Math.floor(count / 100) / 10}K`;
    return `${Math.floor(count / 100000) / 10}M`;
  };

  // Configurații pentru size
  const sizeConfig = {
    sm: { iconSize: 3, fontSize: "xs", spacing: 1 },
    md: { iconSize: 4, fontSize: "sm", spacing: 2 },
    lg: { iconSize: 5, fontSize: "md", spacing: 3 },
  };

  const config = sizeConfig[size];

  // Badge variant
  if (variant === "badge") {
    return (
      <Badge
        colorScheme="gray"
        variant="subtle"
        display="flex"
        alignItems="center"
        gap={1}
      >
        <Icon as={FiEye} boxSize={config.iconSize} />
        {formatViewCount(viewCount)}
      </Badge>
    );
  }

  // Minimal/detailed variant
  return (
    <HStack
      spacing={config.spacing}
      color={textColor}
      fontSize={config.fontSize}
    >
      <Icon as={FiEye} boxSize={config.iconSize} />
      <Text>{formatViewCount(viewCount)} views</Text>
    </HStack>
  );
}

// Quick view counter pentru liste
export function QuickViewCounter({
  contentType,
  contentId,
  size = "sm",
}: {
  contentType: "Post" | "KDom";
  contentId: string;
  size?: "sm" | "md";
}) {
  return (
    <ViewCounter
      contentType={contentType}
      contentId={contentId}
      variant="minimal"
      size={size}
      enableTracking={false} // Nu face tracking în liste
    />
  );
}

// Auto-tracking view counter pentru pagini de detalii - ADAUGĂ variant prop
export function AutoTrackingViewCounter({
  contentType,
  contentId,
  variant = "detailed", // ADAUGĂ variant prop
  showDebugInfo = false,
}: {
  contentType: "Post" | "KDom";
  contentId: string;
  variant?: "minimal" | "detailed" | "badge"; // ADAUGĂ variant în tipuri
  showDebugInfo?: boolean;
}) {
  const { viewCount, hasTracked, trackingEnabled } = useViewTracking({
    contentType,
    contentId,
    options: { enabled: true },
  });

  return (
    <div>
      <ViewCounter
        contentType={contentType}
        contentId={contentId}
        variant={variant} // FOLOSEȘTE variant prop
        enableTracking={true}
      />

      {/* Debug info pentru development */}
      {showDebugInfo && (
        <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
          Tracked: {hasTracked ? "✓" : "✗"} | Enabled:{" "}
          {trackingEnabled ? "✓" : "✗"} | Count: {viewCount}
        </div>
      )}
    </div>
  );
}
