import type { DecodedToken } from "@/types/Auth";

export function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload)) as DecodedToken;
  } catch {
    return null;
  }
}
