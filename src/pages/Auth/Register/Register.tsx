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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  registerSchema,
  type RegisterFormData,
} from "@/schemas/registerSchema";
import { authApi } from "@/services/publicApi/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

function Register() {
  const { t } = useTranslation();
  const { t: auth } = useTranslation("auth");

  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (registerData: RegisterFormData) => {
    try {
      await authApi.register({
        ...registerData,
        phone: String(registerData.phone),
      });
      toast.success(auth("registerSuccess"));
    } catch (error: any) {
      toast.error(error.response?.data?.message || auth("registerFailed"));
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle>{t("welcome", { appName: "VStay" })}</CardTitle>
        <CardDescription>{t("registerDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">{auth("fullName")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="name"
                  type="text"
                  placeholder={auth("fullName")}
                  {...register("fullName")}
                />
                <InputGroupAddon align="inline-start">
                  <UserRound />
                </InputGroupAddon>
              </InputGroup>
              {errors.fullName ? (
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              ) : null}
            </div>

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
              <Label htmlFor="phone">{auth("phone")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="phone"
                  type="tel"
                  placeholder="0849007..."
                  {...register("phone")}
                />
                <InputGroupAddon align="inline-start">
                  <Phone />
                </InputGroupAddon>
              </InputGroup>
              {errors.phone ? (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              ) : null}
            </div>

            <Controller
              name="role"
              control={control}
              defaultValue="tenant"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  <label className="border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors peer-data-[state=checked]:border-primary">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{auth("tenant")}</p>
                        <p className="text-sm text-muted-foreground">
                          {auth("tenantDescription")}
                        </p>
                      </div>
                      <RadioGroupItem
                        value="tenant"
                        id="tenant"
                        className="peer"
                      />
                    </div>
                  </label>
                  <label className="border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors peer-data-[state=checked]:border-primary">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{auth("landlord")}</p>
                        <p className="text-sm text-muted-foreground">
                          {auth("landlordDescription")}
                        </p>
                      </div>
                      <RadioGroupItem
                        value="landlord"
                        id="landlord"
                        className="peer"
                      />
                    </div>
                  </label>
                </RadioGroup>
              )}
            />

            <div className="grid gap-2">
              <Label htmlFor="password">{auth("password")}</Label>
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mb-5 cursor-pointer"
          >
            {auth("register")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default Register;
