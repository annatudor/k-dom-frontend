// src/components/view-tracking/ViewTrackingProvider.tsx
import React, { createContext, useContext, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { trackView, createViewTrackingData } from "@/api/viewTracking";
import type { ContentType, ViewTrackingCreateDto } from "@/types/ViewTracking";

interface ViewTrackingContextType {
  trackView: (contentType: ContentType, contentId: string) => Promise<void>;
  batchTrackViews: (
    items: Array<{ contentType: ContentType; contentId: string }>
  ) => Promise<void>;
  isEnabled: boolean;
  debugMode: boolean;
}

const ViewTrackingContext = createContext<ViewTrackingContextType | null>(null);

interface ViewTrackingProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  debugMode?: boolean;
  batchSize?: number;
  batchDelay?: number;
}

export function ViewTrackingProvider({
  children,
  enabled = true,
  debugMode = false,
  batchSize = 10,
  batchDelay = 2000,
}: ViewTrackingProviderProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Tracking state
  const batchQueue = useRef<ViewTrackingCreateDto[]>([]);
  const batchTimeoutRef = useRef<number | null>(null);
  const trackedItems = useRef(new Set<string>());

  // Helper function to create unique key for tracking
  const createTrackingKey = (
    contentType: ContentType,
    contentId: string
  ): string => {
    return `${contentType}-${contentId}`;
  };

  // Process batch queue
  const processBatch = useCallback(async () => {
    if (batchQueue.current.length === 0) return;

    const batch = [...batchQueue.current];
    batchQueue.current = [];

    if (debugMode) {
      console.log("[ViewTracking] Processing batch:", batch);
    }

    try {
      // Process each item in batch (you can implement batch endpoint later)
      const promises = batch.map((item) => trackView(item));
      await Promise.allSettled(promises);

      // Invalidate relevant queries after batch
      queryClient.invalidateQueries({ queryKey: ["view-count"] });
      queryClient.invalidateQueries({ queryKey: ["view-stats"] });

      if (debugMode) {
        console.log("[ViewTracking] Batch processed successfully");
      }
    } catch (error) {
      console.error("[ViewTracking] Batch processing failed:", error);
    }

    // Clear timeout
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
      batchTimeoutRef.current = null;
    }
  }, [debugMode, queryClient]);

  // Schedule batch processing
  const scheduleBatch = useCallback(() => {
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    batchTimeoutRef.current = window.setTimeout(processBatch, batchDelay);
  }, [processBatch, batchDelay]);

  // Main tracking function
  const trackViewItem = useCallback(
    async (contentType: ContentType, contentId: string) => {
      if (!enabled) {
        if (debugMode) {
          console.log("[ViewTracking] Tracking disabled");
        }
        return;
      }

      const trackingKey = createTrackingKey(contentType, contentId);

      // Prevent duplicate tracking in same session
      if (trackedItems.current.has(trackingKey)) {
        if (debugMode) {
          console.log("[ViewTracking] Already tracked:", trackingKey);
        }
        return;
      }

      // Mark as tracked
      trackedItems.current.add(trackingKey);

      try {
        const trackingData = createViewTrackingData(contentType, contentId, {
          viewerId: user?.id,
          includeUserAgent: true,
        });

        if (debugMode) {
          console.log("[ViewTracking] Tracking view:", trackingData);
        }

        // Add to batch queue
        batchQueue.current.push(trackingData);

        // Process immediately if batch is full, otherwise schedule
        if (batchQueue.current.length >= batchSize) {
          await processBatch();
        } else {
          scheduleBatch();
        }
      } catch (error) {
        console.error("[ViewTracking] Failed to track view:", error);
        // Remove from tracked set on error so it can be retried
        trackedItems.current.delete(trackingKey);
      }
    },
    [enabled, debugMode, user?.id, batchSize, processBatch, scheduleBatch]
  );

  // Batch tracking function for feeds/lists
  const batchTrackViewsItems = useCallback(
    async (items: Array<{ contentType: ContentType; contentId: string }>) => {
      if (!enabled) return;

      const untracked = items.filter(
        (item) =>
          !trackedItems.current.has(
            createTrackingKey(item.contentType, item.contentId)
          )
      );

      if (untracked.length === 0) return;

      if (debugMode) {
        console.log(
          "[ViewTracking] Batch tracking:",
          untracked.length,
          "items"
        );
      }

      // Track each item with small delays to avoid overwhelming server
      for (let i = 0; i < untracked.length; i++) {
        const item = untracked[i];

        // Add delay between batch items
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        await trackViewItem(item.contentType, item.contentId);
      }
    },
    [enabled, debugMode, trackViewItem]
  );

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      // Process any remaining items
      if (batchQueue.current.length > 0) {
        processBatch();
      }
    };
  }, [processBatch]);

  const contextValue: ViewTrackingContextType = {
    trackView: trackViewItem,
    batchTrackViews: batchTrackViewsItems,
    isEnabled: enabled,
    debugMode,
  };

  return (
    <ViewTrackingContext.Provider value={contextValue}>
      {children}
    </ViewTrackingContext.Provider>
  );
}

// Hook to use view tracking context (this is the only non-component export allowed)
export function useViewTrackingContext(): ViewTrackingContextType {
  const context = useContext(ViewTrackingContext);

  if (!context) {
    throw new Error(
      "useViewTrackingContext must be used within ViewTrackingProvider"
    );
  }

  return context;
}
