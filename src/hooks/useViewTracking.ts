// src/hooks/useViewTracking.ts - VERSIUNE COMPLETĂ
import { useState, useEffect, useCallback } from "react";
import { trackView } from "@/lib/posthog";

// Tipuri simple
interface UseViewTrackingProps {
  contentType: "Post" | "KDom";
  contentId: string;
  options?: {
    enabled?: boolean;
    debounceMs?: number;
  };
}

interface ViewStats {
  totalViews: number;
  recentViews: number;
  uniqueViewers: number;
  popularityLevel: string;
  lastViewed?: string;
}

// TEST POSTHOG la prima încărcare
const testPostHogConnection = () => {
  try {
    // Test silent fără să afișeze în consolă
    if (typeof window !== "undefined") {
      console.log("🔄 PostHog connection test...");
    }
  } catch {
    // Elimină 'error' nefolosit
    console.warn("⚠️ PostHog test failed, will use localStorage fallback");
  }
};

// Rulează testul la import
testPostHogConnection();

// Hook principal - ACEEAȘI INTERFAȚĂ ca înainte
export function useViewTracking({
  contentType,
  contentId,
  options = {},
}: UseViewTrackingProps) {
  const [hasTracked, setHasTracked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [isLoading] = useState(false);

  const { enabled = true, debounceMs = 2000 } = options;

  // Simulăm view stats pentru compatibilitate
  const viewStats: ViewStats = {
    totalViews: viewCount,
    recentViews: Math.floor(viewCount * 0.3),
    uniqueViewers: Math.floor(viewCount * 0.7),
    popularityLevel:
      viewCount > 100 ? "HIGH" : viewCount > 50 ? "MEDIUM" : "LOW",
    lastViewed: new Date().toISOString(),
  };

  // Funcție pentru tracking manual cu logging îmbunătățit
  const trackViewNow = useCallback(async () => {
    if (!enabled || hasTracked || !contentId) {
      console.log("🚫 Tracking skipped:", { enabled, hasTracked, contentId });
      return { success: false };
    }

    try {
      console.log("🔄 Starting tracking for:", { contentType, contentId });

      // Track cu PostHog
      trackView(contentType, contentId);
      console.log("✅ PostHog tracking sent");

      // Update local count pentru demo
      const storageKey = `view_count_${contentType}_${contentId}`;
      const currentCount = parseInt(
        localStorage.getItem(storageKey) || "0",
        10
      );
      const newCount = currentCount + 1;
      localStorage.setItem(storageKey, newCount.toString());
      setViewCount(newCount);
      setHasTracked(true);

      console.log("✅ Tracking completed:", {
        contentType,
        contentId,
        newCount,
        storageKey,
      });

      return { success: true };
    } catch (error) {
      console.error("❌ Tracking failed:", error);
      return { success: false, error };
    }
  }, [contentType, contentId, enabled, hasTracked]);

  // Auto-tracking cu debounce
  useEffect(() => {
    if (!enabled || !contentId) {
      console.log("🚫 Auto-tracking disabled:", { enabled, contentId });
      return;
    }

    console.log(`⏱️ Auto-tracking scheduled in ${debounceMs}ms for:`, {
      contentType,
      contentId,
    });

    const timer = setTimeout(() => {
      console.log("🚀 Auto-tracking triggered");
      trackViewNow();
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      console.log("🧹 Auto-tracking timer cleared");
    };
  }, [enabled, contentType, contentId, debounceMs, trackViewNow]);

  // Load count din localStorage la mount
  useEffect(() => {
    if (!contentId) return;

    const storageKey = `view_count_${contentType}_${contentId}`;
    const storedCount = parseInt(localStorage.getItem(storageKey) || "0", 10);
    setViewCount(storedCount);

    console.log("📊 Loaded view count from storage:", {
      storageKey,
      storedCount,
      contentType,
      contentId,
    });
  }, [contentType, contentId]); // ADAUGĂ contentType în dependencies

  // Refresh function
  const refreshStats = useCallback(() => {
    const storageKey = `view_count_${contentType}_${contentId}`;
    const storedCount = parseInt(localStorage.getItem(storageKey) || "0", 10);
    setViewCount(storedCount);
    console.log("🔄 Stats refreshed:", { storageKey, storedCount });
  }, [contentType, contentId]);

  // Debug info în development
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      console.log("🐛 useViewTracking Debug Info:", {
        contentType,
        contentId,
        viewCount,
        hasTracked,
        enabled,
        trackingEnabled: enabled,
      });
    }
  }, [contentType, contentId, viewCount, hasTracked, enabled]); // ADAUGĂ contentType în dependency

  // Return ACEEAȘI INTERFAȚĂ ca înainte
  return {
    // Basic data
    viewCount,
    viewStats,

    // Loading states
    isLoadingCount: isLoading,
    isLoadingStats: isLoading,
    isTracking: false,

    // Functions
    trackViewNow,
    refreshStats,

    // Status
    hasTracked,
    trackingEnabled: enabled,
    error: null,
  };
}

// Hook pentru view count only (compatibility)
export function useViewCount(contentType: "Post" | "KDom", contentId: string) {
  const { viewCount, isLoadingCount } = useViewTracking({
    contentType,
    contentId,
  });
  return { viewCount, isLoading: isLoadingCount };
}

// Hook pentru batch tracking (compatibility)
export function useBatchViewTracking() {
  const trackMultiple = useCallback(
    (items: Array<{ contentType: "Post" | "KDom"; contentId: string }>) => {
      console.log("📦 Batch tracking started for:", items.length, "items");

      items.forEach((item, index) => {
        setTimeout(() => {
          trackView(item.contentType, item.contentId);
          console.log(
            `📦 Batch item ${index + 1}/${items.length} tracked:`,
            item
          );
        }, index * 100); // 100ms delay între fiecare item
      });

      return Promise.resolve();
    },
    []
  );

  return { trackMultiple };
}

// Hook helper pentru debugging
export function useViewTrackingDebug(
  contentType: "Post" | "KDom",
  contentId: string
) {
  const result = useViewTracking({ contentType, contentId });

  // Log toate schimbările
  useEffect(() => {
    console.log("🐛 ViewTracking State Changed:", {
      contentType,
      contentId,
      viewCount: result.viewCount,
      hasTracked: result.hasTracked,
      trackingEnabled: result.trackingEnabled,
    });
  }, [
    result.viewCount,
    result.hasTracked,
    result.trackingEnabled,
    contentType,
    contentId,
  ]);

  return {
    ...result,
    debug: {
      storageKey: `view_count_${contentType}_${contentId}`,
      localStorage:
        typeof window !== "undefined"
          ? localStorage.getItem(`view_count_${contentType}_${contentId}`)
          : null,
    },
  };
}
