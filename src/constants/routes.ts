/**
 * Route Constants - Centralized route path definitions
 * Use these instead of hardcoding paths throughout the app
 */

// Auth Routes
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  REQUEST_RESET_PASSWORD: "/request-reset-password",
  RESET_PASSWORD: "/reset-password",
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
  PACKAGE_ITEMS: "/admin/package-items",
  PACKAGE: "/admin/packages",
  DOCUMENT: "/admin/documents",
  APPROVE_LISTINGS: "/admin/approve-listings",
  INSPECTION: "/admin/inspection",
  APARTMENTS: "/admin/apartments",
} as const;

// Landlord Routes
export const LANDLORD_ROUTES = {
  DASHBOARD: "/landlord/dashboard",
  APARTMENTS: "/landlord/apartments",
  ROOMS: "/landlord/rooms",
  BOOKING_MANAGEMENT: "/landlord/booking-management",
  PAYMENT_HISTORY: "/landlord/payments-history",
  MY_SUBSCRIPTIONS: "/landlord/my-subscriptions",
} as const;

// Tenant Routes
export const TENANT_ROUTES = {
  PROFILE: "/tenant/profile",
  DASHBOARD: "/tenant/dashboard",
  BOOKING_HISTORY: "/tenant/booking-history",
  BOOKING_CONFIRM: "/tenant/booking-confirm",
  COLLECTIONS: "/tenant/collections",
  WISHLIST: "/tenant/wishlist/collections/:collectionId/items",
  IDENTITY: "/tenant/identity",
  FINISH_PAYMENT: "/payment/success",
  SUPPORT_REQUEST: "/tenant/support-request",
  PAYMENT_HISTORY: "/tenant/payment-history",
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
  REQUEST_RESET_PASSWORD: AUTH_ROUTES.REQUEST_RESET_PASSWORD,
  RESET_PASSWORD: AUTH_ROUTES.RESET_PASSWORD,

  // Public
  HOME: PUBLIC_ROUTES.HOME,
  APARTMENT_DETAIL: PUBLIC_ROUTES.APARTMENT_DETAIL,

  // Admin
  ADMIN_DASHBOARD: ADMIN_ROUTES.DASHBOARD,
  ADMIN_USERS: ADMIN_ROUTES.USERS,
  ADMIN_SUBSCRIPTION_PLANS: ADMIN_ROUTES.SUBSCRIPTION_PLANS,
  ADMIN_AMENITIES: ADMIN_ROUTES.AMENITIES,
  ADMIN_NEARBY_ATTRACTIONS: ADMIN_ROUTES.NEARBY_ATTRACTIONS,
  ADMIN_PACKAGE_ITEMS: ADMIN_ROUTES.PACKAGE_ITEMS,
  ADMIN_PACKAGE: ADMIN_ROUTES.PACKAGE,
  ADMIN_DOCUMENT: ADMIN_ROUTES.DOCUMENT,
  ADMIN_APPROVE_LISTINGS: ADMIN_ROUTES.APPROVE_LISTINGS,
  ADMIN_INSPECTION: ADMIN_ROUTES.INSPECTION,
  ADMIN_APARTMENTS: ADMIN_ROUTES.APARTMENTS,

  // Landlord
  LANDLORD_DASHBOARD: LANDLORD_ROUTES.DASHBOARD,
  LANDLORD_APARTMENTS: LANDLORD_ROUTES.APARTMENTS,
  LANDLORD_ROOMS: LANDLORD_ROUTES.ROOMS,
  LANDLORD_BOOKING_MANAGEMENT: LANDLORD_ROUTES.BOOKING_MANAGEMENT,
  LANDLORD_MY_SUBSCRIPTIONS: LANDLORD_ROUTES.MY_SUBSCRIPTIONS,
  LANDLORD_PAYMENT_HISTORY: LANDLORD_ROUTES.PAYMENT_HISTORY,

  // Tenant
  TENANT_PROFILE: TENANT_ROUTES.PROFILE,
  TENANT_DASHBOARD: TENANT_ROUTES.DASHBOARD,
  TENANT_BOOKING_HISTORY: TENANT_ROUTES.BOOKING_HISTORY,
  TENANT_BOOKING_CONFIRM: TENANT_ROUTES.BOOKING_CONFIRM,
  TENANT_COLLECTIONS: TENANT_ROUTES.COLLECTIONS,
  TENANT_WISHLIST: TENANT_ROUTES.WISHLIST,
  TENANT_IDENTITY: TENANT_ROUTES.IDENTITY,
  TENANT_FINISH_PAYMENT: TENANT_ROUTES.FINISH_PAYMENT,
  TENANT_SUPPORT_REQUEST: TENANT_ROUTES.SUPPORT_REQUEST,
  TENANT_PAYMENT_HISTORY: TENANT_ROUTES.PAYMENT_HISTORY,

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
