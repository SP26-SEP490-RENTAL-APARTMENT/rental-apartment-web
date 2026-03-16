/**
 * Route Guard utility for protecting routes
 * Minimal setup for simplified routing
 */

import { useAuthStore } from "@/store/authStore";

/**
 * Development toggle
 * Set to false during development to skip auth checks
 * Set to true when API is ready for production
 */
export const AUTH_ENABLED = true;

/**
 * Interface for route access configuration
 */
export interface RouteAccessConfig {
  requireAuth?: boolean;
  requiredRoles?: string[];
}

/**
 * Check if user has required role
 */
export const hasRole = (
  userRole: string | null,
  requiredRoles?: string[],
): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
};

/**
 * Check if user is authenticated
 * In dev mode (AUTH_ENABLED=false): always returns true
 * In prod mode: checks actual auth store
 */
export const isAuthenticated = (): boolean => {
  if (!AUTH_ENABLED) {
    return true; // dev mode: bypass auth
  }

  try {
    const token = useAuthStore.getState().accessToken;
    const user = useAuthStore.getState().user;
    return !!(token && user);
  } catch {
    return false;
  }
};

/**
 * Get user role from auth store
 * In dev mode: returns 'ADMIN' so all pages are accessible
 * In prod mode: returns actual user role
 */
export const getUserRole = (): string | null => {
  if (!AUTH_ENABLED) {
    return "ADMIN"; // dev mode: default to admin role
  }

  try {
    const user = useAuthStore.getState().user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (((user as any) || {}).role as string | null) || null;
  } catch {
    return null;
  }
};
