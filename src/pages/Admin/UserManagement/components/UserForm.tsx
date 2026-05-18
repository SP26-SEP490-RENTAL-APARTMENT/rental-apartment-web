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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { UserProfile } from "@/types/user";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => Promise<void>;
  user?: UserProfile | null;
  mode: "create" | "update";
}

function UserForm({ isOpen, onClose, onSubmit, user, mode }: UserFormProps) {
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
        role: "staff",
        fullName: "",
        phone: "",
        identityVerified: false,
        birthday: "",
        nationalIdCardNumber: "",
        nationality: "VN",
        sex: "male",
      });
    } else if (user) {
      reset({
        email: user.email || "",
        // Ensure role has the correct literal union type expected by the form
        role: (user.role ?? "staff") as UpdateUserFormData["role"],
        fullName: user.fullName || "",
        phone: user.phone || "",
        identityVerified: user.identityVerified || false,
        nationality: user.nationality || "VN",
        nationalIdCardNumber: user.nationalIdCardNumber || "",
        birthday: user.birthday || "",
        sex: user.sex || "male",
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
          <DialogTitle>{isCreate ? "Create User" : "Update User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
          <div className="grid gap-3 py-3">
            {/* Full width fields */}
            <div className="grid gap-1.5">
              <Label htmlFor="fullName">Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone number"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="birthday">Birthday</Label>
                <Input id="birthday" type="date" {...register("birthday")} />
                {errors.birthday && (
                  <p className="text-xs text-destructive">
                    {errors.birthday.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="sex">Sex</Label>
                <Select
                  value={watch("sex")}
                  onValueChange={(value) => setValue("sex", value)}
                >
                  <SelectTrigger id="sex">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sex && (
                  <p className="text-xs text-destructive">
                    {errors.sex.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="nationality">Nationality</Label>
                <Select
                  value={watch("nationality")}
                  onValueChange={(value) => setValue("nationality", value)}
                >
                  <SelectTrigger id="nationality">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VN">Vietnam</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.nationality && (
                  <p className="text-xs text-destructive">
                    {errors.nationality.message}
                  </p>
                )}
              </div>

              {isCreate && (
                <div className="grid gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                  />
                  {(errors as any).password && (
                    <p className="text-xs text-destructive">
                      {(errors as any).password.message}
                    </p>
                  )}
                </div>
              )}

              <div className="grid gap-1.5">
                <Label htmlFor="nationalIdCardNumber">ID Card</Label>
                <Input
                  id="nationalIdCardNumber"
                  type="text"
                  placeholder="ID number"
                  {...register("nationalIdCardNumber")}
                />
                {errors.nationalIdCardNumber && (
                  <p className="text-xs text-destructive">
                    {errors.nationalIdCardNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Checkboxes/Radios */}
            <div className="grid gap-1.5">
              <Label className="text-sm">Role</Label>
              <RadioGroup
                value={watchedRole}
                onValueChange={(value) => setValue("role", value as any)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="staff" id="staff" />
                  <Label htmlFor="staff" className="font-normal text-sm">
                    Staff
                  </Label>
                </div>
              </RadioGroup>
              {errors.role && (
                <p className="text-xs text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label className="text-sm">Verified</Label>
              <RadioGroup
                value={watchedIdentityVerified ? "true" : "false"}
                onValueChange={(value) =>
                  setValue("identityVerified", value === "true")
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="verified-yes" />
                  <Label htmlFor="verified-yes" className="font-normal text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="verified-no" />
                  <Label htmlFor="verified-no" className="font-normal text-sm">
                    No
                  </Label>
                </div>
              </RadioGroup>
              {errors.identityVerified && (
                <p className="text-xs text-destructive">
                  {errors.identityVerified.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : isCreate ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UserForm;
