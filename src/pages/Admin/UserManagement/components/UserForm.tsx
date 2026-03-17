import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => Promise<void>;
  user?: {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    role: "admin" | "tenant" | "landlord" | "staff";
    identityVerified: boolean;
  } | null;
  mode: "create" | "update";
}

function UserForm({ isOpen, onClose, onSubmit, user, mode }: UserFormProps) {
  const { t } = useTranslation();
  const { t: userTranslation } = useTranslation("user");
  const { t: authTranslation } = useTranslation("auth");

  const isCreate = mode === "create";
  const schema = isCreate ? createUserSchema : updateUserSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const watchedRole = watch("role");
  const watchedIdentityVerified = watch("identityVerified");

  // Reset form when user or mode changes
  useEffect(() => {
    if (isCreate) {
      reset({
        email: "",
        password: "",
        role: "tenant",
        fullName: "",
        phone: "",
        identityVerified: false,
      });
    } else if (user) {
      reset({
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone,
        identityVerified: user.identityVerified,
      });
    }
  }, [user, mode, reset, isCreate]);

  const handleFormSubmit = async (
    data: CreateUserFormData | UpdateUserFormData,
  ) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isCreate
              ? userTranslation("createUser")
              : userTranslation("updateUser")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">{userTranslation("name")}</Label>
              <Input
                id="fullName"
                type="text"
                placeholder={userTranslation("name")}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{userTranslation("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={userTranslation("email")}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {isCreate && (
              <div className="grid gap-2">
                <Label htmlFor="password">{authTranslation("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={authTranslation("password")}
                  {...register("password")}
                />
                {(errors as any).password && (
                  <p className="text-sm text-destructive">
                    {(errors as any).password.message}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="phone">{userTranslation("phone")}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={userTranslation("phone")}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>{userTranslation("role")}</Label>
              <RadioGroup
                value={watchedRole}
                onValueChange={(value) => setValue("role", value as any)}
                className="flex gap-6"
              >
                {/* <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tenant" id="tenant" />
                  <Label htmlFor="tenant">{userTranslation("tenant")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="landlord" id="landlord" />
                  <Label htmlFor="landlord">
                    {userTranslation("landlord")}
                  </Label>
                </div> */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="staff" id="staff" />
                  <Label htmlFor="staff">{userTranslation("staff")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">{userTranslation("admin")}</Label>
                </div>
              </RadioGroup>
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>{userTranslation("verified")}</Label>
              <RadioGroup
                value={watchedIdentityVerified ? "true" : "false"}
                onValueChange={(value) =>
                  setValue("identityVerified", value === "true")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="verified-yes" />
                  <Label htmlFor="verified-yes">{t("yes")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="verified-no" />
                  <Label htmlFor="verified-no">{t("no")}</Label>
                </div>
              </RadioGroup>
              {errors.identityVerified && (
                <p className="text-sm text-destructive">
                  {errors.identityVerified.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("loading")
                : isCreate
                  ? t("create")
                  : t("update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UserForm;
