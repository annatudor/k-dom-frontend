// types/Auth.ts
// Tipuri pentru autentificare și gestionarea sesiunii

export interface DecodedToken {
  sub: string; // User ID
  username: string;
  role: string;
  avatarUrl?: string;
  exp: number; // Token expiration
  iat: number; // Token issued at
}

export interface SignInResponse {
  token: string;
  user?: AuthUser; // Optional user data
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
  avatarUrl?: string;
  email?: string;
}

// DTO-uri pentru requests
export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginDto {
  identifier: string; // email sau username
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

// OAuth
export interface GoogleAuthCodeDto {
  code: string;
}

export interface OAuthProvider {
  name: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

// Session Management
export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: Date;
  refreshToken?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Validation
export interface AuthValidationError {
  field: keyof UserRegisterDto | keyof UserLoginDto | keyof ChangePasswordDto;
  message: string;
}

export interface AuthFormErrors {
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  newPassword?: string;
  identifier?: string;
  general?: string;
}

// Constants
export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/auth/change-password",
  OAUTH_GOOGLE: "/oauth/google/callback",
} as const;

export const AUTH_STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  REFRESH_TOKEN: "refreshToken",
} as const;

// Hooks return types
export interface UseAuthReturn {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLoginDto) => Promise<void>;
  register: (data: UserRegisterDto) => Promise<void>;
  logout: () => void;
  changePassword: (data: ChangePasswordDto) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordDto) => Promise<void>;
  refreshToken: () => Promise<void>;
  refreshUserProfile: () => Promise<void>; // ✅ NOUĂ: Refresh avatar
}

// Permission helpers
export type UserRole = "user" | "moderator" | "admin";

export const USER_ROLES: Record<string, UserRole> = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
} as const;

export interface PermissionCheck {
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  canModerate: () => boolean; // admin sau moderator
}
