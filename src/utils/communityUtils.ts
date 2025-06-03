// src/utils/communityUtils.ts - SIMPLIFIED pentru rollback

import type { PostReadDto } from "@/types/Post";
import type { KDomTagSearchResultDto } from "@/types/KDom";

/**
 * ✅ PĂSTRĂM - Sortare locală pentru postări (când backend nu oferă sorting)
 * Backend-ul nostru are sorting limitat, deci frontend-ul trebuie să facă sorting local
 */
export function sortPosts(
  posts: PostReadDto[],
  sortBy: "newest" | "popular" | "trending"
): PostReadDto[] {
  switch (sortBy) {
    case "newest":
      return [...posts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "popular":
      // Sortare după likeCount (avem asta în PostReadDto)
      return [...posts].sort((a, b) => b.likeCount - a.likeCount);
    case "trending":
      // Algoritm simplu de trending bazat pe like-uri și recency
      return [...posts].sort((a, b) => {
        const scoreA = calculateBasicTrendingScore(a);
        const scoreB = calculateBasicTrendingScore(b);
        return scoreB - scoreA;
      });
    default:
      return posts;
  }
}

/**
 * ✅ PĂSTRĂM - Algoritm simplu de trending (frontend-only)
 * Calculează scor de trending local când backend-ul nu oferă asta
 */
function calculateBasicTrendingScore(post: PostReadDto): number {
  const now = Date.now();
  const postTime = new Date(post.createdAt).getTime();
  const ageInHours = (now - postTime) / (1000 * 60 * 60);

  // Scor bazat pe engagement și recency
  const engagementScore = post.likeCount;

  // Boost pentru postări noi (scade exponențial)
  const recencyBoost = Math.max(0, 1 / (1 + ageInHours / 24)); // Scade treptat peste 24h

  // Score final: like-uri + boost temporal
  return engagementScore * (1 + recencyBoost * 2);
}

/**
 * ✅ PĂSTRĂM - Filtrare locală (util pentru sidebar-uri)
 */
export function filterKDomsByHub(
  kdoms: KDomTagSearchResultDto[],
  hub?: string
): KDomTagSearchResultDto[] {
  if (!hub) return kdoms;

  // Pentru moment returnăm toate - nu avem info despre hub în TagSearchResult
  // Poate fi extins când backend-ul oferă mai multe detalii
  return kdoms;
}

/**
 * ✅ PĂSTRĂM - Formatare numere (util pentru UI)
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
 * ✅ PĂSTRĂM - Culori pentru avataruri (util pentru UI)
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
 * ✅ PĂSTRĂM - Verificare follow status local
 */
export function isKDomFollowed(
  kdomId: string,
  followedKdoms: KDomTagSearchResultDto[]
): boolean {
  return followedKdoms.some((kdom) => kdom.id === kdomId);
}

/**
 * ✅ PĂSTRĂM - Empty state messages (util pentru UI)
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
 * ✅ PĂSTRĂM - Grupare alfabetică (util pentru organizare)
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
 * ❌ ELIMINĂM - extractHashtags (nu e relevant pentru sistemul nostru de tags)
 * ❌ ELIMINĂM - isRecentPost (simplu de verificat inline)
 */

/**
 * ✅ ADĂUGĂM - Helper pentru API sorting
 * Convertește opțiuni frontend în parametri pentru backend
 */
export function getApiSortParam(
  sortBy: "newest" | "popular" | "trending"
): "newest" | "oldest" | "most-liked" {
  switch (sortBy) {
    case "newest":
    case "trending": // Trending maps to newest la backend
      return "newest";
    case "popular":
      return "most-liked";
    default:
      return "newest";
  }
}

/**
 * ✅ ADĂUGĂM - Verificare dacă backend suportă sorting
 */
export function supportsBackendSorting(endpoint: string): boolean {
  // Doar endpoint-ul by-tag suportă sorting în backend
  return endpoint.includes("/posts/by-tag");
}

/**
 * ✅ ADĂUGĂM - Helper pentru cache keys
 */
export function getCacheKey(
  type: string, // Accepts any string
  sortBy?: string,
  filters?: Record<string, unknown>
): string {
  const parts = [type];
  if (sortBy) parts.push(sortBy);
  if (filters) parts.push(JSON.stringify(filters));
  return parts.join("-");
}

/**
 * ✅ ADĂUGĂM - Type-safe version pentru use cases comune
 */
export function getTypedCacheKey(
  type: "posts" | "kdoms" | "comments" | "notifications",
  sortBy?: string,
  filters?: Record<string, unknown>
): string {
  return getCacheKey(type, sortBy, filters);
}
