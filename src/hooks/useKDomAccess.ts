// src/hooks/useKDomAccess.ts
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import type {
  KDomReadDtoWithModeration,
  KDomAccessCheckResult,
  KDomModerationStatus,
} from "@/types/Moderation";
import type { KDomReadDto } from "@/types/KDom";

interface UseKDomAccessProps {
  kdom?: KDomReadDto | KDomReadDtoWithModeration | null;
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
 * Hook pentru verificarea accesului la K-DOM pe baza statusului de moderare și permisiunilor
 */
export const useKDomAccess = ({
  kdom,
  action = "view",
}: UseKDomAccessProps): KDomAccessCheckResult => {
  const { user } = useAuth();

  return useMemo(() => {
    // Dacă nu avem K-DOM, nu avem acces
    if (!kdom) {
      return {
        hasAccess: false,
        reason: "K-DOM not found",
        redirectTo: "/404",
      };
    }

    // Determinăm statusul de moderare
    const moderationStatus = getModerationStatus(kdom);

    // Verificăm permisiunile utilizatorului
    const isOwner = !!(user && user.id === kdom.userId);
    const isCollaborator = !!(
      user &&
      "collaborators" in kdom &&
      kdom.collaborators?.includes(user.id)
    );
    const isAdmin = user?.role === "admin";
    const isModerator = user?.role === "moderator";
    const isModeratorOrAdmin = !!(isAdmin || isModerator);

    // ✅ LOGICA PRINCIPALĂ DE ACCES
    switch (moderationStatus) {
      case "Approved":
        // K-DOM aprobat - acces normal pe bază de permisiuni
        return checkApprovedKDomAccess(action, {
          isOwner,
          isCollaborator,
          isModeratorOrAdmin,
          user: user ? { ...user, id: String(user.id) } : user,
        });

      case "Pending":
        // K-DOM în așteptare - acces doar pentru owner, colaboratori și moderatori
        return checkPendingKDomAccess(action, moderationStatus, {
          isOwner,
          isCollaborator,
          isModeratorOrAdmin,
        });

      case "Rejected":
        // K-DOM respins - acces foarte limitat
        return checkRejectedKDomAccess(
          action,
          moderationStatus,
          kdom as KDomReadDtoWithModeration,
          { isOwner, isModeratorOrAdmin }
        );

      case "Deleted":
        // K-DOM șters - doar adminii pot vedea
        return {
          hasAccess: isAdmin,
          reason: isAdmin
            ? "K-DOM deleted - admin access"
            : "This K-DOM has been deleted",
          status: moderationStatus,
          redirectTo: isAdmin ? undefined : "/",
          showMessage: !isAdmin,
        };

      default:
        return {
          hasAccess: false,
          reason: "Unknown moderation status",
          redirectTo: "/",
        };
    }
  }, [kdom, action, user]);
};

/**
 * Determină statusul de moderare al unui K-DOM
 */
function getModerationStatus(
  kdom: KDomReadDto | KDomReadDtoWithModeration
): KDomModerationStatus {
  // Dacă avem statusul computed, îl folosim
  if ("moderationStatus" in kdom && kdom.moderationStatus) {
    return kdom.moderationStatus;
  }

  // Calculăm statusul pe baza flag-urilor booleene
  if ("isApproved" in kdom && "isRejected" in kdom) {
    if (kdom.isApproved) return "Approved";
    if (kdom.isRejected) return "Rejected";
    return "Pending";
  }

  // Dacă nu avem informații despre moderare, considerăm aprobat (pentru compatibility)
  return "Approved";
}

/**
 * Verifică accesul pentru K-DOM-uri aprobate
 */
function checkApprovedKDomAccess(
  action: string,
  permissions: {
    isOwner: boolean;
    isCollaborator: boolean;
    isModeratorOrAdmin: boolean;
    user:
      | {
          id: string;
          role?: string;
          // Add other user properties as needed
        }
      | null
      | undefined;
  }
): KDomAccessCheckResult {
  const { isOwner, isCollaborator, isModeratorOrAdmin, user } = permissions;

  switch (action) {
    case "view":
      return { hasAccess: true, reason: "Public access to approved K-DOM" };

    case "edit":
      return {
        hasAccess: isOwner || isCollaborator || isModeratorOrAdmin,
        reason: isOwner
          ? "Owner access"
          : isCollaborator
          ? "Collaborator access"
          : isModeratorOrAdmin
          ? "Moderator access"
          : "No edit permissions",
        redirectTo:
          isOwner || isCollaborator || isModeratorOrAdmin ? undefined : "/",
      };

    case "discussion":
      return { hasAccess: true, reason: "Public discussion access" };

    case "history":
      return {
        hasAccess: isOwner || isCollaborator || isModeratorOrAdmin,
        reason: "History visible to contributors and moderators only",
      };

    case "metadata":
      return {
        hasAccess: isOwner || isModeratorOrAdmin,
        reason: "Metadata editable by owner and moderators only",
      };

    case "create-sub":
      return {
        hasAccess: isOwner || isCollaborator || isModeratorOrAdmin,
        reason: "Sub-page creation available to contributors",
      };

    case "collaborate":
      return {
        hasAccess: !!user && !isOwner,
        reason: user
          ? isOwner
            ? "Owners cannot collaborate with themselves"
            : "Can request collaboration"
          : "Login required",
      };

    default:
      return { hasAccess: true, reason: "Default access for approved K-DOM" };
  }
}

/**
 * Verifică accesul pentru K-DOM-uri în pending
 */
function checkPendingKDomAccess(
  action: string,
  status: KDomModerationStatus,
  permissions: {
    isOwner: boolean;
    isCollaborator: boolean;
    isModeratorOrAdmin: boolean;
  }
): KDomAccessCheckResult {
  const { isOwner, isCollaborator, isModeratorOrAdmin } = permissions;
  const hasLimitedAccess = isOwner || isCollaborator || isModeratorOrAdmin;

  if (!hasLimitedAccess) {
    return {
      hasAccess: false,
      reason: "This K-DOM is pending moderation and not yet publicly available",
      status,
      redirectTo: "/",
      showMessage: true,
    };
  }

  // Pentru utilizatorii cu acces limitat, verificăm acțiunea
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
        reason: isOwner
          ? "Owner can edit pending K-DOM"
          : isCollaborator
          ? "Collaborator can edit pending K-DOM"
          : "Cannot edit - pending moderation",
        status,
      };

