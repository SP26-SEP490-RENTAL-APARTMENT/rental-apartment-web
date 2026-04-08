import ApartmentDetailDialog from "@/components/ui/apartmentDetailDialog/ApartmentDetailDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Apartment } from "@/types/apartment";
import { CircleCheckBig, Eye } from "lucide-react";

export interface Props {
  listings: Apartment;
  onAppvrove: (apartmentId: string) => void;
}
function ListingAction({ listings, onAppvrove }: Props) {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail</DialogTitle>
          </DialogHeader>
          <ApartmentDetailDialog apartment={listings} />
        </DialogContent>
      </Dialog>

      <Button
          onClick={() => onAppvrove(listings.apartmentId)}
          size="sm"
          variant="outline"
          className="bg-yellow-500"
        >
          <CircleCheckBig />
        </Button>
    </div>
  );
}

export default ListingAction;
