import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Amenity } from "@/types/amenity";
import { Trash2, UserRoundPen } from "lucide-react";

interface Props {
  amenity: Amenity;
  onDelete: (userId: string) => void;
  onEdit: (amenity: Amenity) => void;
}

function AmenityAction({ amenity, onDelete, onEdit }: Props) {

  const handleDelete = () => {
    onDelete(amenity.amenityId);
  };

  const handleEdit = () => {
    onEdit(amenity);
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
              This action will permanently remove the amenity from the system.
            </DialogDescription>
          </DialogHeader>
          <p>Are you sure you want to delete this amenity?</p>
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

export default AmenityAction;