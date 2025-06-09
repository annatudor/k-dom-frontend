// src/api/follow.ts - FIXED VERSION
import API from "./axios";
import type { UserPublicDto } from "../types/User";

// ✅ Tipuri pentru răspunsurile API
interface FollowersCountResponse {
  followersCount: number;
}

interface FollowingCountResponse {
  followingCount: number;
}

//  Follow user
export const followUser = async (userId: number): Promise<void> => {
  await API.post(`/follow/${userId}`);
};

//  Unfollow user
export const unfollowUser = async (userId: number): Promise<void> => {
  await API.delete(`/follow/${userId}`);
};

// Get followers list
export const getFollowers = async (
  userId: number
): Promise<UserPublicDto[]> => {
  const res = await API.get(`/follow/followers/${userId}`);
  return res.data;
};

//  Get following list
export const getFollowing = async (
  userId: number
): Promise<UserPublicDto[]> => {
  const res = await API.get(`/follow/following/${userId}`);
  return res.data;
};

//  ✅ FIX: Get followers count - cu tipuri specifice
export const getFollowersCount = async (userId: number): Promise<number> => {
  const res = await API.get<FollowersCountResponse>(
    `/follow/followers-count/${userId}`
  );

  console.log("[API] getFollowersCount raw response:", res.data);

  // ✅ FIX: Backend-ul returnează { followersCount: number }
  return res.data.followersCount || 0;
};

//  ✅ FIX: Get following count - cu tipuri specifice
export const getFollowingCount = async (userId: number): Promise<number> => {
  const res = await API.get<FollowingCountResponse>(
    `/follow/following-count/${userId}`
  );

  console.log("[API] getFollowingCount raw response:", res.data);

  // ✅ FIX: Backend-ul returnează { followingCount: number }
  return res.data.followingCount || 0;
};

// ✅ NEW: Check if current user is following a specific user
export const isFollowingUser = async (
  currentUserId: number,
  targetUserId: number
): Promise<boolean> => {
  try {
    const following = await getFollowing(currentUserId);
    return following.some((user) => user.id === targetUserId);
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
};

// ✅ NEW: Get follow stats for a user
export const getFollowStats = async (
  userId: number
): Promise<{
  followersCount: number;
  followingCount: number;
}> => {
  try {
    const [followersCount, followingCount] = await Promise.all([
      getFollowersCount(userId),
      getFollowingCount(userId),
    ]);

    return {
      followersCount,
      followingCount,
    };
  } catch (error) {
    console.error("Error getting follow stats:", error);
    return {
      followersCount: 0,
      followingCount: 0,
    };
  }
};
