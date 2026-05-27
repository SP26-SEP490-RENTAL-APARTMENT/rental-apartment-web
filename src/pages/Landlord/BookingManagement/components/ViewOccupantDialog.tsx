import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Occupant } from "@/types/occupant";
import OccupantCard from "./OccupantCard";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  occupantList: Occupant[];
  open: boolean;
  onClose: () => void;
}
function ViewOccupantDialog({ occupantList, open, onClose }: Props) {
  const { t } = useTranslation("landlord");
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[96vw] max-w-425 h-[92vh] p-0 rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="shrink-0 sticky top-0 z-20 bg-white border-b px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900">
                {t("occupant.title")}
              </DialogTitle>
              <p className="text-sm text-slate-500">
                {occupantList.length} {t("occupant.occupant")}
                {occupantList.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50 px-8 py-6">
          {occupantList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Users className="w-14 h-14 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold">No occupants found</h3>
              <p className="text-sm text-gray-500">
                No occupant information available.
              </p>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {occupantList.map((occ) => (
                <OccupantCard key={occ.order} occupant={occ} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewOccupantDialog;
