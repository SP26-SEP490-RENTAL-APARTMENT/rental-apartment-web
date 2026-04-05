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
  const { t } = useTranslation();
  const { t: identityT } = useTranslation("identity");
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
          <DialogTitle>{identityT("createIdentity")}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="documentType">
              {identityT("documentType")}
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
                      placeholder={identityT("selectDocumentType")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">
                      {identityT("passport")}
                    </SelectItem>
                    <SelectItem value="national_id_card">
                      {identityT("nationalIdCard")}
                    </SelectItem>
                    <SelectItem value="drivers_license">
                      {identityT("driversLicense")}
                    </SelectItem>
                    <SelectItem value="other_government_id">
                      {identityT("otherGovernmentId")}
                    </SelectItem>
                    <SelectItem value="selfie_with_id">
                      {identityT("selfieWithId")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.DocumentType && (
              <p className="text-sm text-destructive">
                {errors.DocumentType.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="side">
              {identityT("side")}
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
                    <SelectValue placeholder={identityT("selectSide")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front">{identityT("front")}</SelectItem>
                    <SelectItem value="back">{identityT("back")}</SelectItem>
                    <SelectItem value="bio_page">
                      {identityT("bioPage")}
                    </SelectItem>
                    <SelectItem value="other">{identityT("other")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.Side && (
              <p className="text-sm text-destructive">{errors.Side.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="file">
              {identityT("file")}
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
            <Label htmlFor="notes">{identityT("notes")}</Label>
            <Textarea
              id="notes"
              placeholder={identityT("enterNotes")}
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
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading
                ? identityT("submitting")
                : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default IdentityForm;
