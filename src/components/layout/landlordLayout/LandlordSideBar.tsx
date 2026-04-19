import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { landlordNavList } from "./landlordNavList";
import { Building2, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
function LandlordSideBar() {
  const { state } = useSidebar();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-storage");
    window.location.href = "/";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="p-5 flex justify-start items-center">
            {state === "expanded" && (
              <div
                onClick={() => navigate("/")}
                className="flex gap-2 items-center cursor-pointer justify-center"
              >
                <span>
                  <Building2 color="blue" size={35} />
                </span>
                <span className="text-blue-700 font-bold text-3xl">VStay</span>
              </div>
            )}
          </SidebarGroupLabel>
          <hr className="my-2" />
          <SidebarGroupContent>
            <SidebarMenu>
              {landlordNavList.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url} end>
                      {({ isActive }) => (
                        <SidebarMenuButton asChild isActive={isActive}>
                          <a className="flex items-center gap-2 w-full px-2 py-2 rounded-md transition">
                            <Icon className="h-4 w-4" />
                            {state === "expanded" && <span>{item.title}</span>}
                          </a>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer logout */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              {state === "expanded" && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default LandlordSideBar;
