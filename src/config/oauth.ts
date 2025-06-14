// src/config/oauth.ts
// Configurare OAuth pentru Google

export const GOOGLE_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  redirectUri: `${window.location.origin}/auth/google/callback`,
  scope: "openid profile email",
  responseType: "code",
  accessType: "offline",
  prompt: "consent",
} as const;

export const OAUTH_ENDPOINTS = {
  GOOGLE_AUTH: "https://accounts.google.com/o/oauth2/v2/auth",
  BACKEND_CALLBACK: "/oauth/google/callback",
} as const;

// Helper pentru generarea URL-ului de autentificare Google
export function buildGoogleAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    scope: GOOGLE_OAUTH_CONFIG.scope,
    response_type: GOOGLE_OAUTH_CONFIG.responseType,
    access_type: GOOGLE_OAUTH_CONFIG.accessType,
    prompt: GOOGLE_OAUTH_CONFIG.prompt,
  });

  return `${OAUTH_ENDPOINTS.GOOGLE_AUTH}?${params.toString()}`;
}

// Helper pentru parsarea codului din URL callback
export function extractCodeFromUrl(url: string): string | null {
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get("code");
}

// Helper pentru validarea configurației OAuth
export function validateOAuthConfig(): boolean {
  return Boolean(GOOGLE_OAUTH_CONFIG.clientId);
}
