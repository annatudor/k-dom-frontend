// src/utils/decodeToken.ts
export interface DecodedToken {
  sub: string; // User ID
  username: string;
  role: string;
  avatarUrl?: string;
  exp: number; // Token expiration
  iat: number; // Token issued at
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    console.log("=== decodeToken Debug ===");
    console.log("Input token:", token);

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const decoded = JSON.parse(jsonPayload);
    console.log("Raw decoded payload:", decoded);

    // Extract values with fallbacks for different claim formats
    const sub =
      decoded.sub ||
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];

    const username =
      decoded.username ||
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      decoded.name;

    const role =
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      "user";

    const result: DecodedToken = {
      sub,
      username,
      role,
      avatarUrl: decoded.avatarUrl,
      exp: decoded.exp,
      iat: decoded.iat,
    };

    console.log("Final decoded result:", result);
    console.log("Role extracted:", role);
    console.log("=== End decodeToken Debug ===");

    return result;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};
