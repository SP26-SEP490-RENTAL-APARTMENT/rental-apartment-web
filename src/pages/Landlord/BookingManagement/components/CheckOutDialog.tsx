import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { actualCheckOut: Date; note: string }) => Promise<void>;
}

function CheckOutDialog({ open, onClose, onSubmit }: Props) {
  const { t } = useTranslation("landlord");
  const [actualCheckOut, setActualCheckOut] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!actualCheckOut) {
      alert("Please select a check-out date");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        actualCheckOut: new Date(actualCheckOut),
        note,
      });
      setActualCheckOut(new Date().toISOString().split("T")[0]);
      setNote("");
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("booking.form.checkOut")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t("booking.form.checkOutDate")}</label>
            <input
              type="date"
              value={actualCheckOut}
              onChange={(e) => setActualCheckOut(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>

          {/* Note Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t("booking.form.notes")}</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("booking.form.notesPlaceholder")}
              className="border rounded-lg px-3 py-2 w-full min-h-24 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              {t("booking.form.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("booking.form.checkOut")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CheckOutDialog;
