export type ProfileTheme = "light" | "dark" | "cyberpunk" | "retro" | "minimal";

export interface UserPublicDto {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UserProfileReadDto {
  userId: number;
  nickname: string;
  avatarUrl: string;
  bio: string;
  theme: ProfileTheme;
  followersCount: number;
}

export interface UserProfileUpdateDto {
  nickname?: string;
  avatarUrl?: string;
  bio?: string;
  theme?: ProfileTheme;
}

export interface ChangeUserRoleDto {
  newRole: string;
}

export interface UserFilterDto {
  username?: string;
  email?: string;
  role?: string;
  page: number;
  pageSize: number;
}

export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginDto {
  identifier: string;
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
