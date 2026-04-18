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
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ROUTES } from "@/constants/routes";
import { authApi } from "@/services/publicApi/authApi";
import { useAuthStore } from "@/store/authStore";
import { loginSchema, type LoginFormData } from "@/schemas/loginSchema";
import { toast } from "sonner";

function Login() {
  const { t } = useTranslation();
  const { t: auth } = useTranslation("auth");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (loginData: LoginFormData) => {
    try {
      const response = await authApi.login(loginData);
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

      if (data.role === "admin") {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else if (data.role === "staff") {
        navigate(ROUTES.ADMIN_INSPECTION);
      } else {
        navigate(ROUTES.HOME);
      }
      toast.success(auth("loginSuccess"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || auth("loginFailed") || "Login failed",
      );
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>{t("welcome", { appName: "VStay" })}</CardTitle>
        <CardDescription>{t("loginDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{auth("email")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder={auth("email")}
                  {...register("email")}
                />
                <InputGroupAddon align="inline-start">
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
              {errors.email ? (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
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
                  {...register("password")}
                />
                <InputGroupAddon align="inline-start">
                  <Lock />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  >
                    {isShowPassword ? <Eye /> : <EyeOff />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {errors.password ? (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
          </div>

          <Button type="submit" className="w-full mb-5" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              auth("login")
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col">
        <div className="flex justify-center items-center">
          <p className="text-sm text-muted-foreground">{auth("question")}</p>
          <Button
            onClick={() => navigate(ROUTES.REGISTER)}
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
