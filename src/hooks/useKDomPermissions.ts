// src/hooks/useKDomPermissions.ts - Hook specializat pentru permisiunile K-Dom
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import type { KDomReadDto } from "@/types/KDom";

export interface KDomPermissions {
  canEdit: boolean;
  canEditMetadata: boolean;
  canViewSensitive: boolean;
  canManageCollaborators: boolean;
  canCreateSubPages: boolean;
  canViewEditHistory: boolean;
  canApproveReject: boolean;
  canDelete: boolean;
  role: "owner" | "collaborator" | "admin" | "moderator" | "user" | "guest";
  reason: string;
}

export const useKDomPermissions = (
  kdom?: KDomReadDto | null
): KDomPermissions => {
  const { user } = useAuth();

  return useMemo(() => {
    // Default permissions pentru guest
    const defaultPermissions: KDomPermissions = {
      canEdit: false,
      canEditMetadata: false,
      canViewSensitive: false,
      canManageCollaborators: false,
      canCreateSubPages: false,
      canViewEditHistory: false,
      canApproveReject: false,
      canDelete: false,
      role: "guest",
      reason: "Not authenticated",
    };

    // Dacă nu avem user sau K-Dom, returnează permisiuni default
    if (!user || !kdom) {
      return defaultPermissions;
    }

    // Admin permissions - acces complet
    if (user.role === "admin") {
      return {
        canEdit: true,
        canEditMetadata: true,
        canViewSensitive: true,
        canManageCollaborators: true,
        canCreateSubPages: true,
        canViewEditHistory: true,
        canApproveReject: true,
        canDelete: true,
        role: "admin",
        reason: "Administrator privileges",
      };
    }

    // Moderator permissions - aproape acces complet, dar nu poate șterge
    if (user.role === "moderator") {
      return {
        canEdit: true,
        canEditMetadata: true,
        canViewSensitive: true,
        canManageCollaborators: false, // Doar owner-ul poate gestiona colaboratori
        canCreateSubPages: true,
        canViewEditHistory: true,
        canApproveReject: true,
        canDelete: false,
        role: "moderator",
        reason: "Moderator privileges",
      };
    }

    // Owner permissions - acces complet la propriul K-Dom
    if (user.id === kdom.userId) {
      return {
        canEdit: true,
        canEditMetadata: true,
        canViewSensitive: true,
        canManageCollaborators: true,
        canCreateSubPages: true,
        canViewEditHistory: true,
        canApproveReject: false, // Owner-ul nu aproabă propriile K-Dom-uri
        canDelete: true,
        role: "owner",
        reason: "Owner of this K-Dom",
      };
    }

    // Collaborator permissions - poate edita conținutul
    if (kdom.collaborators && kdom.collaborators.includes(user.id)) {
      return {
        canEdit: true,
        canEditMetadata: false, // Doar owner-ul poate edita metadata
        canViewSensitive: false,
        canManageCollaborators: false,
        canCreateSubPages: true, // Colaboratorii pot crea sub-pagini
        canViewEditHistory: true, // Pot vedea istoricul pentru transparență
        canApproveReject: false,
        canDelete: false,
        role: "collaborator",
        reason: "Collaborator on this K-Dom",
      };
    }

    // Regular user permissions - doar vizualizare
    return {
      canEdit: false,
      canEditMetadata: false,
      canViewSensitive: false,
      canManageCollaborators: false,
      canCreateSubPages: false,
      canViewEditHistory: false,
      canApproveReject: false,
      canDelete: false,
      role: "user",
      reason: "Regular user - no edit permissions",
    };
  }, [user, kdom]);
};

// Hook suplimentar pentru verificări rapide
export const useCanEditKDom = (kdom?: KDomReadDto | null): boolean => {
  const permissions = useKDomPermissions(kdom);
  return permissions.canEdit;
};

export const useCanManageKDom = (kdom?: KDomReadDto | null): boolean => {
  const permissions = useKDomPermissions(kdom);
  return permissions.canManageCollaborators;
};

export const useIsKDomOwner = (kdom?: KDomReadDto | null): boolean => {
  const permissions = useKDomPermissions(kdom);
  return permissions.role === "owner";
};

export const useIsKDomCollaborator = (kdom?: KDomReadDto | null): boolean => {
  const permissions = useKDomPermissions(kdom);
  return permissions.role === "collaborator";
};
