import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Apartment } from "@/types/apartment";
import { Eye, Trash2, UserRoundPen } from "lucide-react";

interface Props {
  apartment: Apartment;
  onDelete: (id: string) => void;
  onEdit: (apartment: Apartment) => void;
}
function ApartmentAction({ apartment, onEdit, onDelete }: Props) {
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
              <Button
                className="cursor-pointer"
                size="sm"
                variant="outline"
              >
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
    </div>
  );
}

export default ApartmentAction;
