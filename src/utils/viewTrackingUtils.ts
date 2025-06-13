// src/utils/viewTrackingUtils.ts - ÎNLOCUIEȘTE FIȘIERUL EXISTENT
import React, { useCallback } from "react";
import { trackView } from "@/lib/posthog";

// Tipuri simple pentru compatibility
type ContentType = "Post" | "KDom";

// Higher-order component for automatic view tracking
export function withViewTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  contentType: ContentType,
  getContentId: (props: P) => string
): React.ComponentType<P> {
  const WithViewTrackingComponent = (props: P) => {
    const contentId = getContentId(props);

    // Track on mount
    React.useEffect(() => {
      if (contentId) {
        trackView(contentType, contentId);
      }
    }, [contentId]);

    return React.createElement(WrappedComponent, props);
  };

  WithViewTrackingComponent.displayName = `withViewTracking(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithViewTrackingComponent;
}

// Hook simplu pentru manual tracking
export function useManualViewTracking() {
  const trackNow = useCallback(
    (contentType: ContentType, contentId: string) => {
      trackView(contentType, contentId);
      return Promise.resolve({ success: true });
    },
    []
  );

  const trackMultiple = useCallback(
    (items: Array<{ contentType: ContentType; contentId: string }>) => {
      items.forEach((item) => {
        trackView(item.contentType, item.contentId);
      });
      return Promise.resolve();
    },
    []
  );

  return {
    trackNow,
    trackMultiple,
    isEnabled: true,
    debugMode: false,
  };
}

// Hook pentru auto tracking
export function useAutoViewTracking(
  contentType: ContentType,
  contentId: string,
  delay: number = 2000
) {
  React.useEffect(() => {
    if (!contentId) return;

    const timer = setTimeout(() => {
      trackView(contentType, contentId);
    }, delay);

    return () => clearTimeout(timer);
  }, [contentType, contentId, delay]);
}
