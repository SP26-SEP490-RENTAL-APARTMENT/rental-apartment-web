import type { Apartment } from "@/types/apartment";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Badge } from "../badge";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  apartment: Apartment;
  onAddPhotos?: (apartmentId: string, files: File[]) => Promise<void>;
}

function ApartmentDetailDialog({ apartment, onAddPhotos }: Props) {
  const { t } = useTranslation("landlord");
  const { t: statusT } = useTranslation("status");
  const { user } = useAuthStore();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  const getStatusBadge = (status?: string | null) => {
    switch (status) {
      case "posted":
        return (
          <Badge className="bg-blue-500 text-white">
            {statusT("apartment.posted")}
          </Badge>
        );
      case "pending_review":
        return (
          <Badge className="bg-gray-500 text-white">
            {statusT("apartment.pending")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{statusT("apartment.draft")}</Badge>;
    }
  };

  const getRoomTypeBadge = (roomType?: string | null) => {
    switch (roomType) {
      case "private_single":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
            {statusT("room.roomType.pSingle")}
          </Badge>
        );

      case "private_double":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            {statusT("room.roomType.pDouble")}
          </Badge>
        );

      case "shared_bed":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
            {statusT("room.roomType.sBed")}
          </Badge>
        );

      case "studio":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
            {statusT("room.roomType.studio")}
          </Badge>
        );

      case "other":
        return (
          <Badge className="bg-slate-500 hover:bg-slate-600 text-white">
            {statusT("room.roomType.other")}
          </Badge>
        );

      default:
        return (
          <Badge variant="secondary">{statusT("apartment.unknown")}</Badge>
        );
    }
  };

  const getBedTypeBadge = (bedType?: string | null) => {
    switch (bedType) {
      case "single":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            {statusT("room.bedType.single")}
          </Badge>
        );

      case "double":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            {statusT("room.bedType.double")}
          </Badge>
        );

      case "queen":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            {statusT("room.bedType.queen")}
          </Badge>
        );

      case "king":
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200">
            {statusT("room.bedType.king")}
          </Badge>
        );

      case "bunk":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
            {statusT("room.bedType.bunk")}
          </Badge>
        );

      case "shared":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            {statusT("room.bedType.shared")}
          </Badge>
        );

      default:
        return (
          <Badge variant="secondary">{statusT("apartment.unknown")}</Badge>
        );
    }
  };

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
          {t("apartment.infor.host")}: {apartment.landlordName}
        </p>
      </div>

      {/* ===== INFO ===== */}
      <div className="grid grid-cols-2 gap-4 text-sm border rounded-lg p-4">
        <Info
          label={t("apartment.infor.price")}
          value={`${apartment.basePricePerNight.toLocaleString()} VND`}
        />
        <Info
          label={t("apartment.addApartment.maxOccupancy")}
          value={apartment.maxOccupants}
        />
        <Info
          label={t("apartment.addApartment.maxInfants")}
          value={apartment.maxInfants}
        />
        <Info
          label={t("apartment.addApartment.allowPets")}
          value={
            apartment.isPetAllowed
              ? t("apartment.infor.yes")
              : t("apartment.infor.no")
          }
        />
        {apartment.maxPets && (
          <Info
            label={t("apartment.addApartment.maxPets")}
            value={apartment.maxPets}
          />
        )}
        <Info
          label={t("apartment.infor.status")}
          value={getStatusBadge(apartment.status)}
        />
        <Info
          label={t("apartment.infor.bookingStatus")}
          value={apartment.bookingStatus}
        />
        <Info
          label={t("apartment.infor.createdAt")}
          value={new Date(apartment.createdAt).toLocaleDateString()}
        />
      </div>

      {/* ===== LOCATION ===== */}
      <div className="border rounded-lg p-4">
        <p className="font-semibold mb-1">{t("apartment.infor.address")}</p>
        <p className="text-sm text-muted-foreground">
          {apartment.address}, {apartment.district}, {apartment.city}
        </p>
      </div>

      {/* ===== DESCRIPTION ===== */}
      <div className="border rounded-lg p-4">
        <p className="font-semibold mb-1">
          {t("apartment.addApartment.description")}
        </p>
        <p className="text-sm">{apartment.description}</p>
      </div>

      {/* ===== ROOM ===== */}
      {apartment.room && (
        <div className="border rounded-lg p-4 space-y-3">
          <p className="font-semibold">{t("apartment.room.info")}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info
              label={t("apartment.room.title")}
              value={apartment.room.title}
            />
            <Info
              label={t("apartment.room.type")}
              value={getRoomTypeBadge(apartment.room.roomType)}
            />
            <Info
              label={t("apartment.room.bed")}
              value={getBedTypeBadge(apartment.room.bedType)}
            />
            <Info
              label={t("apartment.room.size")}
              value={`${apartment.room.sizeSqm} m²`}
            />
            <Info
              label={t("apartment.room.privateBathroom")}
              value={apartment.room.isPrivateBathroom ? t("apartment.infor.yes") : t("apartment.infor.no")}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {apartment.room.description}
          </p>
        </div>
      )}

      {/* ===== AMENITIES ===== */}
      <div className="border rounded-lg p-4">
        <p className="font-semibold mb-2">{t("apartment.amenity.title")}</p>

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
            <p className="font-semibold">{t("apartment.infor.uploadPhotos")}</p>

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
              {t("apartment.infor.browsePhotos")}
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
