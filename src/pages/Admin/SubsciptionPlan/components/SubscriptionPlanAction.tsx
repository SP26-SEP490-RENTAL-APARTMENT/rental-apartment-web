import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { SubscriptionPlan } from "@/types/subscriptionPlan";
import { Eye, Trash2, UserRoundPen } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface Props {
  subscriptionPlan: SubscriptionPlan;
  onDelete: (planId: string) => void;
  onEdit: (subscriptionPlan: SubscriptionPlan) => void;
}

function SubscriptionPlanAction({ subscriptionPlan, onDelete, onEdit }: Props) {
  const { t: subscriptionPlanTranslation } = useTranslation("subscriptionPlan");

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {subscriptionPlanTranslation("subscriptionDetails") ||
                "Subscription Details"}
            </DialogTitle>
            <DialogDescription>
              {subscriptionPlanTranslation("subscriptionDetailsDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Basic Info */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Basic Information
              </h3>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {subscriptionPlanTranslation("subscriptionName")}
                </span>
                <span className="font-medium">{subscriptionPlan?.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {subscriptionPlanTranslation("subscriptionFeature")}
                </span>
                <span className="font-medium text-right max-w-[60%]">
                  {subscriptionPlan?.features}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {subscriptionPlanTranslation("subscriptionPlanDescription")}
                </span>
                <span className="font-medium text-right max-w-[60%]">
                  {subscriptionPlan?.description}
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Pricing
              </h3>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {subscriptionPlanTranslation("subscriptionPriceMonthly")}
                </span>
                <span className="font-medium">
                  {subscriptionPlan?.priceMonthly.toLocaleString("vi-VN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {subscriptionPlanTranslation("subscriptionPriceAnnual")}
                </span>
                <span className="font-medium">
                  {subscriptionPlan?.priceAnnual.toLocaleString("vi-VN")}
                </span>
              </div>
            </div>

            {/* Limits */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Limits
              </h3>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {subscriptionPlanTranslation("maxApartments")}
                </span>
                <span className="font-medium">
                  {subscriptionPlan?.maxApartments}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {subscriptionPlanTranslation("maxApartmentsPerApartment")}
                </span>
                <span className="font-medium">
                  {subscriptionPlan?.maxApartmentsPerApartment}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-muted-foreground">
                {subscriptionPlanTranslation("isActive")}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  subscriptionPlan?.isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {subscriptionPlan?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        size="sm"
        variant="outline"
        onClick={() => onEdit(subscriptionPlan)}
      >
        <UserRoundPen />
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" size="sm" variant="destructive">
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              This action will permanently remove the plan from the system.
            </DialogDescription>
          </DialogHeader>
          <p>Are you sure you want to delete this plan?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="cursor-pointer"
              size="sm"
              variant="destructive"
              onClick={() => onDelete(subscriptionPlan.planId)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SubscriptionPlanAction;
