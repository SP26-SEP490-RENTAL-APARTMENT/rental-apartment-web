import { Building2 } from "lucide-react";
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
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/services/publicApi/authApi";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";

function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { t: auth } = useTranslation("auth");
  const { t: account } = useTranslation("account");
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
    <div className="px-3 py-5 flex justify-between shadow-b shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
      <div
        onClick={() => navigate("/")}
        className="flex gap-2 items-center cursor-pointer"
      >
        <span>
          <Building2 color="blue" size={35} />
        </span>
        <span className="text-blue-700 font-bold text-3xl">VStay</span>
      </div>
      <div className="flex gap-5 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">
              {language === "en" ? "English" : "Việt Nam"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={language}
                onValueChange={setLanguage}
              >
                <DropdownMenuRadioItem
                  onClick={() => i18next.changeLanguage("en")}
                  value="en"
                >
                  <div className="flex justify-between items-center w-full">
                    <span>English</span>
                    <img
                      className="w-6 h-6 rounded-full object-cover"
                      src="/src/assets/EN-Flag.png"
                      alt="English"
                    />
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  onClick={() => i18next.changeLanguage("vi")}
                  value="vi"
                >
                  <div className="flex justify-between items-center w-full gap-3">
                    <span>Việt Nam</span>
                    <img
                      className="w-6 h-6 rounded-full object-cover"
                      src="/src/assets/VN-Flag.png"
                      alt="Vietnamese"
                    />
                  </div>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-12 h-12 rounded-full object-cover border-2 cursor-pointer flex items-center justify-center bg-gray-500 text-white font-bold">
                <span>{user?.fullName?.charAt(0).toUpperCase()}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {/* <DropdownMenuLabel>{account("myAccount")}</DropdownMenuLabel> */}
                {user?.roles.includes("tenant") && (
                  <DropdownMenuItem onClick={() => navigate("/tenant/profile")}>
                    {account("profile")}
                  </DropdownMenuItem>
                )}
                {user?.roles.includes('landlord') && (
                  <DropdownMenuItem onClick={() => navigate(ROUTES.LANDLORD_APARTMENTS)}>
                    {account("landlordDashboard")}
                  </DropdownMenuItem>
                )}
                {user?.roles?.length === 1 && (
                  <>
                    {user.roles[0] === "tenant" && (
                      <DropdownMenuItem onClick={handleAddRole}>
                        {account("becomeHost")}
                      </DropdownMenuItem>
                    )}

                    {user.roles[0] === "landlord" && (
                      <DropdownMenuItem onClick={handleAddRole}>
                        {account("becomeTenant")}
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                {auth("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-3 items-center">
            <Button
              className="cursor-pointer"
              variant={"ghost"}
              onClick={() => navigate("/register")}
            >
              {auth("register")}
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => navigate("/login")}
            >
              {auth("login")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
