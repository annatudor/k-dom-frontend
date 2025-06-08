// src/types/User.ts - Actualizat pentru a include toate proprietățile necesare

// Tipuri pentru post imports
import type { PostReadDto } from "@/types/Post";
import type { KDomDisplayDto, KDomTagSearchResultDto } from "@/types/KDom";

export type ProfileTheme =
  | "Default"
  | "Cyber"
  | "Soft"
  | "Contrast"
  | "Monochrome";

// DTO-uri pentru autentificare
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

// DTO-uri pentru profil utilizator
export interface UserPublicDto {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

// ✅ ACTUALIZAT: UserProfileReadDto cu toate proprietățile necesare
export interface UserProfileReadDto {
  userId: number;
  username: string;
  nickname: string;
  avatarUrl: string;
  bio: string;
  profileTheme: ProfileTheme;
  followersCount: number;
  followingCount: number;
  joinedAt: string;

  // Statistici de activitate
  createdKDomsCount: number;
  collaboratedKDomsCount: number;
  totalPostsCount: number;
  totalCommentsCount: number;
  lastActivityAt?: string;

  // Relații cu utilizatorul curent
  isFollowedByCurrentUser?: boolean;
  isOwnProfile: boolean;
  canEdit: boolean;

  // ✅ ADĂUGAT: Conținut asociat
  ownedKDoms: KDomDisplayDto[];
  collaboratedKDoms: KDomDisplayDto[];
  followedKDoms: KDomTagSearchResultDto[];
  recentlyViewedKDoms: KDomDisplayDto[];
  recentPosts: PostReadDto[];
}

export interface UserProfileUpdateDto {
  nickname?: string;
  avatarUrl?: string;
  bio?: string;
  profileTheme?: ProfileTheme;
}

// DTO-uri pentru administrare
export interface ChangeUserRoleDto {
  newRole: string; // "user" | "moderator" | "admin"
}

export interface UserFilterDto {
  username?: string;
  email?: string;
  role?: string;
  page: number;
  pageSize: number;
}

// Tipuri suplimentare pentru funcționalități extinse
export interface UserFollowData {
  id: number;
  username: string;
  nickname?: string;
  avatarUrl?: string;
  isFollowedByCurrentUser?: boolean;
  followersCount?: number;
  followingCount?: number;
}

export interface UserKDomData {
  id: string;
  title: string;
  slug: string;
  description?: string;
  role?: "owner" | "collaborator";
  createdAt?: string;
  lastEditedAt?: string;
  isFollowed?: boolean;
}

export interface UserProfileActivity {
  id: string;
  type:
    | "post_created"
    | "kdom_created"
    | "kdom_edited"
    | "comment_posted"
    | "follow_user"
    | "follow_kdom";
  description: string;
  targetId?: string;
  targetType?: "post" | "kdom" | "user" | "comment";
  targetTitle?: string;
  createdAt: string;
}

export interface UserProfileStats {
  totalPosts: number;
  totalKdoms: number;
  totalComments: number;
  totalLikesReceived: number;
  totalFollowers: number;
  totalFollowing: number;
  kdomsFollowed: number;
  joinedDaysAgo: number;
  lastActiveAt?: string;
}

export interface UserProfileData {
  profile: UserProfileReadDto;
  stats: UserProfileStats;
  isOwnProfile: boolean;
  isFollowing?: boolean;
  canEdit: boolean;
}

// Tipuri pentru validare și erori
export interface UserValidationError {
  field:
    | keyof UserRegisterDto
    | keyof UserLoginDto
    | keyof UserProfileUpdateDto;
  message: string;
}

export interface UserProfilePermissions {
  canEdit: boolean;
  canViewPrivateInfo: boolean;
  canChangeRole: boolean;
  canViewActivity: boolean;
  canViewStats: boolean;
}

// Enum-uri și constante
export const USER_ROLES = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const PROFILE_THEMES = {
  DEFAULT: "Default",
  CYBER: "Cyber",
  SOFT: "Soft",
  CONTRAST: "Contrast",
  MONOCHROME: "Monochrome",
} as const;

// Helper types pentru form validations
export interface ProfileFormData {
  nickname: string;
  bio: string;
  avatarUrl: string;
  profileTheme: ProfileTheme;
}

export interface ProfileFormErrors {
  nickname?: string;
  bio?: string;
  avatarUrl?: string;
  profileTheme?: string;
  general?: string;
}

// Tipuri pentru hooks și state management
export interface UseProfileReturn {
  profile: UserProfileData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateProfile: (data: UserProfileUpdateDto) => Promise<void>;
  isUpdating: boolean;
}

export interface UseUserListReturn {
  users: UserPublicDto[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
  filters: UserFilterDto;
  setFilters: (filters: Partial<UserFilterDto>) => void;
  refetch: () => Promise<void>;
}

// API Response types pentru consistență
export interface UserListResponse {
  users: UserPublicDto[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

// Types pentru notificări și activitate
export interface UserNotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  followNotifications: boolean;
  commentNotifications: boolean;
  postLikeNotifications: boolean;
  kdomUpdateNotifications: boolean;
}

export interface UserPrivacySettings {
  profileVisibility: "public" | "private" | "friends";
  showEmail: boolean;
  showFollowers: boolean;
  showFollowing: boolean;
  showActivity: boolean;
  allowDirectMessages: boolean;
}
