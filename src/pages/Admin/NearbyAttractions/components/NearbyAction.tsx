import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { NearbyAttraction } from "@/types/nearbyAttraction";
import { Trash2, UserRoundPen } from "lucide-react";

export interface Props {
  nearbyAttraction: NearbyAttraction;
  onDelete: (attractionId: string) => void;
  onEdit: (attraction: NearbyAttraction) => void;
}
function NearbyAction({ nearbyAttraction, onDelete, onEdit }: Props) {
  const handleDelete = () => {
    onDelete(nearbyAttraction.attractionId);
  };

  const handleEdit = () => {
    onEdit(nearbyAttraction);
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={handleEdit}>
        <UserRoundPen />
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" size="sm" variant="destructive">
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              This action will permanently remove the nearby attraction from the
              system.
            </DialogDescription>
          </DialogHeader>
          <p>Are you sure you want to delete this nearby attraction?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="cursor-pointer"
              size="sm"
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NearbyAction;
