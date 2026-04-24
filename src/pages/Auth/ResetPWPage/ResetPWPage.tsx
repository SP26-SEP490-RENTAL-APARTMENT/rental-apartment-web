import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { authApi } from "@/services/publicApi/authApi";
import { Check, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function ResetPWPage() {
  const { t: userT } = useTranslation("user");
  const { t: commonT } = useTranslation("common");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      email: searchParams.get("email") || "",
    }));
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authApi.resetPW({
        emailAddress: form.email,
        verificationCode: form.code,
        newPassword: form.password,
        confirmNewPassword: form.confirmPassword,
      });
      toast.success(
        "Password reset successfully. You can now log in with your new password.",
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);

      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>{commonT("description.resetPassword")}</CardTitle>
        <CardDescription>{commonT("description.setNewPassword")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleResetPassword}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{userT("profile.email")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder={userT("profile.email")}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <InputGroupAddon align="inline-start">
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code">{userT("auth.verificationCode")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="code"
                  type="text"
                  placeholder={userT("auth.verificationCode")}
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                />
                <InputGroupAddon align="inline-start">
                  <Check />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">{userT("auth.password")}</Label>
              <InputGroup>
                <InputGroupInput
                  type={isShowPassword ? "text" : "password"}
                  id="password"
                  placeholder={userT("auth.password")}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">{userT("auth.confirmPassword")}</Label>
              <InputGroup>
                <InputGroupInput
                  type={isShowPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder={userT("auth.confirmPassword")}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
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
            </div>
          </div>

          <Button type="submit" className="w-full mb-5" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              userT("auth.resetPassword")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ResetPWPage;