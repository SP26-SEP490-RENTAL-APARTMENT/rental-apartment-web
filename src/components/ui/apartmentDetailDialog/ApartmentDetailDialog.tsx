import type { Apartment } from "@/types/apartment";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

interface Props {
  apartment: Apartment;
  onAddPhotos?: (apartmentId: string, files: File[]) => Promise<void>;
}

function ApartmentDetailDialog({ apartment, onAddPhotos }: Props) {
  const { user } = useAuthStore();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (selectedFiles.length + files.length > 10) {
      setError("Maximum 10 photos allowed");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);
    setError(null);

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one photo");
      return;
    }
    if (!onAddPhotos) return;

    setLoading(true);
    setError(null);
    try {
      await onAddPhotos(apartment.apartmentId, selectedFiles);
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (err) {
      setError("Failed to upload photos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[75vh] overflow-y-auto space-y-6 pr-2">
      {/* ===== GALLERY ===== */}
      <div className="grid grid-cols-3 gap-2">
        {apartment.photos?.length > 0 ? (
          apartment.photos.map((img: string, index: number) => (
            <img
              key={index}
              src={img}
              className={`rounded-lg object-cover w-full ${
                index === 0 ? "col-span-3 h-56" : "h-24"
              }`}
            />
          ))
        ) : (
          <div className="col-span-3 h-56 flex items-center justify-center bg-muted rounded-lg">
            No image
          </div>
        )}
      </div>

      {/* ===== TITLE ===== */}
      <div>
        <h2 className="text-xl font-semibold">{apartment.title}</h2>
        <p className="text-sm text-muted-foreground">
          Chủ nhà: {apartment.landlordName}
        </p>
      </div>

      {/* ===== INFO ===== */}
      <div className="grid grid-cols-2 gap-4 text-sm border rounded-lg p-4">
        <Info label="Giá / đêm" value={`${apartment.basePricePerNight.toLocaleString()} VND`} />
        <Info label="Số người" value={apartment.maxOccupants} />
        <Info label="Thú cưng" value={apartment.isPetAllowed ? "Cho phép" : "Không"} />
        <Info label="Số thú tối đa" value={apartment.maxPets ?? "Không giới hạn"} />
        <Info label="Trạng thái" value={apartment.status} />
        <Info label="Booking" value={apartment.bookingStatus} />
        <Info
          label="Ngày tạo"
          value={new Date(apartment.createdAt).toLocaleDateString()}
        />
      </div>

      {/* ===== LOCATION ===== */}
      <div className="border rounded-lg p-4">
        <p className="font-semibold mb-1">Địa chỉ</p>
        <p className="text-sm text-muted-foreground">
          {apartment.address}, {apartment.district}, {apartment.city}
        </p>
      </div>

      {/* ===== DESCRIPTION ===== */}
      <div className="border rounded-lg p-4">
        <p className="font-semibold mb-1">Mô tả</p>
        <p className="text-sm">{apartment.description}</p>
      </div>

      {/* ===== ROOM ===== */}
      {apartment.room && (
        <div className="border rounded-lg p-4 space-y-3">
          <p className="font-semibold">Thông tin phòng</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Tên phòng" value={apartment.room.title} />
            <Info label="Loại phòng" value={apartment.room.roomType} />
            <Info label="Giường" value={apartment.room.bedType} />
            <Info label="Diện tích" value={`${apartment.room.sizeSqm} m²`} />
            <Info
              label="WC riêng"
              value={apartment.room.isPrivateBathroom ? "Có" : "Không"}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {apartment.room.description}
          </p>
        </div>
      )}

      {/* ===== AMENITIES ===== */}
      <div className="border rounded-lg p-4">
        <p className="font-semibold mb-2">Tiện nghi</p>

        {apartment.amenities?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {apartment.amenities.map((item) => (
              <span
                key={item.amenityId}
                className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
              >
                {item.nameVi}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Không có tiện nghi</p>
        )}
      </div>

      {/* ===== ADD PHOTOS ===== */}
      {user?.roles.includes("landlord") && (
        <div className="border rounded-lg p-4 space-y-3">
          <p className="font-semibold">Thêm ảnh</p>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            Chọn ảnh
          </Button>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    className="h-20 w-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedFiles.length > 0 && (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* Reusable */
const Info = ({ label, value }: any) => (
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default ApartmentDetailDialog;
