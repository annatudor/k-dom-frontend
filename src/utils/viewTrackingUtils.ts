// src/utils/viewTrackingUtils.ts
import React, { useCallback } from "react";
import { useViewTrackingContext } from "@/components/view-tracking/ViewTrackingProvider";
import type { ContentType } from "@/types/ViewTracking";

// Higher-order component for automatic view tracking
export function withViewTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  contentType: ContentType,
  getContentId: (props: P) => string
): React.ComponentType<P> {
  const WithViewTrackingComponent = (props: P) => {
    const { trackView: trackViewContext } = useViewTrackingContext();
    const contentId = getContentId(props);

    React.useEffect(() => {
      if (contentId) {
        trackViewContext(contentType, contentId);
      }
    }, [contentId, trackViewContext]);

    return React.createElement(WrappedComponent, props);
  };

  WithViewTrackingComponent.displayName = `withViewTracking(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithViewTrackingComponent;
}

// Hook for manual view tracking
export function useManualViewTracking() {
  const { trackView, batchTrackViews, isEnabled, debugMode } =
    useViewTrackingContext();

  const trackNow = useCallback(
    (contentType: ContentType, contentId: string) => {
      return trackView(contentType, contentId);
    },
    [trackView]
  );

  const trackMultiple = useCallback(
    (items: Array<{ contentType: ContentType; contentId: string }>) => {
      return batchTrackViews(items);
    },
    [batchTrackViews]
  );

  return {
    trackNow,
    trackMultiple,
    isEnabled,
    debugMode,
  };
}

// Hook for automatic view tracking on component mount
export function useAutoViewTracking(
  contentType: ContentType,
  contentId: string,
  delay: number = 2000
) {
  const { trackView } = useViewTrackingContext();

  React.useEffect(() => {
    if (!contentId) return;

    const timer = setTimeout(() => {
      trackView(contentType, contentId);
    }, delay);

    return () => clearTimeout(timer);
  }, [contentType, contentId, delay, trackView]);
}
