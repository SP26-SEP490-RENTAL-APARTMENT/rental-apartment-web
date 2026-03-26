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
import { Controller } from "react-hook-form";
import {
  createNearbyAttractionSchema,
  updateNearbyAttractionSchema,
  type CreateNearbyAttractionFormData,
  type UpdateNearbyAttractionFormData,
} from "@/schemas/nearbyAttractionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { NearbyAttraction } from "@/types/nearbyAttraction";

export interface NearbyAttractionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateNearbyAttractionFormData | UpdateNearbyAttractionFormData,
  ) => Promise<void>;
  attraction: NearbyAttraction | null;
  mode: "create" | "update";
}

function NearbyAttractionForm({
  isOpen,
  onClose,
  onSubmit,
  attraction,
  mode,
}: NearbyAttractionFormProps) {
  const { t } = useTranslation();
  const isCreate = mode === "create";
  const schema = isCreate
    ? createNearbyAttractionSchema
    : updateNearbyAttractionSchema;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateNearbyAttractionFormData | UpdateNearbyAttractionFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (isCreate) {
      reset({
        nameEn: "",
        nameVi: "",
        type: "",
        latitude: 0,
        longitude: 0,
        address: "",
        city: "",
      });
    } else if (attraction) {
      reset({
        nameEn: attraction.nameEn,
        nameVi: attraction.nameVi,
        type: attraction.type,
        latitude: attraction.latitude,
        longitude: attraction.longitude,
        address: attraction.address,
        city: attraction.city,
      });
    }
  }, [attraction, mode, reset, isCreate]);

  const handleFormSubmit = async (
    data: CreateNearbyAttractionFormData | UpdateNearbyAttractionFormData,
  ) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (error: any) {
      // Error handling is done in the parent component
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Add Nearby Attraction" : "Edit Nearby Attraction"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nameEn">Name (EN) *</Label>
                <Input
                  id="nameEn"
                  type="text"
                  placeholder="English name"
                  {...register("nameEn")}
                />
                {errors.nameEn && (
                  <p className="text-sm text-destructive">
                    {errors.nameEn.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nameVi">Name (VI) *</Label>
                <Input
                  id="nameVi"
                  type="text"
                  placeholder="Vietnamese name"
                  {...register("nameVi")}
                />
                {errors.nameVi && (
                  <p className="text-sm text-destructive">
                    {errors.nameVi.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type *</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="museum">Museum</SelectItem>
                        <SelectItem value="park">Park</SelectItem>
                        <SelectItem value="landmark">Landmark</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-sm text-destructive">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                type="text"
                placeholder="Full address"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  placeholder="-90 to 90"
                  {...register("latitude", { valueAsNumber: true })}
                />
                {errors.latitude && (
                  <p className="text-sm text-destructive">
                    {errors.latitude.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  placeholder="-180 to 180"
                  {...register("longitude", { valueAsNumber: true })}
                />
                {errors.longitude && (
                  <p className="text-sm text-destructive">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "loading" : isCreate ? t("create") : t("update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NearbyAttractionForm;
