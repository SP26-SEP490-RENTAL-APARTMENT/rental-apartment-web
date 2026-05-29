import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { priceChangeApi } from "@/services/privateApi/landlordApi";
import type { SmartPricing } from "@/types/smartPricing";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SmartPricingCard from "./SmartPricingCard";

interface Props {
  open: boolean;
  onClose: () => void;
  apartmentId: string;
}

function SmartPriceDialog({ open, onClose, apartmentId }: Props) {
  const [smartPrice, setSmartPrice] = useState<SmartPricing | null>(null);
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    apartmentId: apartmentId,
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      apartmentId: apartmentId,
    }));
  }, [apartmentId]);

  const handleUseSmartPricing = async () => {
    try {
      const ressponse = await priceChangeApi.useSmartPricing(form);
      setSmartPrice(ressponse.data.data);
      toast.success("Smart pricing applied successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to apply smart pricing");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Smart Pricing</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
          {/* <div className="grid gap-2">
              <Label>Occupancy Rate</Label>
              <Input
                type="number"
                placeholder="1"
                min={0}
                max={1}
                step={0.1}
              />
            </div> */}
          <div className="flex justify-end">
            <Button onClick={handleUseSmartPricing}>Suggest Pricing</Button>
          </div>
        </div>
        {smartPrice && <SmartPricingCard data={smartPrice} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

export default SmartPriceDialog;
