// src/hooks/useKDomAccess.ts
import { useMemo } from "react";
import { useAuth, type AuthUser } from "@/context/AuthContext";
import type { KDomReadDto } from "@/types/KDom";
import type {
  KDomAccessCheckResult,
  KDomModerationStatus,
} from "@/types/Moderation";

interface UseKDomAccessProps {
  kdom?: KDomReadDto | null;
  action?:
    | "view"
    | "edit"
    | "discussion"
    | "history"
    | "metadata"
    | "create-sub"
    | "collaborate";
}

/**
 * Hook pentru verificarea accesului la K-DOM pe baza statusului de moderare și permisiunilor utilizatorului
 */
export const useKDomAccess = ({
  kdom,
  action = "view",
}: UseKDomAccessProps): KDomAccessCheckResult => {
  const { user } = useAuth();

  return useMemo(() => {
    // PASUL 1: Verifică dacă K-DOM-ul există
    if (!kdom) {
      return {
        hasAccess: false,
        reason: "K-DOM not found or has been removed",
        redirectTo: "/404",
        showMessage: true,
      };
    }

    // PASUL 2: Determină statusul de moderare din K-DOM
    const moderationStatus = getModerationStatus(kdom);

    // PASUL 3: Determină permisiunile utilizatorului
    const userPermissions = getUserPermissions(user, kdom);

    // PASUL 4: Aplică logica de acces pe baza statusului și acțiunii
    return checkAccess(moderationStatus, action, userPermissions, kdom);
  }, [kdom, action, user]);
};

/**
 * PASUL 2: Determină statusul de moderare din obiectul K-DOM
 */
function getModerationStatus(kdom: KDomReadDto): KDomModerationStatus {
  // Verifică proprietatea status (cea mai directă)
  if (kdom.status) {
    return kdom.status as KDomModerationStatus;
  }

  // Verifică proprietatea moderationStatus
  if (kdom.moderationStatus) {
    return kdom.moderationStatus as KDomModerationStatus;
  }

  // Verifică flag-urile boolean
  if (kdom.isApproved) return "Approved";
  if (kdom.isRejected) return "Rejected";

  // Default la Pending dacă nu găsim informații clare
  return "Pending";
}

/**
 * PASUL 3: Determină permisiunile utilizatorului
 */
function getUserPermissions(user: AuthUser | null, kdom: KDomReadDto) {
  const isAuthenticated = !!user;
  const isOwner = !!(user && user.id === kdom.userId);
  const isCollaborator = !!(
    user &&
    kdom.collaborators &&
    kdom.collaborators.includes(user.id)
  );
  const isAdmin = user?.role === "admin";
  const isModerator = user?.role === "moderator";
  const isModeratorOrAdmin = isAdmin || isModerator;

  return {
    isAuthenticated,
    isOwner,
    isCollaborator,
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
    hasEditRights: isOwner || isCollaborator || isModeratorOrAdmin,
    hasMetadataRights: isOwner || isModeratorOrAdmin,
    hasSensitiveRights: isOwner || isCollaborator || isModeratorOrAdmin,
  };
}

/**
 * PASUL 4: Verifică accesul pe baza statusului și acțiunii
 */
function checkAccess(
  status: KDomModerationStatus,
  action: string,
  permissions: ReturnType<typeof getUserPermissions>,
  kdom: KDomReadDto
): KDomAccessCheckResult {
  switch (status) {
    case "Approved":
      return checkApprovedAccess(action, permissions);

    case "Pending":
      return checkPendingAccess(action, permissions, status);

    case "Rejected":
      return checkRejectedAccess(action, permissions, status, kdom);

    case "Deleted":
      return checkDeletedAccess(permissions, status);

    default:
      return {
        hasAccess: false,
        reason: `Unknown moderation status: ${status}`,
        status: status,
        redirectTo: "/",
        showMessage: true,
      };
  }
}

/**
 * Verifică accesul pentru K-DOM-uri APROBATE
 */
