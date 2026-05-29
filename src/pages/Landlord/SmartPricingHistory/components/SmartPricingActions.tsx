import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { SmartPricing } from "@/types/smartPricing";
import { Eye } from "lucide-react";
import SmartPricingCard from "../../ApartmentManagement/components/SmartPricing/SmartPricingCard";

interface Props {
  smartPricing: SmartPricing | null;
}

function SmartPricingActions({ smartPricing }: Props) {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Smart Pricing Details
            </DialogTitle>
          </DialogHeader>
          {smartPricing && <SmartPricingCard data={smartPricing} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SmartPricingActions;
