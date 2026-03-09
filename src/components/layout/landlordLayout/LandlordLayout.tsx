import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import LandlordSideBar from "./LandlordSideBar";
import { Outlet } from "react-router-dom";

function LandlordLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <LandlordSideBar />

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

export default LandlordLayout;
