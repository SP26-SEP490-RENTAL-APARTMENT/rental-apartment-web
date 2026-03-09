/**
 * Protected Route Component
 * Wraps routes that require authentication or specific roles
 */

import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  isAuthenticated,
  hasRole,
  getUserRole,
  AUTH_ENABLED,
} from "@/utils/routeGuard";
import { ROUTES } from "@/constants/routes";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

/**
 * ProtectedRoute component for authenticated routes
 */
export const ProtectedRoute = ({
  children,
  requiredRoles,
}: ProtectedRouteProps) => {
  // development shortcut
  if (!AUTH_ENABLED) {
    return <>{children}</>;
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check if user has required role
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = getUserRole();
    if (!hasRole(userRole, requiredRoles)) {
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  return <>{children}</>;
};
