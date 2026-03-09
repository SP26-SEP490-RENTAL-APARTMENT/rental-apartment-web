import { Outlet } from "react-router-dom";

import TenantSideBar from "./TenantSideBar";

function TenantLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Custom Sidebar */}

      <TenantSideBar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default TenantLayout;
