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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Catalog } from "@/types/catalog";

export interface Props {
  open: boolean;
  onClose: () => void;
  report: Catalog;
  dateRange: { from: string; to: string };
  setDateRange: (dateRange: { from: string; to: string }) => void;
  onRun: () => void;
}
function RunReportDialog({
  open,
  onClose,
  report,
  dateRange,
  setDateRange,
  onRun,
}: Props) {
  const applyPreset = (preset: string) => {
    const today = new Date();
    const pad = (d: number) => d.toString().padStart(2, "0");

    const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const startOfWeek = (d: Date) => {
      // ISO week starts Monday
      const day = d.getDay(); // 0 Sun .. 6 Sat
      const diff = (day === 0 ? -6 : 1 - day); // shift to Monday
      const m = new Date(d);
      m.setDate(d.getDate() + diff);
      m.setHours(0, 0, 0, 0);
      return m;
    };

    const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
    const startOfYear = (d: Date) => new Date(d.getFullYear(), 0, 1);
    const endOfYear = (d: Date) => new Date(d.getFullYear(), 11, 31);

    let from: Date = new Date();
    let to: Date = new Date();

    switch (preset) {
      case "this_day":
        from = new Date(today);
        to = new Date(today);
        break;
      case "last_day":
        from = new Date(today);
        from.setDate(today.getDate() - 1);
        to = new Date(from);
        break;
      case "this_week":
        from = startOfWeek(today);
        to = new Date(today);
        break;
      case "last_week": {
        const thisWeekStart = startOfWeek(today);
        const lastWeekEnd = new Date(thisWeekStart);
        lastWeekEnd.setDate(thisWeekStart.getDate() - 1);
        const lastWeekStart = startOfWeek(lastWeekEnd);
        from = lastWeekStart;
        to = lastWeekEnd;
        break;
      }
      case "this_month":
        from = startOfMonth(today);
        to = new Date(today);
        break;
      case "last_month": {
        const firstOfThisMonth = startOfMonth(today);
        const lastOfLast = new Date(firstOfThisMonth);
        lastOfLast.setDate(0); // last day of previous month
        from = startOfMonth(lastOfLast);
        to = lastOfLast;
        break;
      }
      case "this_year":
        from = startOfYear(today);
        to = new Date(today);
        break;
      case "last_year": {
        const lastYear = new Date(today.getFullYear() - 1, 0, 1);
        from = startOfYear(lastYear);
        to = endOfYear(lastYear);
        break;
      }
      default:
        return;
    }

    setDateRange({ from: toIso(from), to: toIso(to) });
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run report: {report.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="mb-4">
            <Label>Quick Range</Label>
            <div className="flex gap-2 flex-wrap">
              <Select onValueChange={(v) => applyPreset(v)}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_day">This Day</SelectItem>
                  <SelectItem value="last_day">Last Day</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="last_week">Last Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>From</Label>
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>To</Label>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <div>
            <Button onClick={onRun}>Run</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RunReportDialog;
