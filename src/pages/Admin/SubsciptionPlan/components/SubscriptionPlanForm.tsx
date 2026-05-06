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
  createSubscriptionPlanSchema,
  updateSubscriptionPlanSchema,
  type CreateSubscriptionPlanFormData,
  type UpdateSubscriptionPlanFormData,
} from "@/schemas/subscriptionPlanSchema";
import type { SubscriptionPlan } from "@/types/subscriptionPlan";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface SubscriptionPlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: UpdateSubscriptionPlanFormData | CreateSubscriptionPlanFormData,
  ) => void;
  subscriptionPlan: Partial<SubscriptionPlan> | null;
  mode: "create" | "update";
}
function SubscriptionPlanForm({
  isOpen,
  onClose,
  onSubmit,
  subscriptionPlan,
  mode,
}: SubscriptionPlanFormProps) {
  const { t } = useTranslation();

  const isCreate = mode === "create";
  const schema = isCreate
    ? createSubscriptionPlanSchema
    : updateSubscriptionPlanSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSubscriptionPlanFormData | UpdateSubscriptionPlanFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const watchedIsActive = watch("isActive");

  // Reset form when user or mode changes
  useEffect(() => {
    if (isCreate) {
      reset({
        name: "",
        description: "",
        priceMonthly: 0,
        priceAnnual: 0,
        maxApartments: 0,
        features: "",
        isActive: true,
      });
    } else if (subscriptionPlan) {
      reset({
        name: subscriptionPlan.name,
        description: subscriptionPlan.description,
        priceMonthly: subscriptionPlan.priceMonthly,
        priceAnnual: subscriptionPlan.priceAnnual,
        maxApartments: subscriptionPlan.maxApartments,
        features: subscriptionPlan.features,
        isActive: subscriptionPlan.isActive,
      });
    }
  }, [subscriptionPlan, mode, reset, isCreate]);

  const handleFormSubmit = async (
    data: CreateSubscriptionPlanFormData | UpdateSubscriptionPlanFormData,
  ) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {}
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
            {isCreate ? "Create subscription plan" : "Edit subscription plan"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* NAME */}
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="grid gap-2">
              <Label>Description</Label>
              <Input {...register("description")} />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* PRICE MONTHLY */}
            <div className="grid gap-2">
              <Label>Month price</Label>
              <Input
                type="number"
                {...register("priceMonthly", { valueAsNumber: true })}
              />
              {errors.priceMonthly && (
                <p className="text-sm text-destructive">
                  {errors.priceMonthly.message}
                </p>
              )}
            </div>

            {/* PRICE ANNUAL */}
            <div className="grid gap-2">
              <Label>Annual price</Label>
              <Input
                type="number"
                {...register("priceAnnual", { valueAsNumber: true })}
              />
              {errors.priceAnnual && (
                <p className="text-sm text-destructive">
                  {errors.priceAnnual.message}
                </p>
              )}
            </div>

            {/* MAX APARTMENTS */}
            <div className="grid gap-2">
              <Label>Max appartment</Label>
              <Input
                type="number"
                {...register("maxApartments", { valueAsNumber: true })}
              />
              {errors.maxApartments && (
                <p className="text-sm text-destructive">
                  {errors.maxApartments.message}
                </p>
              )}
            </div>

            {/* FEATURES */}
            <div className="grid gap-2">
              <Label>Features</Label>
              <Input {...register("features")} />
              {errors.features && (
                <p className="text-sm text-destructive">
                  {errors.features.message}
                </p>
              )}
            </div>

            {/* IS ACTIVE */}
            <div className="grid gap-2">
              <Label>Active</Label>
              <RadioGroup
                value={watchedIsActive ? "true" : "false"}
                onValueChange={(val) => setValue("isActive", val === "true")}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="true" id="active-yes" />
                  <Label htmlFor="active-yes">{t("yes")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="false" id="active-no" />
                  <Label htmlFor="active-no">{t("no")}</Label>
                </div>
              </RadioGroup>

              {errors.isActive && (
                <p className="text-sm text-destructive">
                  {errors.isActive.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isCreate ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SubscriptionPlanForm;
