// src/api/community.ts
import api from "./axios";
import type { KDom, Post } from "../types/Community";

export const getMyKDoms = () =>
  api.get<KDom[]>("/kdoms/followed").then((res) => res.data);

export const getSuggestedKDoms = () =>
  api.get<KDom[]>("/kdoms/suggested").then((res) => res.data);

export const getTrendingKDoms = () =>
  api.get<KDom[]>("/kdoms/trending").then((res) => res.data);

export const getFeed = () =>
  api.get<Post[]>("/posts/feed").then((res) => res.data);

export const getGuestFeed = () =>
  api.get<Post[]>("/posts/guest-feed").then((res) => res.data);
