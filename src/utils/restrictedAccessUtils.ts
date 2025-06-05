// src/utils/restrictedAccessUtils.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type {
  KDomAccessCheckResult,
  KDomModerationStatus,
} from "@/types/Moderation";

/**
 * Hook pentru utilizarea facilă a componentei
 */
export function useRestrictedAccessRedirect(
  accessResult: KDomAccessCheckResult,
  options?: {
    autoRedirect?: boolean;
    redirectDelay?: number;
  }
) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessResult.hasAccess && accessResult.redirectTo) {
      if (options?.autoRedirect !== false) {
        const timer = setTimeout(() => {
          navigate(accessResult.redirectTo!);
        }, options?.redirectDelay || 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [accessResult, navigate, options]);

  return accessResult;
}

/**
 * Helper pentru determinarea statusului de alert
 */
export function getAlertStatus(status?: KDomModerationStatus) {
  switch (status) {
    case "Pending":
      return "warning";
    case "Rejected":
    case "Deleted":
      return "error";
    default:
      return "info";
  }
}
