import type { Apartment } from "@/types/apartment";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Badge } from "../badge";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bath, BedDouble, Camera, DoorOpen, MapPin, NotebookPen, PencilLine, Puzzle, RulerDimensionLine } from "lucide-react";

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
      <div className="space-y-3">
        {apartment.photos?.length > 0 ? (
          <>
            <div className="w-full h-72 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={apartment.photos[0]}
                alt="Main"
                className="w-full h-full object-cover"
              />
            </div>
            {apartment.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {apartment.photos.map((img: string, index: number) => (
                  <div
                    key={index}
                    className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer h-20 ${
                      index === 0 ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-72 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl text-muted-foreground">
            <span className="text-lg font-medium">No images available</span>
          </div>
        )}
      </div>

      {/* ===== HEADER ===== */}
      <div className="space-y-3 border-b pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {apartment.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t("apartment.infor.host")}:{" "}
              <span className="font-medium text-gray-700">
                {apartment.landlordName}
              </span>
            </p>
          </div>
          <div className="flex gap-2">{getStatusBadge(apartment.status)}</div>
        </div>
      </div>

      {/* ===== KEY INFO CARDS ===== */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            {t("apartment.infor.price")}
          </p>
          <p className="text-xl font-bold text-blue-900 mt-1">
            {apartment.basePricePerNight.toLocaleString()}{" "}
            <span className="text-sm">VND</span>
          </p>
        </div>
        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
            {t("apartment.addApartment.maxOccupancy")}
          </p>
          <p className="text-xl font-bold text-green-900 mt-1">
            {apartment.maxOccupants}
          </p>
        </div>
        <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
            {t("apartment.addApartment.maxInfants")}
          </p>
          <p className="text-xl font-bold text-purple-900 mt-1">
            {apartment.maxInfants}
          </p>
        </div>
        <div
          className={`bg-linear-to-br ${apartment.isPetAllowed ? "from-orange-50 to-orange-100 border-orange-200" : "from-gray-50 to-gray-100 border-gray-200"} rounded-lg p-4 border`}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: apartment.isPetAllowed ? "#7c2d12" : "#4b5563" }}
          >
            {t("apartment.addApartment.allowPets")}
          </p>
          <p
            className={`text-xl font-bold mt-1 ${apartment.isPetAllowed ? "text-orange-900" : "text-gray-700"}`}
          >
            {apartment.isPetAllowed
              ? t("apartment.infor.yes")
              : t("apartment.infor.no")}
          </p>
        </div>
      </div>

      {/* ===== LOCATION ===== */}
      <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
        <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <MapPin size={16} /> {t("apartment.infor.address")}
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {apartment.address}, {apartment.district}, {apartment.city}
        </p>
        <p className="text-xs text-gray-500 mt-3">
          {t("apartment.infor.createdAt")}:{" "}
          {new Date(apartment.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* ===== DESCRIPTION ===== */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <p className="font-semibold text-gray-900 mb-3">
          {t("apartment.addApartment.description")}
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {apartment.description}
        </p>
      </div>

      {/* ===== ROOM ===== */}
      {apartment.room && (
        <div className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-200 space-y-4">
          <div className="flex items-center gap-2">
            <span><NotebookPen size={16} /></span>
            <p className="font-semibold text-gray-900">
              {t("apartment.room.info")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              label={t("apartment.room.title")}
              value={apartment.room.title}
              icon=<PencilLine size={16} />
            />
            <InfoCard
              label={t("apartment.room.type")}
              value={getRoomTypeBadge(apartment.room.roomType)}
              icon=<DoorOpen size={16} />
            />
            <InfoCard
              label={t("apartment.room.bed")}
              value={getBedTypeBadge(apartment.room.bedType)}
              icon=<BedDouble size={16} />
            />
            <InfoCard
              label={t("apartment.room.size")}
              value={`${apartment.room.sizeSqm} m²`}
              icon=<RulerDimensionLine size={16} />
            />
          </div>

          <div className="bg-white/60 rounded-lg p-3 border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <span><Bath size={16} /></span>
              <p className="text-xs font-semibold text-indigo-700 uppercase">
                {t("apartment.room.privateBathroom")}
              </p>
            </div>
            <p className="text-sm font-medium text-gray-800">
              {apartment.room.isPrivateBathroom
                ? t("apartment.infor.yes")
                : t("apartment.infor.no")}
            </p>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed italic">
            {apartment.room.description}
          </p>
        </div>
      )}

      {/* ===== AMENITIES ===== */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <p className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Puzzle size={16} /> {t("apartment.amenity.title")}
        </p>

        {apartment.amenities?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {apartment.amenities.map((item) => (
              <span
                key={item.amenityId}
                className="px-4 py-2 text-sm font-medium bg-linear-to-r from-primary/10 to-primary/5 text-primary rounded-full border border-primary/20 hover:border-primary/40 transition-colors"
              >
                {item.nameVi}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No amenities listed</p>
        )}
      </div>

      {/* ===== ADD PHOTOS ===== */}
      {user?.roles.includes("landlord") &&
        location.pathname.includes("/landlord/apartments") && (
          <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-dashed border-amber-300 space-y-4">
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              <Camera size={16} /> {t("apartment.infor.uploadPhotos")}
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                ⚠️ {error}
              </div>
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
              className="w-full bg-white hover:bg-amber-50 text-gray-900 font-semibold border-2 border-amber-300 hover:border-amber-400 transition-all"
            >
              + {t("apartment.infor.browsePhotos")}
            </Button>

            {previewUrls.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-3">
                  {previewUrls.length} photo(s) selected
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="h-24 w-full object-cover rounded-lg shadow-md"
                      />
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedFiles.length > 0 && (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 transition-all"
              >
                {loading
                  ? "⏳ Uploading..."
                  : "✓ Upload " + selectedFiles.length + " Photo(s)"}
              </Button>
            )}
          </div>
        )}
    </div>
  );
}

/* Reusable Components */
const InfoCard = ({ label, value, icon }: any) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40 hover:bg-white/80 transition-colors">
    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 flex items-center gap-1">
      {icon} {label}
    </p>
    <p className="font-medium text-gray-800 text-sm">{value}</p>
  </div>
);

export default ApartmentDetailDialog;
