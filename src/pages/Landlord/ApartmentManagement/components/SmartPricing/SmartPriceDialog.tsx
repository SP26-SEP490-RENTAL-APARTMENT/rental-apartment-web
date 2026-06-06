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
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  apartmentId: string;
}

function SmartPriceDialog({ open, onClose, apartmentId }: Props) {
  const { t } = useTranslation("landlord");
  const [smartPrice, setSmartPrice] = useState<SmartPricing | null>(null);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const ressponse = await priceChangeApi.useSmartPricing(form);
      setSmartPrice(ressponse.data.data);
      toast.success("Smart pricing applied successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to apply smart pricing");
    } finally {
      setLoading(false);
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
              <Label>{t("smartPricing.startDate")}</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>{t("smartPricing.endDate")}</Label>
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
            <Button onClick={handleUseSmartPricing} disabled={loading}>
              {t("smartPricing.suggestedPrice")}
            </Button>
          </div>
        </div>
        {smartPrice && <SmartPricingCard data={smartPrice} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

export default SmartPriceDialog;
