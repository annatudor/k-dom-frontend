// src/types/Collaboration.ts
export type CollaborationRequestStatus = "Pending" | "Approved" | "Rejected";

// Actualizări pentru tipurile KDom pentru a include colaboratorii
declare module "@/types/KDom" {
  interface KDomReadDto {
    collaborators?: number[];
  }
}

// Sau dacă nu funcționează module declaration, actualizează direct în src/types/KDom.ts:
// Adaugă în KDomReadDto:
// collaborators?: number[];

export interface CollaborationRequestCreateDto {
  message?: string;
}

export interface CollaborationRequestActionDto {
  rejectionReason?: string;
}

export interface CollaborationRequestReadDto {
  id: string;
  userId: number;
  username?: string;
  status: CollaborationRequestStatus;
  message?: string;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  kdomTitle?: string; // Pentru requests sent/received
}

export interface CollaboratorReadDto {
  userId: number;
  username: string;
  addedAt: string;
  editCount: number;
  lastActivity?: string;
}

// Bulk operations
export interface BulkRequestActionDto {
  kdomId: string;
  requestIds: string[];
  action: "approve" | "reject";
  reason?: string;
}

export interface BulkActionResultDto {
  requestId: string;
  success: boolean;
  message: string;
}

// Stats pentru colaborare
export interface KDomCollaborationStatsDto {
  totalCollaborators: number;
  activeCollaborators: number;
  lastCollaboratorActivity?: string;
  topCollaborators: CollaboratorEditStatsDto[];
  editDistribution: CollaborationDistributionDto;
}

export interface CollaboratorEditStatsDto {
  userId: number;
  username: string;
  editCount: number;
  lastEdit?: string;
  contributionPercentage: number;
}

export interface CollaborationDistributionDto {
  ownerEdits: number;
  collaboratorEdits: number;
  ownerPercentage: number;
  collaboratorPercentage: number;
}

// API Response types
export interface CollaborationRequestsResponse {
  requests: CollaborationRequestReadDto[];
  summary: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  message: string;
}

export interface ReceivedRequestsResponse
  extends CollaborationRequestsResponse {
  groupedByKDom: {
    kdomTitle: string;
    requests: CollaborationRequestReadDto[];
    pendingCount: number;
  }[];
  summary: CollaborationRequestsResponse["summary"] & {
    kdomsWithRequests: number;
  };
}

export interface AllRequestsResponse {
  sent: {
    requests: CollaborationRequestReadDto[];
    total: number;
    pending: number;
  };
  received: {
    requests: CollaborationRequestReadDto[];
    total: number;
    pending: number;
  };
  summary: {
    totalSent: number;
    totalReceived: number;
    pendingSent: number;
    pendingReceived: number;
    totalPending: number;
  };
  needsAttention: boolean;
  message: string;
}

export interface QuickStatsResponse {
  sentRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  receivedRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  hasNotifications: boolean;
}

// Form types
export interface CollaborationRequestFormData {
  message: string;
}

export interface CollaborationRequestFormErrors {
  message?: string;
  general?: string;
}
