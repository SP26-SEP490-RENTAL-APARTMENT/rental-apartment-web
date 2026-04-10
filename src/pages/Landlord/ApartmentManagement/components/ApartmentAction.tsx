import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import type { Apartment } from "@/types/apartment";
import {
  Blocks,
  Eye,
  Trash2,
  UserRoundPen,
  X,
  Loader2,
  Home,
  CalendarCog,
  Boxes,
  PackageOpen,
  Send,
} from "lucide-react";
import { useState } from "react";
import useAmenity from "@/hooks/useAmenity";
import ApartmentDetailDialog from "@/components/ui/apartmentDetailDialog/ApartmentDetailDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  apartment: Apartment;
  onDelete: (id: string) => void;
  onEdit: (apartment: Apartment) => void;
  onAddAmenity: (apartmentId: string, amenities: string[]) => Promise<void>;
  onAddPackage: (apartment: Apartment) => void;
  onCreateRoom: (apartment: Apartment) => void;
  onAddAvailability: (apartmentId: string) => void;
  onViewPackage: (apartmentId: string) => void;
  onSendApprove: (apartmentId: string) => void;
  onAddPhotos: (apartmentId: string, files: File[]) => Promise<void>;
}
function ApartmentAction({
  apartment,
  onEdit,
  onDelete,
  onAddAmenity,
  onAddPackage,
  onCreateRoom,
  onAddAvailability,
  onViewPackage,
  onSendApprove,
  onAddPhotos,
}: Props) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { amenities, loading } = useAmenity({
    page: 1,
    pageSize: 100,
    search: "",
    sortBy: "nameEn",
    sortOrder: "asc",
    enable: dialogOpen,
  });

  const handleToggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId],
    );
  };

  const handleRemoveAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) => prev.filter((id) => id !== amenityId));
  };

  const handleSubmit = async () => {
    if (selectedAmenities.length === 0) {
      setError("Please select at least one amenity");
      return;
    }

    setLoadingSubmit(true);
    setError(null);
    try {
      await onAddAmenity(apartment.apartmentId, selectedAmenities);
      setSelectedAmenities([]);
      setDialogOpen(false);
    } catch (err) {
      setError("Failed to add amenities");
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDelete = () => {
    onDelete(apartment.apartmentId);
  };

  const handleEdit = () => {
    onEdit(apartment);
  };

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
          <ApartmentDetailDialog
            apartment={apartment}
            onAddPhotos={onAddPhotos}
          />
        </DialogContent>
      </Dialog>

      <Button size="sm" variant="outline" onClick={handleEdit}>
        <UserRoundPen />
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="bg-yellow-500"
        onClick={() => onAddAvailability(apartment.apartmentId)}
      >
        <CalendarCog />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" size="sm" variant="default">
            <Blocks />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Amenities</DialogTitle>
            <DialogDescription>
              Select amenities to add to this apartment
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-destructive/15 text-destructive px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* SELECTED AMENITIES DISPLAY */}
            {selectedAmenities.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Selected Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAmenities.map((amenityId) => {
                    const amenity = amenities.find(
                      (a) => a.amenityId === amenityId,
                    );
                    return (
                      <div
                        key={amenityId}
                        className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-full"
                      >
                        <span className="text-sm">
                          {amenity?.nameVi || amenity?.nameEn}
                        </span>
                        <button
                          onClick={() => handleRemoveAmenity(amenityId)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AMENITIES LIST */}
            <div>
              <p className="text-sm font-medium mb-2">Available Amenities:</p>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="animate-spin" size={20} />
                </div>
              ) : amenities.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-lg p-4">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity.amenityId}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={amenity.amenityId}
                        checked={selectedAmenities.includes(amenity.amenityId)}
                        onCheckedChange={() =>
                          handleToggleAmenity(amenity.amenityId)
                        }
                      />
                      <label
                        htmlFor={amenity.amenityId}
                        className="text-sm cursor-pointer"
                      >
                        {amenity.nameVi || amenity.nameEn}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No amenities available
                </p>
              )}
            </div>
          </div>

          {/* Add amenities */}
          <div className="flex justify-end gap-2 mt-6">
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogTrigger>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={loadingSubmit || selectedAmenities.length === 0}
            >
              {loadingSubmit && (
                <Loader2 className="mr-2 animate-spin" size={16} />
              )}
              Add Amenities
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create package */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddPackage(apartment)}
              className="cursor-pointer"
            >
              <PackageOpen />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add a package</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* View package n add items */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewPackage(apartment.apartmentId)}
              className="cursor-pointer"
            >
              <Boxes />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View package</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Add room */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCreateRoom(apartment)}
              className="cursor-pointer bg-blue-500 text-white"
            >
              <Home />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add room</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Delete */}
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
              This action will permanently remove the apartment from the system.
            </DialogDescription>
          </DialogHeader>
          <p>Are you sure you want to delete this apartment?</p>
          <div className="flex justify-end gap-2 mt-4">
            <DialogTrigger asChild>
              <Button className="cursor-pointer" size="sm" variant="outline">
                Cancel
              </Button>
            </DialogTrigger>
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

      {/* Send to approve */}
      {apartment.status === "draft" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onSendApprove(apartment.apartmentId)}
              >
                <Send />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send to approve</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

export default ApartmentAction;
