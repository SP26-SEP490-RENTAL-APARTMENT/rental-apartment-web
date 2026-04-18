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
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run report: {report.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
