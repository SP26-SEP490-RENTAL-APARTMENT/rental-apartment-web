import { NavLink } from "react-router-dom";
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
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Logo from "@/components/ui/logo/Logo";
import { useLandlordNavList } from "./landlordNavList";
import { useTranslation } from "react-i18next";
function LandlordSideBar() {
  const { t } = useTranslation("common");
  const { state } = useSidebar();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-storage");
    window.location.href = "/";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-5 py-6 flex justify-start items-center">
            {state === "expanded" && <Logo />}
          </SidebarGroupLabel>
          <hr className="my-2" />
          <SidebarGroupContent>
            <SidebarMenu>
              {useLandlordNavList().map((item) => {
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
              {state === "expanded" && <span>{t("button.logout")}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default LandlordSideBar;
