import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

function Header() {
  const navigate = useNavigate();
  const {t} = useTranslation()

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
                <DropdownMenuRadioItem onClick={() => i18next.changeLanguage('en')} value="en">
                  English
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem onClick={() => i18next.changeLanguage('vi')} value="vi">
                  Việt Nam
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex gap-3 items-center">
          <Button
            className="cursor-pointer"
            variant={"ghost"}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
          <Button className="cursor-pointer" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Header;
