import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AlternativeApartment } from "@/types/apartment";
import AlternativeApartmentCard from "./AlternativeApartmentCard";

interface Props {
  open: boolean;
  onClose: () => void;
  alternatives: AlternativeApartment[] | null;
}

function AlternativeDialog({ open, onClose, alternatives }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90dvh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Alternative Apartments</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {alternatives?.map((apartment) => (
            <AlternativeApartmentCard data={apartment} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AlternativeDialog;
