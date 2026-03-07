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
import { Eye, EyeOff, Lock, Mail, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Register() {
  const { t } = useTranslation();
  const { t: auth } = useTranslation("auth");

  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>{t("welcome", { appName: "VStay" })}</CardTitle>
        <CardDescription>{t("registerDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">{auth("fullName")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="name"
                  type="text"
                  placeholder={auth("fullName")}
                />
                <InputGroupAddon align="inline-start">
                  <UserRound />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{auth("email")}</Label>
              <InputGroup>
                <InputGroupInput id="email" type="email" placeholder={auth("email")} />
                <InputGroupAddon align="inline-start">
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">{auth("phone")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="phone"
                  type="tel"
                  placeholder="0849007..."
                />
                <InputGroupAddon align="inline-start">
                  <Phone />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">{auth("password")}</Label>
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
        <Button className="w-full mb-5 cursor-pointer">{auth("register")}</Button>
        {/* <div className="flex justify-center items-center">
          <Button
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer"
            variant={"link"}
          >
            Login
          </Button>
        </div> */}
      </CardFooter>
    </Card>
  );
}

export default Register;
