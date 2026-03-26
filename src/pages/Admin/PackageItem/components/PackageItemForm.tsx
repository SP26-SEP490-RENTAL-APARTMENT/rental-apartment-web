import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createPackageItemSchema,
  updatePackageItemSchema,
  type CreatePackageItemFormData,
  type UpdatePackageItemFormData,
} from "@/schemas/packageItemSchema";
import type { PackageItem } from "@/types/package";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface PackageItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreatePackageItemFormData | UpdatePackageItemFormData,
  ) => Promise<void>;
  packageItem: PackageItem | null;
  mode: "create" | "update";
}
function PackageItemForm({
  isOpen,
  onClose,
  onSubmit,
  packageItem,
  mode,
}: PackageItemFormProps) {
  const isCreate = mode === "create";
  const schema = isCreate ? createPackageItemSchema : updatePackageItemSchema;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePackageItemFormData | UpdatePackageItemFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (isCreate) {
      reset({
        itemName: "",
        itemDescription: "",
        quantity: 0,
        estimatedValue: 0,
        sortOrder: 0,
      });
    } else if (packageItem) {
      reset({
        itemName: packageItem.itemName,
        itemDescription: packageItem.itemDescription || "",
        quantity: packageItem.quantity,
        estimatedValue: packageItem.estimatedValue,
        sortOrder: packageItem.sortOrder || 0,
      });
    }
  }, [isCreate, packageItem, reset]);

  const handleSubmitForm = async (
    data: CreatePackageItemFormData | UpdatePackageItemFormData,
  ) => {
    await onSubmit(data);
    onClose();
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };
  return <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Add Package Item' : 'Edit Package Item'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="itemName">Item name</Label>
              <Input
                id="itemName"
                type="text"
                placeholder="Name of the package item"
                {...register("itemName")}
              />
              {errors.itemName && (
                <p className="text-sm text-destructive">
                  {errors.itemName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="itemDescription">Description</Label>
              <Input
                id="itemDescription"
                type="text"
                placeholder="Description of the package item"
                {...register("itemDescription")}
              />
              {errors.itemDescription && (
                <p className="text-sm text-destructive">
                  {errors.itemDescription.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="EN"
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estimatedValue">Estimate value</Label>
              <Input
                id="estimatedValue"
                type="number"
                placeholder="EN"
                {...register("estimatedValue", { valueAsNumber: true })}
              />
              {errors.estimatedValue && (
                <p className="text-sm text-destructive">
                  {errors.estimatedValue.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sortOrder">Sort order</Label>
              <Input
                id="sortOrder"
                type="number"
                placeholder="EN"
                {...register("sortOrder", { valueAsNumber: true })}
              />
              {errors.sortOrder && (
                <p className="text-sm text-destructive">
                  {errors.sortOrder.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "loading" : isCreate ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
}

export default PackageItemForm;
