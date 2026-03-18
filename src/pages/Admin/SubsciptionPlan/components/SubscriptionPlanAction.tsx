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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {subscriptionPlanTranslation("subscriptionDetails") ||
                "Subscription Details"}
            </DialogTitle>
            <DialogDescription>
              {subscriptionPlanTranslation("subscriptionDetailsDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-5">
            <div className="font-bold">
              {subscriptionPlanTranslation("subscriptionName")}
            </div>
            <div>{subscriptionPlan?.name}</div>
            <div className="font-bold">
              {subscriptionPlanTranslation("subscriptionFeature")}
            </div>
            <div>{subscriptionPlan?.features}</div>
            <div className="font-bold">
              {subscriptionPlanTranslation("subscriptionPlanDescription")}
            </div>
            <div>{subscriptionPlan?.description}</div>
            <div className="font-bold">
              {subscriptionPlanTranslation("subscriptionPriceMonthly")}
            </div>
            <div>{subscriptionPlan?.priceMonthly}</div>
            <div className="font-bold">
              {subscriptionPlanTranslation("subscriptionPriceAnnual")}
            </div>
            <div>{subscriptionPlan?.priceAnnual}</div>
            <div className="font-bold">
              {subscriptionPlanTranslation("maxApartments")}
            </div>
            <div>{subscriptionPlan?.maxApartments}</div>
            <div className="font-bold">
              {subscriptionPlanTranslation("maxApartmentsPerApartment")}
            </div>
            <div>{subscriptionPlan?.maxApartmentsPerApartment}</div>
            <div className="font-bold">
              {subscriptionPlanTranslation("isActive")}
            </div>
            <div>{subscriptionPlan?.isActive ? "Yes" : "No"}</div>
          </div>
        </DialogContent>
      </Dialog>

      <Button size="sm" variant="outline" onClick={() => onEdit(subscriptionPlan)}>
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
