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
import { Textarea } from "@/components/ui/textarea";
import {
  createIdentitySchema,
  type CreateIdentityFormData,
} from "@/schemas/identitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

export interface IdentityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateIdentityFormData) => Promise<void>;
  isLoading?: boolean;
}

function IdentityForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: IdentityFormProps) {
  const { t } = useTranslation("user");
  const { t: commonT } = useTranslation("common");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateIdentityFormData>({
    resolver: zodResolver(createIdentitySchema),
    mode: "onTouched",
  });

  const handleFormSubmit: SubmitHandler<CreateIdentityFormData> = async (
    data,
  ) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /* error handling is done in parent component */
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{t("identityVerification.upload")}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="documentType">
              {t("identityVerification.documentType")}
              <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="DocumentType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="documentType">
                    <SelectValue
                      placeholder={t("identityVerification.documentType")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">
                      {t("identityVerification.passport")}
                    </SelectItem>
                    <SelectItem value="national_id_card">
                      {t("identityVerification.nationalIdCard")}
                    </SelectItem>
                    <SelectItem value="drivers_license">
                      {t("identityVerification.driverLicense")}
                    </SelectItem>
                    <SelectItem value="other_government_id">
                      {t("identityVerification.otherGovernmentId")}
                    </SelectItem>
                    <SelectItem value="selfie_with_id">
                      {t("identityVerification.selfieWithId")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="side">
              {t("identityVerification.side")}
              <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="Side"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="side">
                    <SelectValue placeholder={t("identityVerification.side")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front">
                      {t("identityVerification.front")}
                    </SelectItem>
                    <SelectItem value="back">
                      {t("identityVerification.back")}
                    </SelectItem>
                    <SelectItem value="bio_page">
                      {t("identityVerification.bioPage")}
                    </SelectItem>
                    <SelectItem value="other">
                      {t("identityVerification.other")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="file">
              {t("identityVerification.file")}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="file"
              type="file"
              accept="image/*,.pdf"
              {...register("Files")}
            />
            {errors.Files && (
              <p className="text-sm text-destructive">{errors.Files.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">{t("identityVerification.notes")}</Label>
            <Textarea
              id="notes"
              placeholder={t("identityVerification.enterNotes")}
              {...register("Notes")}
              rows={4}
            />
            {errors.Notes && (
              <p className="text-sm text-destructive">{errors.Notes.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isLoading}
            >
              {commonT("button.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {commonT("button.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default IdentityForm;