function checkApprovedAccess(
  action: string,
  permissions: ReturnType<typeof getUserPermissions>
): KDomAccessCheckResult {
  const {
    isAuthenticated,
    isOwner,
    hasEditRights,
    hasMetadataRights,
    hasSensitiveRights,
  } = permissions;

  switch (action) {
    case "view":
      return {
        hasAccess: true,
        reason: "Public access to approved K-DOM",
      };

    case "discussion":
      return {
        hasAccess: true,
        reason: "Public discussion access for approved K-DOM",
      };

    case "edit":
      return {
        hasAccess: hasEditRights,
        reason: hasEditRights
          ? "Edit access granted"
          : "No edit permissions for this K-DOM",
        redirectTo: hasEditRights ? undefined : "/",
        showMessage: !hasEditRights,
      };

    case "metadata":
      return {
        hasAccess: hasMetadataRights,
        reason: hasMetadataRights
          ? "Metadata edit access granted"
          : "Only owner and moderators can edit metadata",
        redirectTo: hasMetadataRights ? undefined : "/",
        showMessage: !hasMetadataRights,
      };

    case "history":
      return {
        hasAccess: hasSensitiveRights,
        reason: hasSensitiveRights
          ? "History access granted"
          : "History visible to contributors and moderators only",
        redirectTo: hasSensitiveRights ? undefined : "/",
        showMessage: !hasSensitiveRights,
      };

    case "create-sub":
      return {
        hasAccess: hasEditRights,
        reason: hasEditRights
          ? "Sub-page creation access granted"
          : "Sub-page creation requires edit permissions",
        redirectTo: hasEditRights ? undefined : "/",
        showMessage: !hasEditRights,
      };

    case "collaborate":
      return {
        hasAccess: isAuthenticated && !isOwner,
        reason: !isAuthenticated
          ? "Login required to collaborate"
          : isOwner
          ? "Owners cannot collaborate with themselves"
          : "Collaboration access granted",
        redirectTo: !isAuthenticated ? "/login" : isOwner ? "/" : undefined,
        showMessage: !isAuthenticated || isOwner,
      };

    default:
      return {
        hasAccess: true,
        reason: "Default access for approved K-DOM",
      };
  }
}

/**
 * Verifică accesul pentru K-DOM-uri în PENDING
 */
function checkPendingAccess(
  action: string,
  permissions: ReturnType<typeof getUserPermissions>,
  status: KDomModerationStatus
): KDomAccessCheckResult {
  const { isOwner, isCollaborator, isModeratorOrAdmin } = permissions;
  const hasLimitedAccess = isOwner || isCollaborator || isModeratorOrAdmin;

  // Dacă nu are acces limitat, blochează complet
  if (!hasLimitedAccess) {
    return {
      hasAccess: false,
      reason: "This K-DOM is pending moderation and not yet publicly available",
      status,
      redirectTo: "/",
      showMessage: true,
    };
  }

  // Pentru utilizatorii cu acces limitat
  switch (action) {
    case "view":
      return {
        hasAccess: true,
        reason: isModeratorOrAdmin
          ? "Moderator preview access"
          : "Author/collaborator preview access",
        status,
      };

    case "edit":
      return {
        hasAccess: isOwner || isCollaborator,
        reason:
          isOwner || isCollaborator
            ? "Edit access for pending K-DOM"
            : "Cannot edit - moderation required",
        status,
        showMessage: !(isOwner || isCollaborator),
      };

    case "metadata":
      return {
        hasAccess: isOwner || isModeratorOrAdmin,
        reason:
          isOwner || isModeratorOrAdmin
            ? "Metadata edit access for pending K-DOM"
            : "Cannot edit metadata - owner or moderator required",
        status,
        showMessage: !(isOwner || isModeratorOrAdmin),
      };

    case "history":
      return {
        hasAccess: isModeratorOrAdmin,
        reason: isModeratorOrAdmin
          ? "History access for moderators"
          : "History unavailable for pending K-DOM",
        status,
        showMessage: !isModeratorOrAdmin,
      };

    case "discussion":
    case "create-sub":
    case "collaborate":
      return {
        hasAccess: false,
        reason: "Feature unavailable while K-DOM is pending moderation",
        status,
        showMessage: true,
      };

    default:
      return {
        hasAccess: hasLimitedAccess,
        reason: "Limited access to pending K-DOM",
        status,
      };
  }
}

