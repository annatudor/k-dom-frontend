import API from "./axios";
import type { UserPublicDto } from "../types/User";

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

//  Get followers count
export const getFollowersCount = async (userId: number): Promise<number> => {
  const res = await API.get(`/follow/followers-count/${userId}`);
  return res.data;
};

//  Get following count
export const getFollowingCount = async (userId: number): Promise<number> => {
  const res = await API.get(`/follow/following-count/${userId}`);
  return res.data;
};
