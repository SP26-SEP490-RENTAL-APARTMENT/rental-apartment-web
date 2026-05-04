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
import { CircleX, Eye } from "lucide-react";

interface Props {
  apartment: Apartment;
  unPublishApartment: (id: string) => void;
}
function AllApartmentAction({ apartment, unPublishApartment }: Props) {
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
          <ApartmentDetailDialog apartment={apartment} />
        </DialogContent>
      </Dialog>

      {apartment.status === "posted" && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => unPublishApartment(apartment.apartmentId)}
        >
          <CircleX />
          Ban
        </Button>
      )}
    </div>
  );
}

export default AllApartmentAction;
