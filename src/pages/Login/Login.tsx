import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Login() {
  const { t } = useTranslation();
  const { t: auth } = useTranslation("auth");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>{t("welcome", { appName: "VStay" })}</CardTitle>
        <CardDescription>{t("loginDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{auth("email")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder={auth("email")}
                />
                <InputGroupAddon align="inline-start">
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{auth("password")}</Label>
                <a
                  href="#"
                  className="text-blue-500 cursor-pointer hover:underline ml-auto"
                >
                  {auth("forgotPassword")}
                </a>
              </div>
              <InputGroup>
                <InputGroupInput
                  type={isShowPassword ? "text" : "password"}
                  id="password"
                  placeholder={auth("password")}
                />
                <InputGroupAddon align="inline-start">
                  <Lock />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  >
                    {isShowPassword ? <Eye /> : <EyeOff />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col">
        <Button className="w-full mb-5 cursor-pointer">{auth("login")}</Button>
        <div className="flex justify-center items-center">
          <p>Don't have an account?</p>
          <Button
            onClick={() => navigate("/register")}
            className="text-blue-500 cursor-pointer"
            variant={"link"}
          >
            {auth("signup")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Login;
