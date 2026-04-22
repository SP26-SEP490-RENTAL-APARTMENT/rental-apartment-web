import { Building2, Menu, LogOut, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/services/publicApi/authApi";

import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  const { logout, user, login } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-storage");
    window.location.href = "/";
  };

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("i18nextLng") || "en";
  });

  const isLandlord = user?.role === "landlord" ? "tenant" : "landlord";

  const handleAddRole = async () => {
    try {
      const response = await authApi.addRole({ targetRole: isLandlord });
      const data = response.data;
      login(
        {
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          roles: data.roles,
          nationality: data.nationality,
          subscriptionPlanId: data.subscriptionPlanId,
        },
        data.accessToken,
        data.refreshToken,
      );
      toast.success(
        user?.role === "landlord"
          ? "You are now a tenant!"
          : "You are now a landlord!",
      );
    } catch (error) {
      console.log(error);

      toast.error("Failed to update role.");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex gap-2 items-center cursor-pointer group transition-transform hover:scale-105"
          >
            <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-lg p-2">
              <Building2 color="white" size={28} />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              VStay
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {language === "en" ? "EN" : "VI"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={language}
                  onValueChange={setLanguage}
                >
                  <DropdownMenuRadioItem
                    onClick={() => i18next.changeLanguage("en")}
                    value="en"
                  >
                    English
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    onClick={() => i18next.changeLanguage("vi")}
                    value="vi"
                  >
                    Tiếng Việt
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{user?.fullName}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {user?.role === "tenant" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => navigate("/tenant/profile")}
                          className="cursor-pointer"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/tenant/booking-history")}
                          className="cursor-pointer"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          <span>Booking History</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    {user?.role === "landlord" && (
                      <DropdownMenuItem
                        onClick={() => navigate("/landlord/dashboard")}
                        className="cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Landlord Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    {user?.role === "admin" && (
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/dashboard")}
                        className="cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleAddRole}
                    className="cursor-pointer"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>
                      Switch to {isLandlord === "landlord" ? "Landlord" : "Tenant"}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="text-sm"
                >
                  {t("button.login")}
                </Button>
                <Button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  {t("button.register")}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {language === "en" ? "English" : "Tiếng Việt"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={language}
                      onValueChange={setLanguage}
                    >
                      <DropdownMenuRadioItem
                        onClick={() => i18next.changeLanguage("en")}
                        value="en"
                      >
                        English
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        onClick={() => i18next.changeLanguage("vi")}
                        value="vi"
                      >
                        Tiếng Việt
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate("/tenant/profile")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleAddRole}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Switch Role
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(ROUTES.LOGIN)}
                    >
                      {t("button.login")}
                    </Button>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate(ROUTES.REGISTER)}
                    >
                      {t("button.register")}
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
                  
