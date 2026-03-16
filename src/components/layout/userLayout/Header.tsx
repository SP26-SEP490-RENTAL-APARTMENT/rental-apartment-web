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

function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { t: auth } = useTranslation("auth");
  const { t: account } = useTranslation("account");
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-storage");
    window.location.href = "/";
  };

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("i18nextLng") || "en";
  });

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
              <img
                className="w-12 h-12 rounded-full object-cover border-2 cursor-pointer"
                src="https://ipwatchdog.com/wp-content/uploads/2018/03/pepe-the-frog-1272162_640.jpg"
                alt="Avatar"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>{account("myAccount")}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate("/tenant/profile")}>
                  {account("profile")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>{auth("logout")}</DropdownMenuItem>
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
