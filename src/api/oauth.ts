// src/services/oauthService.ts
// Serviciu pentru comunicarea cu backend-ul OAuth

import API from "@/api/axios";
import type { GoogleAuthCodeDto, SignInResponse } from "@/types/Auth";
import { OAUTH_ENDPOINTS } from "@/config/oauth";

export class OAuthService {
  // Trimite codul de autorizare către backend
  static async authenticateWithGoogle(code: string): Promise<SignInResponse> {
    const payload: GoogleAuthCodeDto = { code };

    const response = await API.post(OAUTH_ENDPOINTS.BACKEND_CALLBACK, payload);
    return response.data;
  }

  // Verifică dacă URL-ul conține un cod de autorizare
  static hasAuthCode(url: string): boolean {
    return new URL(url).searchParams.has("code");
  }

  // Verifică dacă URL-ul conține o eroare OAuth
  static hasAuthError(url: string): boolean {
    return new URL(url).searchParams.has("error");
  }

  // Extrage eroarea din URL
  static getAuthError(url: string): string | null {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get("error");
  }

  // Curăță URL-ul de parametrii OAuth după procesare
  static cleanUrl(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    url.searchParams.delete("error");
    url.searchParams.delete("error_description");

    window.history.replaceState({}, document.title, url.toString());
  }
}
