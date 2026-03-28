import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  createPackageSchema,
  updatePackageSchema,
  type CreatePackageFormData,
  type UpdatePackageFormData,
} from "@/schemas/packageSchema";
import type { Package } from "@/types/package";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePackageFormData | UpdatePackageFormData) => void;
  packages: Partial<Package> | null;
  mode: "create" | "update";
}
function PackageForm({ isOpen, onSubmit, onClose, packages, mode }: Props) {
  const isCreate = mode === "create";
  const schema = isCreate ? createPackageSchema : updatePackageSchema;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePackageFormData | UpdatePackageFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });
  const watchedIsActive = watch("isActive");

  useEffect(() => {
    if (isCreate) {
      reset({
        name: "",
        description: "",
        price: 0,
        apartmentId: "",
        currency: "",
        maxBookings: 0,
        isActive: true,
      });
    } else if (packages) {
      reset({
        name: packages.name,
        description: packages.description,
        price: packages.price ?? 0,
        apartmentId: packages.apartmentId ?? "",
        currency: packages.currency ?? "",
        maxBookings: packages.maxBookings ?? 0,
        isActive: packages.isActive ?? true,
      });
    }
  }, [packages, isCreate, reset]);

  const handleFormSubmit = async (
    data: CreatePackageFormData | UpdatePackageFormData,
  ) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /* empty */
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
            {isCreate ? "Create Package" : "Edit Package"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>Hello</DialogDescription>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* NAME */}
            <div className="grid gap-2">
              <Label>Apartment</Label>
              <Input
                disabled={!isCreate}
                type="text"
                {...register("apartmentId")}
              />
              {errors.apartmentId && (
                <p className="text-sm text-destructive">
                  {errors.apartmentId.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input type="text" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Input type="text" {...register("description")} />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Price</Label>
              <Input
                type="number"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Currency</Label>
              <Input
                placeholder="VND / USA"
                type="text"
                {...register("currency")}
              />
              {errors.currency && (
                <p className="text-sm text-destructive">
                  {errors.currency.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Active</Label>
              <RadioGroup
                value={watchedIsActive ? "true" : "false"}
                onValueChange={(val) => setValue("isActive", val === "true")}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="true" id="active-yes" />
                  <Label htmlFor="active-yes">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="false" id="active-no" />
                  <Label htmlFor="active-no">No</Label>
                </div>
              </RadioGroup>

              {errors.isActive && (
                <p className="text-sm text-destructive">
                  {errors.isActive.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Max bookings</Label>
              <Input
                type="number"
                {...register("maxBookings", { valueAsNumber: true })}
              />
              {errors.maxBookings && (
                <p className="text-sm text-destructive">
                  {errors.maxBookings.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Loading" : isCreate ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PackageForm;
