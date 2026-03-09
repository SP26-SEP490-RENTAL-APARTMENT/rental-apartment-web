import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";

function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSideBar />

        <main className="flex-1">
          <div className="p-4">
            <SidebarTrigger />
          </div>

          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;
