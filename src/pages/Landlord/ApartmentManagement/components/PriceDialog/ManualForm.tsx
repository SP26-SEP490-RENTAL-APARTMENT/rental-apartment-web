import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { priceChangeApi } from "@/services/privateApi/landlordApi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
  apartmentId: string;
}

const priceTypeList = [
  { label: "Normal", value: "base" },
  { label: "Weekend", value: "weekend" },
  { label: "Holiday", value: "holiday" },
  { label: "Peak season", value: "peak_season" },
  { label: "Low season", value: "low_season" },
  { label: "Special event", value: "special_event" },
  { label: "Manual override", value: "manual_override" },
];
function ManualForm({ onClose, apartmentId }: Props) {
  const { t } = useTranslation("landlord");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    fixedPricePerNight: 0,
    priceType: "",
  });

  const handleChangePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await priceChangeApi.manualPriceChange(apartmentId, form);
      toast.success("Price updated successfully");
      onClose();
      handleReset();
    } catch (error) {
      handleReset();
      onClose();
      toast.error("Failed to update price");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      startDate: "",
      endDate: "",
      fixedPricePerNight: 0,
      priceType: "",
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleChangePrice}>
      <div className="grid grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label>{t("priceChange.manualForm.startDate")}</Label>
          <Input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label>{t("priceChange.manualForm.endDate")}</Label>
          <Input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>{t("priceChange.manualForm.newPrice")}</Label>
        <Input
          min={0}
          type="number"
          placeholder="500.000 VND"
          value={form.fixedPricePerNight || ""}
          onChange={(e) =>
            setForm({ ...form, fixedPricePerNight: Number(e.target.value) })
          }
        />
      </div>

      <div className="grid gap-2">
        <Label>{t("priceChange.manualForm.priceType")}</Label>
        <Select
          value={form.priceType}
          onValueChange={(value) => setForm({ ...form, priceType: value })}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder={t("priceChange.manualForm.priceType")} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {priceTypeList.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 mt-10">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("priceChange.button.cancel")}
        </Button>
        <Button type="submit" disabled={loading}>
          {t("priceChange.button.update")}
        </Button>
      </div>
    </form>
  );
}

export default ManualForm;
