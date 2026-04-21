import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Occupant } from "@/types/occupant";
import OccupantCard from "./OccupantCard";

interface Props {
  occupantList: Occupant[];
  open: boolean;
  onClose: () => void;
}
function ViewOccupantDialog({ occupantList, open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Occupant List</DialogTitle>
        </DialogHeader>

        {/* Content (scrollable) */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {occupantList.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No occupants found
            </p>
          ) : (
            occupantList.map((occ) => (
              <OccupantCard key={occ.order} occupant={occ} />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewOccupantDialog;
