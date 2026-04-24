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
  const { t: commonT } = useTranslation('common');
  const { t: userT } = useTranslation('user');
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
      toast.success(commonT("toast.loginSuccess") || "Logged in successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || commonT("toast.loginFailed") || "Login failed",
      );
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>{commonT("description.welcome")}</CardTitle>
        <CardDescription>{commonT("description.welcome")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{userT("profile.email")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder={userT("profile.email")}
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
                <Label htmlFor="password">{userT("auth.password")}</Label>
                <a
                  href={ROUTES.REQUEST_RESET_PASSWORD}
                  className="text-blue-500 cursor-pointer hover:underline ml-auto"
                >
                  {userT("profile.forgotPassword")}
                </a>
              </div>
              <InputGroup>
                <InputGroupInput
                  type={isShowPassword ? "text" : "password"}
                  id="password"
                  placeholder={userT("auth.password")}
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
              commonT("button.login")
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col">
        <div className="flex justify-center items-center">
          <p className="text-sm text-muted-foreground">{commonT("description.question")}</p>
          <Button
            onClick={() => navigate(ROUTES.REGISTER)}
            className="text-blue-500 cursor-pointer"
            variant={"link"}
          >
            {commonT("button.register")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Login;