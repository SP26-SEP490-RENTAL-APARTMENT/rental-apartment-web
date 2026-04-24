import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";

import ApartmentDetail from "./pages/ApartmentDetail/ApartmentDetail";

import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement/UserManagement";
import SubsciptionPlan from "./pages/Admin/SubsciptionPlan/SubsciptionPlan";

import LandlordDashboard from "./pages/Landlord/LandlordDasboard/LandlordDashboard";
import ApartmentManagement from "./pages/Landlord/ApartmentManagement/ApartmentManagement";

import Profile from "./pages/Tenant/Profile/Profile";

import AuthenLayout from "./components/layout/authenLayout/AuthenLayout";
import UserLayout from "./components/layout/userLayout/UserLayout";
import AdminLayout from "./components/layout/adminLayout/AdminLayout";
import LandlordLayout from "./components/layout/landlordLayout/LandlordLayout";
import TenantLayout from "./components/layout/tenantLayout/TenantLayout";
import AmenityManagement from "./pages/Admin/AmenityManagement/AmenityManagement";
import NearbyAttractions from "./pages/Admin/NearbyAttractions/NearbyAttractions";
import PackageItemManagement from "./pages/Admin/PackageItem/PackageItemManagement";
import PackageManagement from "./pages/Admin/PackageManagement/PackageManagement";
import RoomManagement from "./pages/Landlord/RoomManagement/RoomManagement";
import BookingConfirm from "./pages/Tenant/Bookings/Confirm/BookingConfirm";
import Collections from "./pages/Tenant/Collections/Collections";
import DocumentsManagement from "./pages/Admin/DocumentsManagement/DocumentsManagement";
import Identity from "./pages/Tenant/Identity/Identity";
import WishlistPage from "./pages/Tenant/Wishlist/WishlistPage";
import ApproveListings from "./pages/Admin/ApproveListings/ApproveListings";
import BookingHistories from "./pages/Tenant/BookingHistory/BookingHistories";
import FinishPayment from "./pages/Tenant/FinishPayment/FinishPayment";
import BookingManagement from "./pages/Landlord/BookingManagement/BookingManagement";
import Inspections from "./pages/Admin/Inspection/Inspection";
import MySubscription from "./pages/Landlord/MySubscription/MySubscription";
import RequestResetPW from "./pages/Auth/RequestResetPW/RequestResetPW";
import ResetPWPage from "./pages/Auth/ResetPWPage/ResetPWPage";
import HomePage from "./pages/Home/Home";

/**
 * App Component - Simplified routing setup
 * All routes defined inline here for clarity
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========== Auth Routes ========== */}
        <Route element={<AuthenLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route
            path={ROUTES.REQUEST_RESET_PASSWORD}
            element={<RequestResetPW />}
          />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPWPage />} />
        </Route>

        {/* ========== Public Routes ========== */}
        <Route element={<UserLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.APARTMENT_DETAIL} element={<ApartmentDetail />} />
        </Route>

        {/* ========== Admin Routes ========== */}
        <Route element={<AdminLayout />}>
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_USERS}
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_SUBSCRIPTION_PLANS}
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <SubsciptionPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_AMENITIES}
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <AmenityManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_NEARBY_ATTRACTIONS}
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <NearbyAttractions />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_PACKAGE_ITEMS}
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <PackageItemManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_PACKAGE}
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <PackageManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_DOCUMENT}
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <DocumentsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_APPROVE_LISTINGS}
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <ApproveListings />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_INSPECTION}
            element={
              <ProtectedRoute requiredRoles={["admin", "staff"]}>
                <Inspections />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ========== Landlord Routes ========== */}
        <Route element={<LandlordLayout />}>
          <Route
            path={ROUTES.LANDLORD_DASHBOARD}
            element={
              <ProtectedRoute requiredRoles={["landlord", "tenant"]}>
                <LandlordDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.LANDLORD_APARTMENTS}
            element={
              <ProtectedRoute requiredRoles={["landlord", "tenant"]}>
                <ApartmentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.LANDLORD_ROOMS}
            element={
              <ProtectedRoute requiredRoles={["landlord", "tenant"]}>
                <RoomManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.LANDLORD_BOOKING_MANAGEMENT}
            element={
              <ProtectedRoute requiredRoles={["landlord", "tenant"]}>
                <BookingManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.LANDLORD_MY_SUBSCRIPTIONS}
            element={
              <ProtectedRoute requiredRoles={["landlord", "tenant"]}>
                <MySubscription />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ========== Tenant Routes ========== */}
        <Route element={<TenantLayout />}>
          <Route
            path={ROUTES.TENANT_PROFILE}
            element={
              <ProtectedRoute requiredRoles={["tenant", "landlord"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TENANT_IDENTITY}
            element={
              <ProtectedRoute requiredRoles={["tenant", "landlord"]}>
                <Identity />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TENANT_BOOKING_HISTORY}
            element={
              <ProtectedRoute requiredRoles={["tenant", "landlord"]}>
                <BookingHistories />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TENANT_COLLECTIONS}
            element={
              <ProtectedRoute requiredRoles={["tenant", "landlord"]}>
                <Collections />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TENANT_WISHLIST}
            element={
              <ProtectedRoute requiredRoles={["tenant", "landlord"]}>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path={ROUTES.TENANT_FINISH_PAYMENT}
          element={
            <ProtectedRoute requiredRoles={["tenant", "landlord"]}>
              <FinishPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TENANT_BOOKING_CONFIRM}
          element={
            <ProtectedRoute requiredRoles={["tenant", "landlord"]}>
              <BookingConfirm />
            </ProtectedRoute>
          }
        />

        {/* ========== Fallback - Unknown routes ========== */}
        {/* <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
