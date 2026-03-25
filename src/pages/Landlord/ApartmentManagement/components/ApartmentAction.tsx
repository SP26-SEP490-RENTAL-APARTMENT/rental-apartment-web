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
import { apartmentManagementApi } from "@/services/privateApi/landlordApi";
import type { Apartment } from "@/types/apartment";
import { Blocks, Eye, Trash2, UserRoundPen, X, Loader2 } from "lucide-react";
import { useState } from "react";
import useAmenity from "@/hooks/useAmenity";

interface Props {
  apartment: Apartment;
  onDelete: (id: string) => void;
  onEdit: (apartment: Apartment) => void;
}
function ApartmentAction({ apartment, onEdit, onDelete }: Props) {
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
      await apartmentManagementApi.addAmenityToApartment(
        apartment.apartmentId,
        selectedAmenities,
      );
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
          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6">
            {/* IMAGE */}
            {apartment.photos?.length > 0 ? (
              <img
                src={apartment.photos[0]}
                alt="apartment"
                className="w-full h-56 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-56 bg-muted rounded-lg flex items-center justify-center text-sm text-gray-500">
                No image
              </div>
            )}

            {/* BASIC INFO */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Giá / đêm</p>
                <p className="font-medium">
                  {apartment.basePricePerNight.toLocaleString()} VND
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Số người</p>
                <p className="font-medium">{apartment.maxOccupants}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Cho thú cưng</p>
                <p className="font-medium">
                  {apartment.isPetAllowed ? "Có" : "Không"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Trạng thái</p>
                <p className="font-medium capitalize">{apartment.status}</p>
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <p className="text-muted-foreground text-sm">Địa chỉ</p>
              <p className="font-medium">
                {apartment.address}, {apartment.district}, {apartment.city}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <p className="text-muted-foreground text-sm">Mô tả</p>
              <p className="text-sm">{apartment.description}</p>
            </div>

            {/* ROOM */}
            {apartment.room && (
              <div className="border rounded-lg p-4 space-y-3">
                <p className="font-semibold">Thông tin phòng</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tên phòng</p>
                    <p className="font-medium">{apartment.room.title}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Loại phòng</p>
                    <p className="font-medium">{apartment.room.roomType}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Giường</p>
                    <p className="font-medium">{apartment.room.bedType}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Diện tích</p>
                    <p className="font-medium">{apartment.room.sizeSqm} m²</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">WC riêng</p>
                    <p className="font-medium">
                      {apartment.room.isPrivateBathroom ? "Có" : "Không"}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {apartment.room.description}
                </p>
              </div>
            )}

            {/* AMENITIES */}
            <div>
              <p className="text-muted-foreground text-sm mb-2">Tiện nghi</p>

              {apartment.amenities?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {apartment.amenities.map((item) => (
                    <span
                      key={item.amenityId}
                      className="px-3 py-1 bg-muted rounded-full text-xs"
                    >
                      {item.nameEn} / {item.nameVi}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Không có tiện nghi</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

          {/* ACTION BUTTONS */}
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
    </div>
  );
}

export default ApartmentAction;
