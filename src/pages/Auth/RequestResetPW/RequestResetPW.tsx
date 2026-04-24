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
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { authApi } from "@/services/publicApi/authApi";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function RequestResetPW() {
  const { t } = useTranslation("common");
  const { t: userT } = useTranslation("user");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authApi.requestResetPW(email);
      toast.success("Verification code sent to your email");
      setTimeout(() => {
        navigate(`/reset-password?email=${email}`);
      }, 2000);
    } catch (error) {
      console.log(error);
      
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>{t("description.enterEmail")}</CardTitle>
        <CardDescription>
          {t("description.requestResetPassword")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{userT("profile.email")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder={userT("profile.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputGroupAddon align="inline-start">
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <Button type="submit" className="w-full mb-5" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              t("button.sendCode")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default RequestResetPW;