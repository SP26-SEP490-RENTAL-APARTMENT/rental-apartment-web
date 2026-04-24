import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  userProfileSchema,
  type UserProfileFormData,
} from "@/schemas/userProfileSchema";
import type { UserProfile } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserProfileFormData) => void;
  profileData: UserProfile | null;
}
function ProfileDialog({ open, onClose, onSubmit, profileData }: Props) {
  const {t} = useTranslation("user");
  const { t: commonT } = useTranslation("common");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    mode: "onTouched",
    defaultValues: {
      birthday: profileData?.birthday || "",
      email: profileData?.email || "",
      fullName: profileData?.fullName || "",
      nationalIdCardNumber: profileData?.nationalIdCardNumber || "",
      nationality: profileData?.nationality || "VN",
      phone: profileData?.phone || "",
      sex: profileData?.sex || "male",
    },
  });

  const handleSubmitForm = async (data: UserProfileFormData) => {
    try {
      onSubmit(data);
      reset();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error handling is done in the parent component
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{commonT("button.edit")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label>{t("profile.name")}</Label>
            <Input {...register("fullName")} placeholder={t("profile.name")} />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>{t("profile.email")}</Label>
            <Input type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>{t("profile.phone")}</Label>
            <Input {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Sex */}
          <div className="space-y-2">
            <Label>{t("profile.gender")}</Label>
            <select
              {...register("sex")}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="male">{t("profile.male")}</option>
              <option value="female">{t("profile.female")}</option>
            </select>
            {errors.sex && (
              <p className="text-sm text-red-500">{errors.sex.message}</p>
            )}
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <Label>{t("profile.birthday")}</Label>
            <Input type="date" {...register("birthday")} />
            {errors.birthday && (
              <p className="text-sm text-red-500">{errors.birthday.message}</p>
            )}
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label>{t("profile.nationality")}</Label>
            <select
              {...register("nationality")}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="VN">{t("profile.vietnam")}</option>
              <option value="OTHER">{t("profile.other")}</option>
            </select>
            {errors.nationality && (
              <p className="text-sm text-red-500">
                {errors.nationality.message}
              </p>
            )}
          </div>

          {/* National ID */}
          <div className="space-y-2">
            <Label>{t("profile.nationalID")}</Label>
            <Input {...register("nationalIdCardNumber")} />
            {errors.nationalIdCardNumber && (
              <p className="text-sm text-red-500">
                {errors.nationalIdCardNumber.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {commonT("button.save")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileDialog;
