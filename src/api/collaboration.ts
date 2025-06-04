// src/api/collaboration.ts
import API from "./axios";
import type {
  CollaborationRequestCreateDto,
  CollaborationRequestActionDto,
  CollaborationRequestReadDto,
  CollaboratorReadDto,
  CollaborationRequestsResponse,
  ReceivedRequestsResponse,
  AllRequestsResponse,
  QuickStatsResponse,
  BulkRequestActionDto,
  BulkActionResultDto,
  KDomCollaborationStatsDto,
} from "../types/Collaboration";

// ===== KDOM COLLABORATION REQUESTS =====

// Trimite cerere de colaborare pentru un K-Dom
export const requestCollaboration = async (
  kdomId: string,
  data: CollaborationRequestCreateDto
): Promise<void> => {
  await API.post(`/kdoms/${kdomId}/collab-requests`, data);
};

// Obține cereri de colaborare pentru un K-Dom (owner doar)
export const getCollaborationRequests = async (
  kdomId: string
): Promise<CollaborationRequestReadDto[]> => {
  const res = await API.get(`/kdoms/${kdomId}/collab-requests`);
  return res.data;
};

// Aprobare cerere de colaborare
export const approveRequest = async (
  kdomId: string,
  requestId: string
): Promise<void> => {
  await API.post(`/kdoms/${kdomId}/collab-requests/${requestId}/approve`);
};

// Respingere cerere de colaborare
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

// Elimină colaborator din K-Dom
export const removeCollaborator = async (
  kdomId: string,
  userIdToRemove: number
): Promise<void> => {
  await API.delete(`/kdoms/${kdomId}/collaborators/${userIdToRemove}`);
};

// ===== COLLABORATION MANAGEMENT (Dedicated Controller) =====

// Obține cererile trimise de utilizatorul curent
export const getSentRequests =
  async (): Promise<CollaborationRequestsResponse> => {
    const res = await API.get("/collaboration/requests/sent");
    return res.data;
  };

// Obține cererile primite de utilizatorul curent
export const getReceivedRequests =
  async (): Promise<ReceivedRequestsResponse> => {
    const res = await API.get("/collaboration/requests/received");
    return res.data;
  };

// Obține toate cererile (trimise + primite)
export const getAllRequests = async (): Promise<AllRequestsResponse> => {
  const res = await API.get("/collaboration/requests/all");
  return res.data;
};

// Obține statistici rapide despre colaborare
export const getQuickStats = async (): Promise<QuickStatsResponse> => {
  const res = await API.get("/collaboration/stats/quick");
  return res.data;
};

// Acțiune în lot pentru cereri de colaborare
export const bulkActionRequests = async (
  data: BulkRequestActionDto
): Promise<{
  message: string;
  successCount: number;
  failureCount: number;
  totalProcessed: number;
  results: BulkActionResultDto[];
}> => {
  const res = await API.post("/collaboration/requests/bulk-action", data);
  return res.data;
};

// ===== COLLABORATION STATS =====

// Obține statistici de colaborare pentru un K-Dom
export const getKDomCollaborationStats = async (
  kdomId: string
): Promise<{
  kdomId: string;
  stats: KDomCollaborationStatsDto;
  message: string;
}> => {
  const res = await API.get(`/collaboration/kdoms/${kdomId}/stats`);
  return res.data;
};

// Obține colaboratori pentru un K-Dom cu detalii
export const getKDomCollaborators = async (
  kdomId: string
): Promise<{
  kdomId: string;
  collaborators: CollaboratorReadDto[];
  totalCount: number;
  activeCount: number;
  message: string;
}> => {
  const res = await API.get(`/collaboration/kdoms/${kdomId}/collaborators`);
  return res.data;
};

// ===== HELPER FUNCTIONS =====

// Verifică dacă utilizatorul poate trimite cerere de colaborare
export const canRequestCollaboration = async (
  kdomId: string
): Promise<boolean> => {
  try {
    // Încercăm să obținem informații despre K-Dom pentru a verifica statusul
    const kdomRes = await API.get(`/kdoms/${kdomId}`);
    const userRes = await API.get("/auth/me"); // presupunem că există acest endpoint

    const kdom = kdomRes.data;
    const user = userRes.data;

    // Nu poate trimite cerere dacă este owner sau deja colaborator
    return kdom.userId !== user.id && !kdom.collaborators?.includes(user.id);
  } catch (error) {
    console.error("Error checking collaboration eligibility:", error);
    return false;
  }
};

// Obține numărul de cereri în așteptare pentru utilizatorul curent
export const getPendingRequestsCount = async (): Promise<number> => {
  try {
    const stats = await getQuickStats();
    return stats.receivedRequests.pending;
  } catch (error) {
    console.error("Error getting pending requests count:", error);
    return 0;
  }
};

// Verifică dacă există cereri care necesită atenție
export const hasNotifications = async (): Promise<boolean> => {
  try {
    const stats = await getQuickStats();
    return stats.hasNotifications;
  } catch (error) {
    console.error("Error checking notifications:", error);
    return false;
  }
};
