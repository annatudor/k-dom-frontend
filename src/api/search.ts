import API from "./axios";
import type { GlobalSearchResultDto } from "../types/Search";

export const globalSearch = async (
  query: string
): Promise<GlobalSearchResultDto> => {
  const res = await API.get("/search", {
    params: { q: query },
  });
  return res.data;
};
