import API from "./axios";
import type { KDomTagSearchResultDto } from "../types/KDomFollow";

//  Follow K-Dom
export const followKDom = async (kdomId: string): Promise<void> => {
  await API.post(`/kdoms/${kdomId}/follow`);
};

//  Unfollow K-Dom
export const unfollowKDom = async (kdomId: string): Promise<void> => {
  await API.delete(`/kdoms/${kdomId}/unfollow`);
};

//  Verifică dacă e urmărit
export const isKDomFollowed = async (kdomId: string): Promise<boolean> => {
  const res = await API.get(`/kdoms/${kdomId}/is-followed`);
  return res.data.isFollowed;
};

//  Returnează K-Doms urmărite
export const getFollowedKdoms = async (): Promise<KDomTagSearchResultDto[]> => {
  const res = await API.get("/kdoms/followed");
  return res.data;
};

//  Număr urmăritori pentru un K-Dom
export const getKDomFollowersCount = async (
  kdomId: string
): Promise<number> => {
  const res = await API.get(`/kdoms/${kdomId}/followers/count`);
  return res.data.count;
};
