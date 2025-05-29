import API from "./axios";
import type { FlagCreateDto, FlagReadDto } from "../types/Flag";

//  Creează un flag
export const createFlag = async (data: FlagCreateDto): Promise<void> => {
  await API.post("/flags", data);
};

//  Admin/Moderator: obține toate flag-urile
export const getAllFlags = async (): Promise<FlagReadDto[]> => {
  const res = await API.get("/flags");
  return res.data;
};

//  Marchează ca rezolvat
export const resolveFlag = async (id: number): Promise<void> => {
  await API.post(`/flags/${id}/resolve`);
};

//  Șterge un flag
export const deleteFlag = async (id: number): Promise<void> => {
  await API.delete(`/flags/${id}`);
};
