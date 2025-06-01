// src/types/Flag.ts - Tipurile pentru sistemul de flag
export type ContentType = "Post" | "Comment" | "KDom";

export interface FlagCreateDto {
  contentType: ContentType;
  contentId: string;
  reason: string;
}

export interface FlagReadDto {
  id: number;
  userId: number;
  contentType: ContentType;
  contentId: string;
  reason: string;
  createdAt: string;
  isResolved: boolean;
}

// Pentru dropdown-ul de motive
export interface FlagReason {
  id: string;
  label: string;
  description: string;
  category: "spam" | "inappropriate" | "harmful" | "other";
}

// Predefined reasons pentru consistență
export const FLAG_REASONS: FlagReason[] = [
  {
    id: "spam",
    label: "Spam or Promotion",
    description: "Unwanted commercial content or repetitive posts",
    category: "spam",
  },
  {
    id: "inappropriate",
    label: "Inappropriate Content",
    description: "Content that violates community guidelines",
    category: "inappropriate",
  },
  {
    id: "harassment",
    label: "Harassment or Bullying",
    description: "Targeting or intimidating behavior towards others",
    category: "harmful",
  },
  {
    id: "hate_speech",
    label: "Hate Speech",
    description: "Content promoting hatred based on identity",
    category: "harmful",
  },
  {
    id: "misinformation",
    label: "False Information",
    description: "Deliberately misleading or false content",
    category: "harmful",
  },
  {
    id: "violence",
    label: "Violence or Threats",
    description: "Content promoting or threatening violence",
    category: "harmful",
  },
  {
    id: "copyright",
    label: "Copyright Violation",
    description: "Unauthorized use of copyrighted material",
    category: "other",
  },
  {
    id: "off_topic",
    label: "Off-topic",
    description: "Content not relevant to the K-Dom or discussion",
    category: "other",
  },
  {
    id: "other",
    label: "Other",
    description: "Something else not covered by the above categories",
    category: "other",
  },
];

// Props pentru componente
export interface FlagDialogProps {
  contentType: ContentType;
  contentId: string;
  contentTitle?: string; // Pentru a afișa ce flag-uim
  contentOwnerId?: number; // ID-ul utilizatorului care a creat conținutul
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface FlagButtonProps {
  contentType: ContentType;
  contentId: string;
  contentTitle?: string;
  contentOwnerId?: number; // ID-ul utilizatorului care a creat conținutul
  variant?: "ghost" | "outline" | "solid";
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
}

// Response types
export interface FlagResponse {
  success: boolean;
  message: string;
}
