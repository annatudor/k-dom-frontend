export type Language = "En" | "Ro" | "Kr" | "Jp" | "Fr" | "De";
export type Hub =
  | "Music"
  | "Anime"
  | "Kpop"
  | "Gaming"
  | "Literature"
  | "Fashion";
export type KDomTheme = "Light" | "Dark" | "Vibrant" | "Pastel";

export interface KDomCreateDto {
  title: string;
  slug: string;
  description: string;
  hub: Hub;
  language: Language;
  theme: KDomTheme;
  contentHtml: string;
  isForKids: boolean;
  parentId?: string;
}

export interface KDomEditDto {
  contentHtml: string;
  editNote?: string;
  isMinor?: boolean;
}

export interface KDomUpdateMetadataDto {
  title: string;
  description: string;
  hub: Hub;
  language: Language;
  theme: KDomTheme;
  isForKids: boolean;
  parentId?: string;
}

export interface KDomRejectDto {
  reason: string;
}

export interface KDomEditReadDto {
  id: string;
  editNote: string;
  isMinor: boolean;
  editedAt: string;
}

export interface KDomMetadataEditReadDto {
  id: string;
  previousTitle: string;
  previousDescription: string;
  previousLanguage: Language;
  previousHub: Hub;
  previousIsForKids: boolean;
  previousTheme: KDomTheme;
  previousParentId?: string;
  editedAt: string;
}

export interface KDomReadDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  hub: Hub;
  theme: KDomTheme;
  contentHtml: string;
  language: Language;
  isForKids: boolean;
  userId: number;
  authorUsername: string;
  createdAt: string;
  updatedAt?: string;
  lastEditedAt?: string;
}

export interface KDomDisplayDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  hub: Hub;
  language: Language;
  theme: KDomTheme;
  createdAt: string;
  isForKids: boolean;
}

export interface KDomTagSearchResultDto {
  id: string;
  title: string;
  slug: string;
}

export interface KDomTrendingDto {
  id: string;
  title: string;
  slug: string;
  score: number;
}

export interface KDomSubCreateDto {
  title: string;
  description: string;
  contentHtml: string;
  theme: KDomTheme;
}
