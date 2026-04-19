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
interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserProfileFormData) => void;
  profileData: UserProfile | null;
}
function ProfileDialog({ open, onClose, onSubmit, profileData }: Props) {
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
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input {...register("fullName")} placeholder="Enter full name" />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Sex */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <select
              {...register("sex")}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.sex && (
              <p className="text-sm text-red-500">{errors.sex.message}</p>
            )}
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <Label>Birthday</Label>
            <Input type="date" {...register("birthday")} />
            {errors.birthday && (
              <p className="text-sm text-red-500">{errors.birthday.message}</p>
            )}
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label>Nationality</Label>
            <select
              {...register("nationality")}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="VN">VietNam</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.nationality && (
              <p className="text-sm text-red-500">
                {errors.nationality.message}
              </p>
            )}
          </div>

          {/* National ID */}
          <div className="space-y-2">
            <Label>National ID</Label>
            <Input {...register("nationalIdCardNumber")} />
            {errors.nationalIdCardNumber && (
              <p className="text-sm text-red-500">
                {errors.nationalIdCardNumber.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileDialog;