/**
 * Verifică accesul pentru K-DOM-uri RESPINSE
 */
function checkRejectedAccess(
  action: string,
  permissions: ReturnType<typeof getUserPermissions>,
  status: KDomModerationStatus,
  kdom: KDomReadDto
): KDomAccessCheckResult {
  const { isOwner, isModeratorOrAdmin } = permissions;

  // Doar owner-ul și moderatorii pot vedea K-DOM-uri respinse
  if (!isOwner && !isModeratorOrAdmin) {
    return {
      hasAccess: false,
      reason: "This K-DOM has been rejected and is not publicly available",
      status,
      redirectTo: "/",
      showMessage: true,
    };
  }

  switch (action) {
    case "view":
      return {
        hasAccess: true,
        reason: isModeratorOrAdmin
          ? "Moderator access to rejected K-DOM"
          : `Owner access to rejected K-DOM${
              kdom.rejectionReason ? `: ${kdom.rejectionReason}` : ""
            }`,
        status,
      };

    case "edit":
      // Temporar disabled până implementăm resubmiterea
      return {
        hasAccess: false,
        reason: "Cannot edit rejected K-DOM - resubmission feature coming soon",
        status,
        showMessage: true,
      };

    case "metadata":
      return {
        hasAccess: false,
        reason: "Cannot edit metadata of rejected K-DOM",
        status,
        showMessage: true,
      };

    case "history":
      return {
        hasAccess: isModeratorOrAdmin,
        reason: isModeratorOrAdmin
          ? "Moderator history access"
          : "History unavailable for rejected K-DOM",
        status,
        showMessage: !isModeratorOrAdmin,
      };

    case "discussion":
    case "create-sub":
    case "collaborate":
      return {
        hasAccess: false,
        reason: "Feature unavailable for rejected K-DOM",
        status,
        showMessage: true,
      };

    default:
      return {
        hasAccess: isOwner || isModeratorOrAdmin,
        reason: "Limited access to rejected K-DOM",
        status,
      };
  }
}

/**
 * Verifică accesul pentru K-DOM-uri ȘTERSE
 */
function checkDeletedAccess(
  permissions: ReturnType<typeof getUserPermissions>,
  status: KDomModerationStatus
): KDomAccessCheckResult {
  const { isAdmin } = permissions;

  return {
    hasAccess: isAdmin,
    reason: isAdmin
      ? "Administrator access to deleted K-DOM"
      : "This K-DOM has been permanently deleted",
    status,
    redirectTo: isAdmin ? undefined : "/",
    showMessage: !isAdmin,
  };
}

// ========================================
// HOOK-URI AUXILIARE PENTRU VERIFICĂRI RAPIDE
// ========================================

export const useKDomViewAccess = (kdom?: KDomReadDto | null) => {
  return useKDomAccess({ kdom, action: "view" });
};

export const useKDomEditAccess = (kdom?: KDomReadDto | null) => {
  return useKDomAccess({ kdom, action: "edit" });
};

export const useKDomDiscussionAccess = (kdom?: KDomReadDto | null) => {
  return useKDomAccess({ kdom, action: "discussion" });
};

export const useKDomMetadataAccess = (kdom?: KDomReadDto | null) => {
  return useKDomAccess({ kdom, action: "metadata" });
};

export const useKDomHistoryAccess = (kdom?: KDomReadDto | null) => {
  return useKDomAccess({ kdom, action: "history" });
};

export const useKDomCollaborateAccess = (kdom?: KDomReadDto | null) => {
  return useKDomAccess({ kdom, action: "collaborate" });
};

export const useKDomCreateSubAccess = (kdom?: KDomReadDto | null) => {
  return useKDomAccess({ kdom, action: "create-sub" });
};
