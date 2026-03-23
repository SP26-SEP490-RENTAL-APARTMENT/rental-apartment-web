import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages - Auth
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// Pages - Public
import Home from "./pages/Home/Home";
import ApartmentDetail from "./pages/ApartmentDetail/ApartmentDetail";

// Pages - Admin
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement/UserManagement";
import SubsciptionPlan from "./pages/Admin/SubsciptionPlan/SubsciptionPlan";

// Pages - Landlord
import LandlordDashboard from "./pages/Landlord/LandlordDasboard/LandlordDashboard";
import ApartmentManagement from "./pages/Landlord/ApartmentManagement/ApartmentManagement";

// Pages - Tenant
import Profile from "./pages/Tenant/Profile/Profile";

// Layouts
import AuthenLayout from "./components/layout/authenLayout/AuthenLayout";
import UserLayout from "./components/layout/userLayout/UserLayout";
import AdminLayout from "./components/layout/adminLayout/AdminLayout";
import LandlordLayout from "./components/layout/landlordLayout/LandlordLayout";
import TenantLayout from "./components/layout/tenantLayout/TenantLayout";
import AmenityManagement from "./pages/Admin/AmenityManagement/AmenityManagement";

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
        </Route>

        {/* ========== Public Routes ========== */}
        <Route element={<UserLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
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
        </Route>

        {/* ========== Landlord Routes ========== */}
        <Route element={<LandlordLayout />}>
          <Route
            path={ROUTES.LANDLORD_DASHBOARD}
            element={
              <ProtectedRoute requiredRoles={["landlord"]}>
                <LandlordDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.LANDLORD_APARTMENTS}
            element={
              <ProtectedRoute requiredRoles={["landlord"]}>
                <ApartmentManagement />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ========== Tenant Routes ========== */}
        <Route element={<TenantLayout />}>
          <Route
            path={ROUTES.TENANT_PROFILE}
            element={
              <ProtectedRoute requiredRoles={["tenant"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ========== Fallback - Unknown routes ========== */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
