import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { priceChangeApi } from "@/services/privateApi/landlordApi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const daysOfWeekList = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

interface Props {
  onClose: () => void;
  apartmentId: string;
}

function BulkForm({ onClose, apartmentId }: Props) {
  const { t } = useTranslation("landlord");
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    daysOfWeek: [] as string[],
    fixedPricePerNight: 0,
  });

  const validateDateRange = (from: string, to: string) => {
    if (!from || !to) return true;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = toDate.getTime() - fromDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  };

  const handleDateChange = (field: "fromDate" | "toDate", value: string) => {
    const newForm = { ...form, [field]: value };
    setForm(newForm);

    if (newForm.fromDate && newForm.toDate) {
      if (!validateDateRange(newForm.fromDate, newForm.toDate)) {
        setDateError(t("priceChange.bulkForm.dateRangeError"));
      } else {
        setDateError("");
      }
    }
  };

  const handleToggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const handleChangePrice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDateRange(form.fromDate, form.toDate)) {
      toast.error(t("priceChange.bulkForm.dateRangeError"));
      return;
    }

    if (form.daysOfWeek.length === 0) {
      toast.error(t("priceChange.bulkForm.selectDateError"));
      return;
    }

    setLoading(true);
    try {
      await priceChangeApi.bulkPriceChange(apartmentId, form);
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
      fromDate: "",
      toDate: "",
      daysOfWeek: [],
      fixedPricePerNight: 0,
    });
    setDateError("");
  };

  return (
    <form className="space-y-6" onSubmit={handleChangePrice}>
      <div className="grid grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label>{t("priceChange.bulkForm.fromDate")}</Label>
          <Input
            type="date"
            value={form.fromDate}
            onChange={(e) => handleDateChange("fromDate", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label>{t("priceChange.bulkForm.toDate")}</Label>
          <Input
            type="date"
            value={form.toDate}
            onChange={(e) => handleDateChange("toDate", e.target.value)}
          />
          {dateError && <p className="text-sm text-red-500">{dateError}</p>}
        </div>
      </div>

      <div className="grid gap-2">
        <Label>{t("priceChange.bulkForm.newPrice")}</Label>
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
        <Label>{t("priceChange.bulkForm.daysOfWeek")}</Label>
        <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white">
          {daysOfWeekList.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleToggleDay(item.value)}
              className={`px-3 py-2 rounded-md border transition-colors ${
                form.daysOfWeek.includes(item.value)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {form.daysOfWeek.length === 0 && (
          <p className="text-sm text-amber-600">
            {t("priceChange.bulkForm.selectDateError")}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-10">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("priceChange.button.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={loading || dateError !== "" || form.daysOfWeek.length === 0}
        >
          {t("priceChange.button.update")}
        </Button>
      </div>
    </form>
  );
}

export default BulkForm;
