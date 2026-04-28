import type { Apartment } from "@/types/apartment";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Badge } from "../badge";
import { useLocation } from "react-router-dom";

interface Props {
  apartment: Apartment;
  onAddPhotos?: (apartmentId: string, files: File[]) => Promise<void>;
}

const getStatusBadge = (status?: string | null) => {
  switch (status) {
    case "posted":
      return <Badge className="bg-blue-500 text-white">Posted</Badge>;
    case "pending_review":
      return <Badge className="bg-gray-500 text-white">Pending review</Badge>;
    default:
      return <Badge variant="secondary">Draft</Badge>;
  }
};

function ApartmentDetailDialog({ apartment, onAddPhotos }: Props) {
  const { user } = useAuthStore();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

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
          Host: {apartment.landlordName}
        </p>
      </div>

      {/* ===== INFO ===== */}
      <div className="grid grid-cols-2 gap-4 text-sm border rounded-lg p-4">
        <Info
          label="Price / night"
          value={`${apartment.basePricePerNight.toLocaleString()} VND`}
        />
        <Info label="Max occupant" value={apartment.maxOccupants} />
        <Info
          label="Pet"
          value={apartment.isPetAllowed ? "Allow" : "Not allowed"}
        />
        {apartment.maxPets && (
          <Info label="Max pet" value={apartment.maxPets} />
        )}
        <Info label="Status" value={getStatusBadge(apartment.status)} />
        <Info label="Booking" value={apartment.bookingStatus} />
        <Info
          label="Created at"
          value={new Date(apartment.createdAt).toLocaleDateString()}
        />
      </div>

      {/* ===== LOCATION ===== */}
      <div className="border rounded-lg p-4">
        <p className="font-semibold mb-1">Address</p>
        <p className="text-sm text-muted-foreground">
          {apartment.address}, {apartment.district}, {apartment.city}
        </p>
      </div>

      {/* ===== DESCRIPTION ===== */}
      <div className="border rounded-lg p-4">
        <p className="font-semibold mb-1">Description</p>
        <p className="text-sm">{apartment.description}</p>
      </div>

      {/* ===== ROOM ===== */}
      {apartment.room && (
        <div className="border rounded-lg p-4 space-y-3">
          <p className="font-semibold">Room infomation</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Title" value={apartment.room.title} />
            <Info label="Room type" value={apartment.room.roomType} />
            <Info label="Bed" value={apartment.room.bedType} />
            <Info label="Size" value={`${apartment.room.sizeSqm} m²`} />
            <Info
              label="Private bathroom"
              value={apartment.room.isPrivateBathroom ? "Yes" : "No"}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {apartment.room.description}
          </p>
        </div>
      )}

      {/* ===== AMENITIES ===== */}
      <div className="border rounded-lg p-4">
        <p className="font-semibold mb-2">Amenities</p>

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
          <p className="text-sm text-muted-foreground">No amenities</p>
        )}
      </div>

      {/* ===== ADD PHOTOS ===== */}
      {user?.roles.includes("landlord") &&
        location.pathname.includes("/landlord/apartments") && (
          <div className="border rounded-lg p-4 space-y-3">
            <p className="font-semibold">Upload photos</p>

            {error && <div className="text-sm text-destructive">{error}</div>}

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
              Browse images
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
