import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminApartmentApi } from "@/services/privateApi/adminApi";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  apartmentId: string;
}
function UnpublishDialog({ isOpen, onClose, refetch, apartmentId }: Props) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await adminApartmentApi.unPublish(apartmentId, reason);
      toast.success("Apartment unpublished successfully");
      onClose();
      refetch();
    } catch (error) {
      console.error("Failed to unpublish apartment:", error);
      toast.error("Failed to unpublish apartment");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unpublish this apartment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Reason</Label>
              <Textarea
                placeholder="Please provide a reason for unpublishing this apartment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit} disabled={loading}>
              Submit
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UnpublishDialog;
