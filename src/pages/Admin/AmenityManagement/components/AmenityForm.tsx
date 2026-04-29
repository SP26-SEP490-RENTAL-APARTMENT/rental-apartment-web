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
  createAmenitySchema,
  updateAmenitySchema,
  type CreateAmenityFormData,
  type UpdateAmenityFormData,
} from "@/schemas/amenitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface AmenityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateAmenityFormData | UpdateAmenityFormData,
  ) => Promise<void>;
  amenity: CreateAmenityFormData | UpdateAmenityFormData | null;
  mode: "create" | "update";
}

function AmenityForm({
  isOpen,
  onClose,
  onSubmit,
  amenity,
  mode,
}: AmenityFormProps) {
  const isCreate = mode === "create";
  const schema = isCreate ? createAmenitySchema : updateAmenitySchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAmenityFormData | UpdateAmenityFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (isCreate) {
      reset({
        nameEn: "",
        nameVi: "",
      });
    } else if (amenity) {
      reset({
        nameEn: amenity.nameEn,
        nameVi: amenity.nameVi,
      });
    }
  }, [amenity, mode, reset, isCreate]);

  const handleFormSubmit = async (
    data: CreateAmenityFormData | UpdateAmenityFormData,
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
          <DialogTitle>{isCreate ? 'Create amenity' : 'Edit amenity'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nameEn">Name (EN)</Label>
              <Input
                id="nameEn"
                type="text"
                placeholder="EN"
                {...register("nameEn")}
              />
              {errors.nameEn && (
                <p className="text-sm text-destructive">
                  {errors.nameEn.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nameVi">Name (VN)</Label>
              <Input
                id="nameVi"
                type="text"
                placeholder="VN"
                {...register("nameVi")}
              />
              {errors.nameVi && (
                <p className="text-sm text-destructive">
                  {errors.nameVi.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isCreate ? 'Create' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AmenityForm;
