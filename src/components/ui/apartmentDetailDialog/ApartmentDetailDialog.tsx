import type { Apartment } from "@/types/apartment";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X, Upload } from "lucide-react";

interface Props {
  apartment: Apartment;
  onAddPhotos?: (apartmentId: string, files: File[]) => Promise<void>;
}

function ApartmentDetailDialog({ apartment, onAddPhotos }: Props) {
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

      {/* ADD PHOTOS SECTION */}
      <div className="border rounded-lg p-4 space-y-3">
        <p className="font-semibold">Thêm ảnh</p>

        {error && (
          <div className="bg-destructive/15 text-destructive px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={loading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-full"
          >
            <Upload className="mr-2" size={16} />
            Chọn ảnh (tối đa 10)
          </Button>

          {/* SELECTED FILES PREVIEW */}
          {previewUrls.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">
                Ảnh được chọn ({selectedFiles.length})
              </p>
              <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`preview-${index}`}
                      className="w-full h-20 object-cover rounded-md"
                    />
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={loading}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 animate-spin" size={16} />}
              {loading ? "Đang tải lên..." : "Upload ảnh"}
            </Button>
          )}
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
  );
}

export default ApartmentDetailDialog;
