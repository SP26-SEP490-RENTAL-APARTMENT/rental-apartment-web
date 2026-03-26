/**
 * Route Constants - Centralized route path definitions
 * Use these instead of hardcoding paths throughout the app
 */

// Auth Routes
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

// Public Routes
export const PUBLIC_ROUTES = {
  HOME: "/",
  APARTMENT_DETAIL: "/apartment-detail/:id",
} as const;

// Admin Routes
export const ADMIN_ROUTES = {
  DASHBOARD: "/admin/dashboard",
  USERS: "/admin/users",
  SUBSCRIPTION_PLANS: "/admin/subscription-plans",
  AMENITIES: "/admin/amenities",
  NEARBY_ATTRACTIONS: "/admin/nearby-attractions",
} as const;

// Landlord Routes
export const LANDLORD_ROUTES = {
  DASHBOARD: "/landlord/dashboard",
  APARTMENTS: "/landlord/apartments",
} as const;

// Tenant Routes
export const TENANT_ROUTES = {
  PROFILE: "/tenant/profile",
  DASHBOARD: "/tenant/dashboard",
} as const;

// Error Routes
export const ERROR_ROUTES = {
  NOT_FOUND: "*",
  UNAUTHORIZED: "/unauthorized",
  FORBIDDEN: "/forbidden",
} as const;

// All route paths as a single object for easier access
export const ROUTES = {
  // Auth
  LOGIN: AUTH_ROUTES.LOGIN,
  REGISTER: AUTH_ROUTES.REGISTER,

  // Public
  HOME: PUBLIC_ROUTES.HOME,
  APARTMENT_DETAIL: PUBLIC_ROUTES.APARTMENT_DETAIL,
  
  // Admin
  ADMIN_DASHBOARD: ADMIN_ROUTES.DASHBOARD,
  ADMIN_USERS: ADMIN_ROUTES.USERS,
  ADMIN_SUBSCRIPTION_PLANS: ADMIN_ROUTES.SUBSCRIPTION_PLANS,
  ADMIN_AMENITIES: ADMIN_ROUTES.AMENITIES,
  ADMIN_NEARBY_ATTRACTIONS: ADMIN_ROUTES.NEARBY_ATTRACTIONS,

  // Landlord
  LANDLORD_DASHBOARD: LANDLORD_ROUTES.DASHBOARD,
  LANDLORD_APARTMENTS: LANDLORD_ROUTES.APARTMENTS,

  // Tenant
  TENANT_PROFILE: TENANT_ROUTES.PROFILE,
  TENANT_DASHBOARD: TENANT_ROUTES.DASHBOARD,
  
  // Error
  NOT_FOUND: ERROR_ROUTES.NOT_FOUND,
  UNAUTHORIZED: ERROR_ROUTES.UNAUTHORIZED,
  FORBIDDEN: ERROR_ROUTES.FORBIDDEN,
} as const;

// Route path patterns for regex-based matching
export const ROUTE_PATTERNS = {
  ADMIN: /^\/admin/,
  LANDLORD: /^\/landlord/,
  TENANT: /^\/tenant/,
  AUTH: /^\/login|\/register/,
} as const;
