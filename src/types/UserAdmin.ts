// src/types/UserAdmin.ts
import type { PagedFilterDto } from "@/types/Pagination";

export interface UserPublicDto {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UserFilterDto extends PagedFilterDto {
  role?: string;
  search?: string;
}

export interface ChangeUserRoleDto {
  newRole: string;
}

export interface UserSearchResult {
  query: string;
  results: UserPublicDto[];
  count: number;
  message: string;
}

export interface UserPrivateInfoDto {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  provider?: string;
  providerId?: string;
}

export interface UserDetailedStatsDto {
  userId: number;
  username: string;
  totalKDomsCreated: number;
  totalKDomsCollaborated: number;
  totalPosts: number;
  totalComments: number;
  totalLikesReceived: number;
  totalLikesGiven: number;
  totalCommentsReceived: number;
  totalFlagsReceived: number;
  lastActivity?: string;
  activityByMonth: Record<string, number>;
  recentActions: string[];
}

export type UserRole = "user" | "moderator" | "admin";

export const USER_ROLES: {
  value: UserRole;
  label: string;
  description: string;
}[] = [
  {
    value: "user",
    label: "User",
    description: "Regular community member with standard permissions",
  },
  {
    value: "moderator",
    label: "Moderator",
    description: "Can review K-DOMs, manage flags, and moderate content",
  },
  {
    value: "admin",
    label: "Administrator",
    description: "Full system access including user management",
  },
];
