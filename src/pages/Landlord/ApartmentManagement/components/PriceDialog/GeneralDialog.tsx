import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import ManualForm from "./ManualForm";
import BulkForm from "./BulkForm";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  apartmentId: string;
}

function GeneralDialog({ open, onClose, apartmentId }: Props) {
  const { t } = useTranslation("landlord");
  const [mode, setMode] = useState<"manual" | "bulk">("manual");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("priceChange.title")}</DialogTitle>
        </DialogHeader>

        {/* Segmented control */}
        <div className="w-full mb-4">
          <div className="relative flex bg-muted p-1 rounded-xl w-full">
            {/* Sliding background */}
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-white shadow transition-all duration-300
                ${mode === "manual" ? "left-1" : "left-1/2"}`}
            />

            <button
              onClick={() => setMode("manual")}
              className="relative z-10 flex-1 py-2 text-sm font-medium text-center"
            >
              {t("priceChange.manualForm.title")}
            </button>

            <button
              onClick={() => setMode("bulk")}
              className="relative z-10 flex-1 py-2 text-sm font-medium text-center"
            >
              {t("priceChange.bulkForm.title")}
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          {mode === "manual" ? (
            <ManualForm onClose={onClose} apartmentId={apartmentId} />
          ) : (
            <BulkForm onClose={onClose} apartmentId={apartmentId} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GeneralDialog;
