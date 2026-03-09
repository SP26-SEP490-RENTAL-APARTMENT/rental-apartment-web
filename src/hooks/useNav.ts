/**
 * Simple navigation hook
 * Just wraps useNavigate from React Router
 */

import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";
import { ROUTES } from "@/constants/routes";

/**
 * Simple hook for navigation
 * Usage: const { go, goHome } = useNav()
 */
export function useNav() {
  const navigate = useNavigate();

  return {
    // Universal: navigate to any path
    go: useCallback((path: string) => navigate(path), [navigate]),

    // Specific shortcuts
    goHome: useCallback(() => navigate(ROUTES.HOME), [navigate]),
    goLogin: useCallback(() => navigate(ROUTES.LOGIN), [navigate]),
    goAdminDashboard: useCallback(
      () => navigate(ROUTES.ADMIN_DASHBOARD),
      [navigate],
    ),
    goAdminUsers: useCallback(() => navigate(ROUTES.ADMIN_USERS), [navigate]),
    goLandlordDashboard: useCallback(
      () => navigate(ROUTES.LANDLORD_DASHBOARD),
      [navigate],
    ),
    goLandlordApartments: useCallback(
      () => navigate(ROUTES.LANDLORD_APARTMENTS),
      [navigate],
    ),
    goTenantProfile: useCallback(
      () => navigate(ROUTES.TENANT_PROFILE),
      [navigate],
    ),

    // Back
    goBack: useCallback(() => navigate(-1), [navigate]),
  };
}

/**
 * Hook to get current route
 */
export function useCurrentRoute() {
  const location = useLocation();
  return {
    path: location.pathname,
    search: location.search,
  };
}
