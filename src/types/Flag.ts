// src/types/Flag.ts - Actualizat cu backend-ul
export type ContentType = "Post" | "Comment" | "KDom";

export interface FlagCreateDto {
  contentType: ContentType;
  contentId: string;
  reason: string;
}

export interface FlagReadDto {
  id: number;
  userId: number;
  reporterUsername: string;
  contentType: ContentType;
  contentId: string;
  reason: string;
  createdAt: string;
  isResolved: boolean;
  content?: FlaggedContentDto;
  contentExists: boolean;
}

export interface FlaggedContentDto {
  authorUsername: string;
  authorId: number;
  title: string; // Pentru K-Dom
  text: string; // Pentru Post/Comment
  createdAt: string;
  parentInfo?: string; // Pentru Comments
  tags: string[]; // Pentru Posts
}

export interface ContentRemovalDto {
  reason: string;
}

export interface FlagStatsDto {
  totalPending: number;
  totalToday: number;
  totalAllTime: number;
  flagsByContentType: Record<string, number>;
  requiresAttention: boolean;
}

export interface FlagResponse {
  success: boolean;
  message: string;
}

// Pentru dropdown-ul de motive
export interface FlagReason {
  id: string;
  label: string;
  description: string;
  category: "spam" | "inappropriate" | "harmful" | "other";
  applicableTo: ContentType[];
}

// Actualizăm motivele cu suport pentru backend
export const FLAG_REASONS: FlagReason[] = [
  {
    id: "spam",
    label: "Spam or Promotion",
    description: "Unwanted commercial content or repetitive material",
    category: "spam",
    applicableTo: ["Post", "Comment", "KDom"],
  },
  {
    id: "inappropriate",
    label: "Inappropriate Content",
    description: "Content that violates community guidelines",
    category: "inappropriate",
    applicableTo: ["Post", "Comment", "KDom"],
  },
  {
    id: "harassment",
    label: "Harassment or Bullying",
    description: "Targeting or intimidating behavior towards others",
    category: "harmful",
    applicableTo: ["Post", "Comment", "KDom"],
  },
  {
    id: "hate_speech",
    label: "Hate Speech",
    description: "Content promoting hatred based on identity",
    category: "harmful",
    applicableTo: ["Post", "Comment", "KDom"],
  },
  {
    id: "misinformation",
    label: "False Information",
    description: "Deliberately misleading or false content",
    category: "harmful",
    applicableTo: ["Post", "Comment", "KDom"],
  },
  {
    id: "violence",
    label: "Violence or Threats",
    description: "Content promoting or threatening violence",
    category: "harmful",
    applicableTo: ["Post", "Comment", "KDom"],
  },
  {
    id: "copyright",
    label: "Copyright Violation",
    description: "Unauthorized use of copyrighted material",
    category: "other",
    applicableTo: ["Post", "Comment", "KDom"],
  },
  // K-Dom specific reasons
  {
    id: "misleading_title",
    label: "Misleading Title or Description",
    description: "K-Dom title doesn't match the actual content",
    category: "other",
    applicableTo: ["KDom"],
  },
  {
    id: "duplicate_content",
    label: "Duplicate K-Dom",
    description: "This K-Dom is essentially identical to an existing one",
    category: "spam",
    applicableTo: ["KDom"],
  },
  {
    id: "incorrect_categorization",
    label: "Wrong Hub or Category",
    description: "K-Dom is placed in an inappropriate hub or category",
    category: "other",
    applicableTo: ["KDom"],
  },
  {
    id: "incomplete_content",
    label: "Incomplete or Low Quality",
    description: "K-Dom lacks substantial content or is poorly written",
    category: "other",
    applicableTo: ["KDom"],
  },
  {
    id: "adult_content_unmarked",
    label: "Adult Content Not Marked",
    description: "Contains adult content but not properly marked",
    category: "inappropriate",
    applicableTo: ["KDom"],
  },
  // Post/Comment specific reasons
  {
    id: "off_topic",
    label: "Off-topic",
    description: "Content not relevant to the K-Dom or discussion",
    category: "other",
    applicableTo: ["Post", "Comment"],
  },
  {
    id: "other",
    label: "Other",
    description: "Something else not covered by the above categories",
    category: "other",
    applicableTo: ["Post", "Comment", "KDom"],
  },
];

// Helper function to get reasons for a specific content type
export const getApplicableReasons = (
  contentType: ContentType
): FlagReason[] => {
  return FLAG_REASONS.filter((reason) =>
    reason.applicableTo.includes(contentType)
  );
};

// Props pentru componente
export interface FlagDialogProps {
  contentType: ContentType;
  contentId: string;
  contentTitle?: string;
  contentOwnerId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface FlagButtonProps {
  contentType: ContentType;
  contentId: string;
  contentTitle?: string;
  contentOwnerId?: number;
  variant?: "ghost" | "outline" | "solid";
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  onSuccess?: () => void;
}
