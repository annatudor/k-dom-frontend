// Sincronizat cu backend-ul: ProfileTheme enum din C#
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

export interface UserProfileReadDto {
  userId: number;
  username: string; // Adăugat - lipsea în versiunea originală
  nickname: string;
  avatarUrl: string;
  bio: string;
  profileTheme: ProfileTheme; // Redenumit pentru consistență cu backend-ul
  followersCount: number;
  followingCount: number; // Adăugat - lipsea în versiunea originală
  joinedAt: string; // Adăugat - data înregistrării (createdAt din User)
}

export interface UserProfileUpdateDto {
  nickname?: string;
  avatarUrl?: string;
  bio?: string;
  profileTheme?: ProfileTheme; // Redenumit pentru consistență
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
  isFollowedByCurrentUser?: boolean; // Pentru a știi dacă utilizatorul curent îl urmărește
  followersCount?: number;
  followingCount?: number;
}

export interface UserKDomData {
  id: string;
  title: string;
  slug: string;
  description?: string;
  role?: "owner" | "collaborator"; // Rolul utilizatorului în K-Dom
  createdAt?: string;
  lastEditedAt?: string;
  isFollowed?: boolean; // Dacă utilizatorul urmărește acest K-Dom
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
  isOwnProfile: boolean; // Dacă e profilul utilizatorului curent
  isFollowing?: boolean; // Dacă utilizatorul curent îl urmărește pe acesta
  canEdit: boolean; // Dacă utilizatorul curent poate edita acest profil
}

// export interface ProfileTabData {
//   overview: {
//     recentActivity: UserProfileActivity[];
//     topKdoms: UserKDomData[];
//     recentPosts: any[]; // TODO: Definește tipul pentru Post
//   };
//   kdoms: {
//     owned: UserKDomData[];
//     collaborated: UserKDomData[];
//   };
//   posts: any[]; // TODO: Definește tipul pentru Post
//   activity: UserProfileActivity[];
//   following: {
//     users: UserFollowData[];
//     kdoms: UserKDomData[];
//   };
// }

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
// export interface UserApiResponse<T = any> {
//   data: T;
//   message?: string;
//   success: boolean;
// }

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
