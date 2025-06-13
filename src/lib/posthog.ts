// src/lib/posthog.ts - CREEAZĂ ACEST FIȘIER
import posthog from "posthog-js";

// Inițializare PostHog doar în browser
if (typeof window !== "undefined") {
  posthog.init("phc_lUyIsiuJU2lxv0bsx9Huynxy2qdoWxbYIKgWi5C4xMM", {
    api_host: "https://eu.i.posthog.com",
  });
}

// Funcție simplă pentru tracking
export const trackView = (contentType: string, contentId: string) => {
  if (typeof window !== "undefined") {
    posthog.capture("content_viewed", {
      content_type: contentType,
      content_id: contentId,
    });
  }
};

export default posthog;
