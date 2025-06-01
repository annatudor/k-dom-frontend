// src/types/Profile.ts
import type { PostReadDto } from "@/types/Post";

export type ProfileTheme =
  | "Default"
  | "Cyber"
  | "Soft"
  | "Contrast"
  | "Monochrome";

export interface UserProfileData {
  // Date de bază
  userId: number;
  username: string;
  email: string;
  nickname: string;
  avatarUrl: string;
  bio: string;
  profileTheme: ProfileTheme;
  joinedAt: string;
  isActive: boolean;

  // Statistici
  followersCount: number;
  followingCount: number;
  kdomsCreatedCount: number;
  kdomsCollaboratedCount: number;
  postsCount: number;

  // Relații cu utilizatorul curent
  isFollowedByCurrentUser?: boolean;
  canEdit?: boolean;
}

export interface UserProfileStats {
  // Activitate recentă
  recentPosts: number;
  recentComments: number;
  recentKdomEdits: number;

  // Popularitate
  totalLikesReceived: number;
  totalCommentsReceived: number;

  // Contribuții
  kdomsEdited: number;
  collaborationRequests: number;
}

export interface UserProfileActivity {
  id: string;
  type:
    | "post_created"
    | "kdom_created"
    | "kdom_edited"
    | "comment_added"
    | "collaboration_added";
  title: string;
  description: string;
  targetId: string;
  targetType: "post" | "kdom" | "comment";
  createdAt: string;
}

export interface UserFollowData {
  id: number;
  username: string;
  avatarUrl?: string;
  followersCount: number;
  isFollowedByCurrentUser: boolean;
}

export interface UserKDomData {
  id: string;
  title: string;
  slug: string;
  description: string;
  theme: string;
  role: "owner" | "collaborator";
  createdAt: string;
  isApproved: boolean;
}

export interface ProfileTabData {
  overview: {
    recentActivity: UserProfileActivity[];
    topKdoms: UserKDomData[];
    recentPosts: PostReadDto[];
  };
  kdoms: {
    owned: UserKDomData[];
    collaborated: UserKDomData[];
  };
  posts: PostReadDto[];
  activity: UserProfileActivity[];
  following: {
    users: UserFollowData[];
    kdoms: UserKDomData[];
  };
}
