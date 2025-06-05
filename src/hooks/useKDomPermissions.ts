// src/hooks/useKDomPermissions.ts - Hook specializat pentru permisiunile K-Dom
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getUserPermissionsBySlug } from "@/api/kdom";
import type { KDomReadDto, KDomPermissions } from "@/types/KDom";

// ✅ ACTUALIZAT - Interface extinsă pentru permisiuni
export interface ExtendedKDomPermissions extends KDomPermissions {
  // Permisiuni de bază din backend
  canEdit: boolean;
  canEditMetadata: boolean;
  canViewSensitive: boolean;
  canManageCollaborators: boolean;
  canCreateSubPages: boolean;
  canViewEditHistory: boolean;
  canApproveReject: boolean;

  // Permisiuni suplimentare calculate local
  canDelete: boolean;
  canView: boolean;
  canDiscuss: boolean;
  canCollaborate: boolean;

  // Context și informații
  role: "owner" | "collaborator" | "admin" | "moderator" | "user" | "guest";
  reason: string;
  isOwner: boolean;
  isCollaborator: boolean;
  isModeratorOrAdmin: boolean;
  canAccessWhilePending: boolean;
  canAccessWhileRejected: boolean;
}

// ✅ NOU - Hook principal care folosește backend API
export const useKDomPermissions = (
  kdom?: KDomReadDto | null
): ExtendedKDomPermissions => {
  const { user } = useAuth();

  // Query pentru permisiuni de la backend (doar dacă avem user și kdom)
  const { data: backendPermissions } = useQuery({
    queryKey: ["kdom-permissions", kdom?.slug, user?.id],
    queryFn: () => getUserPermissionsBySlug(kdom!.slug),
    enabled: !!(user && kdom?.slug),
    staleTime: 5 * 60 * 1000, // 5 minute cache
  });

  return useMemo(() => {
    // Default permissions pentru guest
    const defaultPermissions: ExtendedKDomPermissions = {
      canEdit: false,
      canEditMetadata: false,
      canViewSensitive: false,
      canManageCollaborators: false,
      canCreateSubPages: false,
      canViewEditHistory: false,
      canApproveReject: false,
      canDelete: false,
      canView: false,
      canDiscuss: false,
      canCollaborate: false,
      role: "guest",
      reason: "Not authenticated",
      isOwner: false,
      isCollaborator: false,
      isModeratorOrAdmin: false,
      canAccessWhilePending: false,
      canAccessWhileRejected: false,
    };

    // Dacă nu avem user sau K-Dom, returnează permisiuni default
    if (!user || !kdom) {
      return defaultPermissions;
    }

    // Calculăm rolurile de bază
    const isOwner = user.id === kdom.userId;
    const isCollaborator = kdom.collaborators?.includes(user.id) || false;
    const isAdmin = user.role === "admin";
    const isModerator = user.role === "moderator";
    const isModeratorOrAdmin = isAdmin || isModerator;

    // Determinăm rolul principal
    let role: ExtendedKDomPermissions["role"] = "user";
    if (isAdmin) role = "admin";
    else if (isModerator) role = "moderator";
    else if (isOwner) role = "owner";
    else if (isCollaborator) role = "collaborator";

    // Calculăm permisiunile în funcție de status
    const status = kdom.moderationStatus || kdom.status;

    // ✅ LOGICA PRINCIPALĂ - bazată pe statusul K-DOM-ului
    switch (status) {
      case "Approved": {
        // K-DOM aprobat - permisiuni normale
        const basePermissions =
          backendPermissions ||
          calculateApprovedPermissions(
            isOwner,
            isCollaborator,
            isModeratorOrAdmin
          );

        return {
          ...defaultPermissions,
          ...basePermissions,
          canView: true, // Oricine poate vedea K-DOM-uri aprobate
          canDiscuss: true, // Oricine poate discuta
          canCollaborate: !!user && !isOwner, // Toți utilizatorii autentificați, exceptând owner-ul
          role,
          isOwner,
          isCollaborator,
          isModeratorOrAdmin,
          canAccessWhilePending:
            isOwner || isCollaborator || isModeratorOrAdmin,
          canAccessWhileRejected: isOwner || isModeratorOrAdmin,
        };
      }

      case "Pending": {
        // K-DOM în așteptare - acces limitat
        const canAccess = isOwner || isCollaborator || isModeratorOrAdmin;

        if (!canAccess) {
          return {
            ...defaultPermissions,
            reason: "K-DOM is pending moderation",
            role,
            isOwner,
            isCollaborator,
            isModeratorOrAdmin,
            canAccessWhilePending: false,
            canAccessWhileRejected: false,
          };
        }

        const basePermissions =
          backendPermissions ||
          calculatePendingPermissions(
            isOwner,
            isCollaborator,
            isModeratorOrAdmin
          );

        return {
          ...defaultPermissions,
          ...basePermissions,
          canView: true, // Owner, colaboratori și moderatori pot vedea
          canDiscuss: false, // Nu se poate discuta încă
          canCollaborate: false, // Nu se poate colabora încă
          role,
          reason: isModeratorOrAdmin
            ? "Moderator preview access"
            : "Author/collaborator preview access",
          isOwner,
          isCollaborator,
          isModeratorOrAdmin,
          canAccessWhilePending: true,
          canAccessWhileRejected: isOwner || isModeratorOrAdmin,
        };
      }

      case "Rejected": {
        // K-DOM respins - acces foarte limitat
        const canAccess = isOwner || isModeratorOrAdmin;

        if (!canAccess) {
          return {
            ...defaultPermissions,
            reason: "K-DOM has been rejected",
            role,
            isOwner,
            isCollaborator,
            isModeratorOrAdmin,
            canAccessWhilePending:
              isOwner || isCollaborator || isModeratorOrAdmin,
            canAccessWhileRejected: false,
          };
        }

        return {
          ...defaultPermissions,
          canView: true, // Doar owner și moderatori
          canViewSensitive: isModeratorOrAdmin, // Doar moderatori pot vedea detalii sensitive
          canEdit: false, // Temporar disabled - resubmitere în viitor
          canEditMetadata: false,
          role,
          reason: isModeratorOrAdmin
            ? "Moderator access to rejected K-DOM"
            : "Owner access to rejected K-DOM",
          isOwner,
          isCollaborator,
          isModeratorOrAdmin,
          canAccessWhilePending:
            isOwner || isCollaborator || isModeratorOrAdmin,
          canAccessWhileRejected: true,
        };
      }

      case "Deleted": {
        // K-DOM șters - doar admini
        return {
          ...defaultPermissions,
          canView: isAdmin,
          canViewSensitive: isAdmin,
          role,
          reason: isAdmin
            ? "Admin access to deleted K-DOM"
            : "K-DOM has been deleted",
          isOwner,
          isCollaborator,
          isModeratorOrAdmin,
          canAccessWhilePending:
            isOwner || isCollaborator || isModeratorOrAdmin,
          canAccessWhileRejected: isOwner || isModeratorOrAdmin,
        };
      }

      default: {
        // Status necunoscut - acces conservator
        return {
          ...defaultPermissions,
          canView: isModeratorOrAdmin,
          role,
          reason: "Unknown K-DOM status",
          isOwner,
          isCollaborator,
          isModeratorOrAdmin,
          canAccessWhilePending:
            isOwner || isCollaborator || isModeratorOrAdmin,
          canAccessWhileRejected: isOwner || isModeratorOrAdmin,
        };
      }
    }
  }, [user, kdom, backendPermissions]);
};

