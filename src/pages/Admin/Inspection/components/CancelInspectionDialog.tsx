import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { inspectionApi } from "@/services/privateApi/adminApi";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  inspectionId: string;
  refetchInspections: () => void;
}

function CancelInspectionDialog({
  open,
  onClose,
  inspectionId,
  refetchInspections,
}: Props) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      await inspectionApi.cancelInspection(inspectionId, { reason });
      toast.success("Inspection cancelled successfully.");
      onClose();
      refetchInspections();
    } catch (error) {
      toast.error("Failed to cancel inspection. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Inspection</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label>Reason</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason to cancel this inspection"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleCancel} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CancelInspectionDialog;
