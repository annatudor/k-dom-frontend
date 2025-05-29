import API from "./axios";
import type {
  CollaborationRequestCreateDto,
  CollaborationRequestActionDto,
  CollaborationRequestReadDto,
  CollaboratorReadDto,
} from "../types/Collaboration";

// Trimite cerere de colaborare
export const requestCollaboration = async (
  kdomId: string,
  data: CollaborationRequestCreateDto
): Promise<void> => {
  await API.post(`/kdoms/${kdomId}/collab-requests`, data);
};

// Obține cereri de colaborare (owner doar)
export const getCollaborationRequests = async (
  kdomId: string
): Promise<CollaborationRequestReadDto[]> => {
  const res = await API.get(`/kdoms/${kdomId}/collab-requests`);
  return res.data;
};

// Aprobare cerere
export const approveRequest = async (
  kdomId: string,
  requestId: string
): Promise<void> => {
  await API.post(`/kdoms/${kdomId}/collab-requests/${requestId}/approve`);
};

// Respingere cerere
export const rejectRequest = async (
  kdomId: string,
  requestId: string,
  data: CollaborationRequestActionDto
): Promise<void> => {
  await API.post(`/kdoms/${kdomId}/collab-requests/${requestId}/reject`, data);
};

// Obține colaboratori activi ai unui K-Dom
export const getCollaborators = async (
  kdomId: string
): Promise<CollaboratorReadDto[]> => {
  const res = await API.get(`/kdoms/${kdomId}/collaborators`);
  return res.data;
};

// Elimină colaborator
export const removeCollaborator = async (
  kdomId: string,
  userIdToRemove: number
): Promise<void> => {
  await API.delete(`/kdoms/${kdomId}/collaborators/${userIdToRemove}`);
};
