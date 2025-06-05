// src/types/PageProps.ts
import type { KDomReadDto } from "@/types/KDom";
import type { KDomAccessCheckResult } from "@/types/Moderation";

// Base props for all K-DOM page components
export interface KDomPageProps {
  kdom: KDomReadDto;
  accessResult: KDomAccessCheckResult;
}

// Instead of empty interfaces, use type aliases
export type KDomPageContentProps = KDomPageProps;
export type KDomHistoryPageContentProps = KDomPageProps;
export type EditKDomPageContentProps = KDomPageProps;
export type EditKDomMetadataPageContentProps = KDomPageProps;
export type CreateSubKDomPageContentProps = KDomPageProps;
export type KDomDiscussionPageContentProps = KDomPageProps;
export type KDomCollaborationPageContentProps = KDomPageProps;
