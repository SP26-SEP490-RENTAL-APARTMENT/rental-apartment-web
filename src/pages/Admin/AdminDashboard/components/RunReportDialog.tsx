import { useEffect, useState } from "react";
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
import type { Catalog } from "@/types/catalog";
import { applyRangePreset, type RangePreset } from "@/utils/datePresets";

export interface Props {
  open: boolean;
  onClose: () => void;
  report: Catalog;
  dateRange: { from: string; to: string };
  setDateRange: (dateRange: { from: string; to: string }) => void;
  onRun: () => void;
}

type QuickPreset = {
  label: string;
  preset: RangePreset | "custom";
};

const QUICK_PRESETS: QuickPreset[] = [
  { label: "Today", preset: "this_day" },
  { label: "Last 7 Days", preset: "last_week" },
  { label: "Last 30 Days", preset: "last_30_days" },
  { label: "This Month", preset: "this_month" },
  { label: "Last Month", preset: "last_month" },
  { label: "This Year", preset: "this_year" },
  { label: "Custom", preset: "custom" },
];

function RunReportDialog({ open, onClose, report, dateRange, setDateRange, onRun }: Props) {
  const [activePreset, setActivePreset] = useState<RangePreset | "custom">("last_30_days");

  useEffect(() => {
    if (open) {
      const defaults = applyRangePreset("last_30_days");
      setDateRange(defaults);
      setActivePreset("last_30_days");
    }
  }, [open]);

  function handlePreset(preset: RangePreset | "custom") {
    setActivePreset(preset);
    if (preset !== "custom") {
      setDateRange(applyRangePreset(preset));
    }
  }

  function handleFromChange(value: string) {
    setActivePreset("custom");
    setDateRange({ ...dateRange, from: value });
  }

  function handleToChange(value: string) {
    setActivePreset("custom");
    setDateRange({ ...dateRange, to: value });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Run report: {report.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Date pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>From Date</Label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => handleFromChange(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>To Date</Label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => handleToChange(e.target.value)}
              />
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2">
            {QUICK_PRESETS.map(({ label, preset }) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePreset(preset)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  activePreset === preset
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onRun}>Run</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RunReportDialog;
