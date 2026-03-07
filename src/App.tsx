import { BrowserRouter, Route, Routes } from "react-router-dom";
import publicRoutes from "./routes/publicRoutes";
import Login from "./pages/Login/Login";
import UserLayout from "./components/layout/userLayout/UserLayout";
import Register from "./pages/Register/Register";
import AuthenLayout from "./components/layout/authenLayout/AuthenLayout";
import AdminLayout from "./components/layout/adminLayout/AdminLayout";
import adminRoutes from "./routes/privateRoutes/adminRoutes";
import LandlordLayout from "./components/layout/landlordLayout/LandlordLayout";
import landlordRoutes from "./routes/privateRoutes/landlordRoutes";
import TenantLayout from "./components/layout/tenantLayout/TenantLayout";
import { tenantRoutes } from "./routes/privateRoutes/tenantRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth layout */}
        <Route element={<AuthenLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Public routes */}
        <Route element={<UserLayout />}>
          {publicRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          {adminRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>

        {/* Landlord routes */}
        <Route element={<LandlordLayout />}>
          {landlordRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>

        {/* Tenant routes */}
        <Route element={<TenantLayout />}>
          {tenantRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
