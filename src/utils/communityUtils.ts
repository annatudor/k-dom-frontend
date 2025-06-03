// src/utils/communityUtils.ts

import type { PostReadDto } from "@/types/Post";
import type { KDomTagSearchResultDto } from "@/types/KDom";

/**
 * Sortează postările după criterii specifice
 */
export function sortPosts(
  posts: PostReadDto[],
  sortBy: "newest" | "trending" | "popular"
): PostReadDto[] {
  switch (sortBy) {
    case "newest":
      return [...posts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "popular":
      return [...posts].sort((a, b) => b.likeCount - a.likeCount);
    case "trending":
      // Combinăm like-uri cu recentitatea pentru trending
      return [...posts].sort((a, b) => {
        const scoreA = calculateTrendingScore(a);
        const scoreB = calculateTrendingScore(b);
        return scoreB - scoreA;
      });
    default:
      return posts;
  }
}

/**
 * Calculează scorul de trending pentru o postare
 */
function calculateTrendingScore(post: PostReadDto): number {
  const now = Date.now();
  const postTime = new Date(post.createdAt).getTime();
  const ageInHours = (now - postTime) / (1000 * 60 * 60);

  // Scor bazat pe engagement și recency
  const engagementScore = post.likeCount;
  const recencyBoost = Math.max(0, 48 - ageInHours) / 48; // Boost pentru postări sub 48h

  return engagementScore * (1 + recencyBoost);
}

/**
 * Filtrează K-Dom-urile după hub
 */
export function filterKDomsByHub(
  kdoms: KDomTagSearchResultDto[],
  hub?: string
): KDomTagSearchResultDto[] {
  if (!hub) return kdoms;

  // Această funcție ar trebui extinsă când avem informații despre hub în data
  return kdoms; // Placeholder
}

/**
 * Formatează numărul de followeri
 */
export function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Generează culori pentru avataruri bazate pe nume
 */
export function getAvatarColor(name: string): string {
  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "cyan",
    "purple",
    "pink",
  ];

  const hash = name.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + acc;
  }, 0);

  return colors[hash % colors.length];
}

/**
 * Verifică dacă un K-Dom este urmărit
 */
export function isKDomFollowed(
  kdomId: string,
  followedKdoms: KDomTagSearchResultDto[]
): boolean {
  return followedKdoms.some((kdom) => kdom.id === kdomId);
}

/**
 * Creează un placeholder text pentru empty states
 */
export function getEmptyStateMessage(
  type: "posts" | "kdoms" | "suggestions",
  isAuthenticated: boolean
): { title: string; description: string } {
  switch (type) {
    case "posts":
      return {
        title: isAuthenticated
          ? "Your feed is empty"
          : "Welcome to the community!",
        description: isAuthenticated
          ? "Follow some K-Doms or users to see posts in your personalized feed."
          : "Discover amazing content from our community. Sign in to get a personalized experience!",
      };
    case "kdoms":
      return {
        title: "No K-Doms yet",
        description: isAuthenticated
          ? "You haven't followed any K-Doms yet. Start exploring!"
          : "Sign in to follow K-Doms and customize your experience.",
      };
    case "suggestions":
      return {
        title: "No suggestions available",
        description:
          "We're working on finding great K-Doms for you to discover!",
      };
    default:
      return {
        title: "Nothing here yet",
        description: "Check back later!",
      };
  }
}

/**
 * Grupează K-Dom-urile după prima literă pentru organizare
 */
export function groupKDomsByLetter(
  kdoms: KDomTagSearchResultDto[]
): Record<string, KDomTagSearchResultDto[]> {
  return kdoms.reduce((groups, kdom) => {
    const letter = kdom.title[0].toUpperCase();
    if (!groups[letter]) {
      groups[letter] = [];
    }
    groups[letter].push(kdom);
    return groups;
  }, {} as Record<string, KDomTagSearchResultDto[]>);
}

/**
 * Extrage hashtag-urile din textul unei postări
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w]+/g;
  return text.match(hashtagRegex) || [];
}

/**
 * Verifică dacă o postare este recentă (sub 24h)
 */
export function isRecentPost(post: PostReadDto): boolean {
  const now = Date.now();
  const postTime = new Date(post.createdAt).getTime();
  const hoursDiff = (now - postTime) / (1000 * 60 * 60);
  return hoursDiff < 24;
}
