export type CollaborationRequestStatus = "Pending" | "Approved" | "Rejected";

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
}

export interface CollaboratorReadDto {
  userId: number;
  username: string;
}