// ✅ Helper functions pentru calcularea permisiunilor locale
function calculateApprovedPermissions(
  isOwner: boolean,
  isCollaborator: boolean,
  isModeratorOrAdmin: boolean
): Partial<ExtendedKDomPermissions> {
  return {
    canEdit: isOwner || isCollaborator || isModeratorOrAdmin,
    canEditMetadata: isOwner || isModeratorOrAdmin,
    canViewSensitive: isOwner || isCollaborator || isModeratorOrAdmin,
    canManageCollaborators: isOwner || isModeratorOrAdmin,
    canCreateSubPages: isOwner || isCollaborator || isModeratorOrAdmin,
    canViewEditHistory: isOwner || isCollaborator || isModeratorOrAdmin,
    canApproveReject: isModeratorOrAdmin,
    canDelete: isOwner || isModeratorOrAdmin,
    canView: true,
    canDiscuss: true,
    canCollaborate: false, // Will be set based on user context
    reason: isOwner
      ? "Owner access"
      : isCollaborator
      ? "Collaborator access"
      : isModeratorOrAdmin
      ? "Moderator access"
      : "Public access",
  };
}

function calculatePendingPermissions(
  isOwner: boolean,
  isCollaborator: boolean,
  isModeratorOrAdmin: boolean
): Partial<ExtendedKDomPermissions> {
  return {
    canEdit: isOwner || isCollaborator, // Moderatorii nu editează K-DOM-uri pending
    canEditMetadata: isOwner,
    canViewSensitive: isOwner || isCollaborator || isModeratorOrAdmin,
    canManageCollaborators: false, // Disabled while pending
    canCreateSubPages: false, // Disabled while pending
    canViewEditHistory: isOwner || isCollaborator || isModeratorOrAdmin,
    canApproveReject: isModeratorOrAdmin,
    canDelete: false, // Nu se poate șterge în timpul pending
    canView: true,
    canDiscuss: false,
    canCollaborate: false,
    reason: "Limited access while pending moderation",
  };
}

// ✅ Hook-uri suplimentare pentru verificări rapide
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
  return permissions.isOwner;
};

export const useIsKDomCollaborator = (kdom?: KDomReadDto | null): boolean => {
  const permissions = useKDomPermissions(kdom);
  return permissions.isCollaborator;
};

export const useCanViewKDom = (kdom?: KDomReadDto | null): boolean => {
  const permissions = useKDomPermissions(kdom);
  return permissions.canView;
};

export const useCanDiscussKDom = (kdom?: KDomReadDto | null): boolean => {
  const permissions = useKDomPermissions(kdom);
  return permissions.canDiscuss;
};

// ✅ Hook pentru verificarea accesului la funcționalități specifice
export const useKDomFeatureAccess = (
  kdom?: KDomReadDto | null,
  feature?:
    | "edit"
    | "metadata"
    | "history"
    | "discuss"
    | "collaborate"
    | "sub-pages"
) => {
  const permissions = useKDomPermissions(kdom);

  if (!feature) {
    return { hasAccess: false, reason: "No feature specified" };
  }

  switch (feature) {
    case "edit":
      return { hasAccess: permissions.canEdit, reason: permissions.reason };
    case "metadata":
      return {
        hasAccess: permissions.canEditMetadata,
        reason: permissions.reason,
      };
    case "history":
      return {
        hasAccess: permissions.canViewEditHistory,
        reason: permissions.reason,
      };
    case "discuss":
      return { hasAccess: permissions.canDiscuss, reason: permissions.reason };
    case "collaborate":
      return {
        hasAccess: permissions.canCollaborate,
        reason: permissions.reason,
      };
    case "sub-pages":
      return {
        hasAccess: permissions.canCreateSubPages,
        reason: permissions.reason,
      };
    default:
      return { hasAccess: false, reason: "Unknown feature" };
  }
};
