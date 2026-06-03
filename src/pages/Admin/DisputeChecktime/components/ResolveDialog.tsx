import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { disputeManagementApi } from "@/services/privateApi/adminApi";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  refetch: () => void;
}

function ResolveDialog({ open, onClose, bookingId, refetch }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    notes: "",
    approveTenantDispute: false,
  });

  const handleResolve = async () => {
    setLoading(true);
    try {
      await disputeManagementApi.resolveDispute(bookingId, form);
      toast.success("Dispute resolved successfully");
      setForm({
        notes: "",
        approveTenantDispute: false,
      });
      onClose();
      refetch();
    } catch (error: any) {
      setForm({
        notes: "",
        approveTenantDispute: false,
      });
      toast.error(error.response?.data.message || "Failed to resolve dispute");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve Dispute</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label>Decision</Label>
            <RadioGroup
              className="flex justify-around"
              value={String(form.approveTenantDispute)}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  approveTenantDispute: value === "true",
                }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="approve" />
                <Label htmlFor="approve">Approve Tenant Dispute</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="reject" />
                <Label htmlFor="reject">Reject Tenant Dispute</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Note</Label>
            <Textarea
              id="notes"
              placeholder="Enter notes..."
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleResolve} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ResolveDialog;