    case "discussion":
    case "history":
    case "create-sub":
    case "collaborate":
      return {
        hasAccess: false,
        reason: "Feature unavailable while K-DOM is pending moderation",
        status,
        showMessage: true,
      };

    case "metadata":
      return {
        hasAccess: isOwner,
        reason: "Only owner can edit metadata of pending K-DOM",
        status,
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
 * Verifică accesul pentru K-DOM-uri respinse
 */
function checkRejectedKDomAccess(
  action: string,
  status: KDomModerationStatus,
  kdomWithModeration: KDomReadDtoWithModeration,
  permissions: { isOwner: boolean; isModeratorOrAdmin: boolean }
): KDomAccessCheckResult {
  const { isOwner, isModeratorOrAdmin } = permissions;

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
          : "Owner access to rejected K-DOM",
        status,
      };

    case "edit":
      // Owner poate edita pentru resubmitere (dacă implementăm feature-ul)
      return {
        hasAccess: false, // Temporar disabled până implementăm resubmiterea
        reason: "Cannot edit rejected K-DOM - resubmission feature coming soon",
        status,
      };

    case "discussion":
    case "history":
    case "create-sub":
    case "collaborate":
      return {
        hasAccess: false,
        reason: "Feature unavailable for rejected K-DOM",
        status,
        showMessage: true,
      };

    case "metadata":
      return {
        hasAccess: false,
        reason: "Cannot edit metadata of rejected K-DOM",
        status,
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
 * Hook suplimentar pentru verificări rapide
 */
export const useKDomViewAccess = (
  kdom?: KDomReadDto | KDomReadDtoWithModeration | null
) => {
  return useKDomAccess({ kdom, action: "view" });
};

export const useKDomEditAccess = (
  kdom?: KDomReadDto | KDomReadDtoWithModeration | null
) => {
  return useKDomAccess({ kdom, action: "edit" });
};

export const useKDomDiscussionAccess = (
  kdom?: KDomReadDto | KDomReadDtoWithModeration | null
) => {
  return useKDomAccess({ kdom, action: "discussion" });
};
