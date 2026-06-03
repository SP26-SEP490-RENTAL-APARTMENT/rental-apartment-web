import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Availability } from "@/types/availability";
import AvailabilityCalendarCard from "./AvailabilityCalendarCard";

interface Props {
  open: boolean;
  onClose: () => void;
  data: Availability | null;
}

function ViewAvailability({ open, onClose, data }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your apartment's availability</DialogTitle>
        </DialogHeader>
        {data && <AvailabilityCalendarCard data={data} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

export default ViewAvailability;
