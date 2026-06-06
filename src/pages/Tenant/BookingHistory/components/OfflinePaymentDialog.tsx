import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookingApi } from "@/services/privateApi/tenantApi";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  bookingId: string;
}

function OfflinePaymentDialog({ open, onClose, bookingId }: Props) {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProof(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!proof) {
      toast.error("Please upload payment proof");
      return;
    }
    setLoading(true);
    try {
        const formData = new FormData();
        formData.append("proof", proof);
        formData.append("notes", notes);

        await bookingApi.submitOfflinePayment(bookingId, formData);
        toast.success("Payment submitted successfully");
        onClose();
    } catch (error) {
      toast.error("Failed to submit payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Your Offline Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="proof">
              Payment Proof <span className="text-red-500">*</span>
            </Label>

            <Input
              id="proof"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Payment proof"
                  className="w-full max-h-64 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>

            <Textarea
              id="notes"
              placeholder="Additional information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OfflinePaymentDialog;
