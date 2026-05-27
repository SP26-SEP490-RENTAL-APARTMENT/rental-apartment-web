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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OccupantFormData } from "@/schemas/occupantSchema";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { X, Upload } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (occupantData: OccupantFormData) => void;
}
function AddOccupantDialog({ open, onClose, onSubmit }: Props) {
  const { t } = useTranslation("landlord");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OccupantFormData>({
    defaultValues: {
      fullName: "",
      passportId: "",
      nationalIdCardNumber: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      nationality: "VN",
      sex: "male",
    },
  });

  const nationalityValue = watch("nationality");
  const genderValue = watch("sex");

  const handleClose = () => {
    reset();
    setImagePreview(null);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("proofPhoto", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("proofPhoto", undefined as any);
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleFormSubmit = async (data: OccupantFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("occupant.form.title")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {t("occupant.form.title1")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  {t("occupant.form.fullName")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder={t("occupant.form.fullName")}
                  {...register("fullName")}
                  className="transition-colors hover:border-gray-400"
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("occupant.form.email")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("occupant.form.email")}
                  {...register("email")}
                  className="transition-colors hover:border-gray-400"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  {t("occupant.form.phone")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t("occupant.form.phone")}
                  {...register("phone")}
                  className="transition-colors hover:border-gray-400"
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" className="text-sm font-medium">
                  {t("occupant.form.DOB")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  placeholder={t("occupant.form.DOB")}
                  {...register("dateOfBirth")}
                  className="transition-colors hover:border-gray-400"
                />
                {errors.dateOfBirth && (
                  <p className="text-xs text-destructive">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality" className="text-sm font-medium">
                  {t("occupant.form.nationality")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={nationalityValue}
                  onValueChange={(value) => setValue("nationality", value)}
                >
                  <SelectTrigger
                    id="nationality"
                    className="transition-colors hover:border-gray-400"
                  >
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VN">Vietnam</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.nationality && (
                  <p className="text-xs text-destructive">
                    {errors.nationality.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">
                  {t("occupant.form.gender")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={genderValue}
                  onValueChange={(value) => setValue("sex", value)}
                >
                  <SelectTrigger
                    id="gender"
                    className="transition-colors hover:border-gray-400"
                  >
                    <SelectValue placeholder="Select gender" />
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
            </div>
          </div>

          {/* ID Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {t("occupant.form.title2")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passport" className="text-sm font-medium">
                  {t("occupant.form.passport")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="passport"
                  type="text"
                  placeholder={t("occupant.form.passport")}
                  {...register("passportId")}
                  className="transition-colors hover:border-gray-400"
                />
                {errors.passportId && (
                  <p className="text-xs text-destructive">
                    {errors.passportId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId" className="text-sm font-medium">
                  {t("occupant.form.nationalID")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nationalId"
                  type="text"
                  placeholder={t("occupant.form.nationalID")}
                  {...register("nationalIdCardNumber")}
                  className="transition-colors hover:border-gray-400"
                />
                {errors.nationalIdCardNumber && (
                  <p className="text-xs text-destructive">
                    {errors.nationalIdCardNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Photo Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {t("occupant.form.title3")}
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                {/* Upload Area */}
                <div className="flex-1">
                  <label
                    htmlFor="file-input"
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">
                        {t("occupant.form.uploadImage")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF
                      </p>
                    </div>
                    <Input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preview Area */}
                {imagePreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <DialogFooter className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="px-6"
              disabled={isSubmitting}
            >
              {t("occupant.form.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t("occupant.form.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddOccupantDialog;
