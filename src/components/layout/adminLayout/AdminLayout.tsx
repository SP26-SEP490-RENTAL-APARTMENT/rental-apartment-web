import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
