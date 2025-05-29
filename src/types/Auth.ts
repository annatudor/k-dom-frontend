export interface DecodedToken {
  sub: string;
  username: string;
  role: string;
  avatarUrl?: string;
  // alte câmpuri dacă e cazul
}

// src/types/Auth.ts
export interface SignInResponse {
  token: string;
}
