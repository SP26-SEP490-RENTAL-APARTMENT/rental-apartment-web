import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createApartmentSchema,
  updateApartmentSchema,
  type CreateApartmentFormData,
  type UpdateApartmentFormData,
} from "@/schemas/apartmentSchema";
import type { Apartment } from "@/types/apartment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import AddressAutocomplete from "./AddressAutocomplete";
import { useTranslation } from "react-i18next";
import { apartmentManagementApi } from "@/services/privateApi/landlordApi";
import { toast } from "sonner";

// Allowed file types for upload
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
const ALLOWED_IMAGE_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const ALLOWED_VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
const ALLOWED_VIDEO_CONTENT_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/webm",
];
const ALLOWED_EXTENSIONS = [
  ...ALLOWED_IMAGE_EXTENSIONS,
  ...ALLOWED_VIDEO_EXTENSIONS,
];
const ALLOWED_CONTENT_TYPES = [
  ...ALLOWED_IMAGE_CONTENT_TYPES,
  ...ALLOWED_VIDEO_CONTENT_TYPES,
];
const ACCEPT_ATTRIBUTE = "image/*,video/*";

export interface ApartmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateApartmentFormData | UpdateApartmentFormData,
  ) => Promise<void>;
  apartment: Partial<Apartment> | null;
  mode: "create" | "update";
  refetchApartments?: () => void;
}

function ApartmentForm({
  isOpen,
  onClose,
  onSubmit,
  apartment,
  mode,
  refetchApartments,
}: ApartmentFormProps) {
  const { t } = useTranslation("landlord");
  const isCreate = mode === "create";
  const schema = isCreate ? createApartmentSchema : updateApartmentSchema;

  const [preview, setPreview] = useState<any[]>([]);
  const [coords, setCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: isCreate
      ? {
          title: "",
          description: "",
          maxOccupants: 1,
          maxInfants: 0,
          isPetAllowed: false,
          maxPets: 0,
          address: "",
          district: "",
          city: "",
          latitude: 0,
          longitude: 0,
          basePricePerNight: 0,
          noShowGraceHours: 0,
        }
      : undefined,
  });

  const isPetAllowed = useWatch({
    control,
    name: "isPetAllowed",
  });

  const currentAddress = useWatch({
    control,
    name: "address",
  });

  // Log validation errors for debugging
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("🚨 Validation errors:", errors);
    }
  }, [errors]);

  // Reset form when dialog opens/closes or apartment changes
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (isCreate) {
      reset({
        title: "",
        description: "",
        maxOccupants: 1,
        maxInfants: 0,
        isPetAllowed: false,
        maxPets: 0,
        address: "",
        district: "",
        city: "",
        latitude: 0,
        longitude: 0,
        basePricePerNight: 0,
        noShowGraceHours: 0,
      });
      queueMicrotask(() => {
        setPreview([]);
        setSelectedFiles([]);
        setCoords(null);
      });
    } else if (apartment) {
      reset({
        title: apartment.title || "",
        description: apartment.description || "",
        maxOccupants: apartment.maxOccupants || 1,
        maxInfants: apartment.maxInfants || 0,
        isPetAllowed: apartment.isPetAllowed || false,
        maxPets: apartment.maxPets || 0,
        address: apartment.address || "",
        district: apartment.district || "",
        city: apartment.city || "",
        latitude: apartment.latitude || 0,
        longitude: apartment.longitude || 0,
        basePricePerNight: apartment.basePricePerNight || 0,
        noShowGraceHours: apartment.noShowGraceHours || 0,
      });
      queueMicrotask(() => {
        setPreview(apartment.media || []);
        setSelectedFiles([]);
        // Set coordinates for existing apartment
        if (apartment.latitude && apartment.longitude) {
          setCoords({
            lat: apartment.latitude,
            lng: apartment.longitude,
          });
        }
      });
    }
  }, [apartment, mode, reset, isCreate, isOpen]);

  const isValidFile = (file: File): boolean => {
    // Check file extension
    const fileName = file.name.toLowerCase();
    const fileExtension = "."
      .concat(fileName.split(".").pop() || "")
      .toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.includes(fileExtension);

    // Check content type
    const hasValidContentType = ALLOWED_CONTENT_TYPES.includes(file.type);

    return hasValidExtension && hasValidContentType;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const newFileArray = Array.from(files);

      const validFiles = newFileArray.filter((file) => {
        if (!isValidFile(file)) {
          alert(
            `Invalid file: ${file.name}. Only images (JPG, PNG, GIF, WebP) and videos (MP4, MOV, AVI, MKV, WebM) are allowed.`,
          );
          return false;
        }
        return true;
      });

      const combinedFiles = [...selectedFiles, ...validFiles].slice(0, 10);
      setSelectedFiles(combinedFiles);

      const newPreviews = validFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image/") ? "image" : "video",
      }));
      const combinedPreviews = [...preview, ...newPreviews].slice(0, 10);

      setPreview(combinedPreviews);
    }

    event.target.value = "";
  };

  const removePhoto = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);

    const updatedPreview = preview.filter((_, i) => i !== index);
    setPreview(updatedPreview);
  };

  const handleFormSubmit = async (
    data: CreateApartmentFormData | UpdateApartmentFormData,
  ) => {
    // Validate photos for create mode
    if (isCreate) {
      if (selectedFiles.length === 0) {
        console.error("❌ Validation error: Phải upload ít nhất 1 ảnh");
        alert("Upload atleast 1 photo");
        return;
      }
      if (selectedFiles.length > 10) {
        console.error("❌ Validation error: Tối đa 10 ảnh");
        alert("Maximum 10 photos allowed");
        return;
      }
    }

    try {
      if (isCreate) {
        // Create mode: use FormData for file upload
        const formData = new FormData();

        // Add form fields
        formData.append("title", String(data.title));
        formData.append("description", String(data.description));
        formData.append("maxOccupants", String(data.maxOccupants));
        formData.append("maxInfants", String(data.maxInfants));
        formData.append("isPetAllowed", String(data.isPetAllowed));
        if (data.isPetAllowed && "maxPets" in data) {
          formData.append("maxPets", String(data.maxPets));
        }
        formData.append("address", String(data.address));
        formData.append("district", String(data.district));
        formData.append("city", String(data.city));
        formData.append("latitude", String(coords?.lat));
        formData.append("longitude", String(coords?.lng));
        formData.append("basePricePerNight", String(data.basePricePerNight));
        formData.append("noShowGraceHours", String(data.noShowGraceHours));

        // Add photos
        if (selectedFiles.length > 0) {
          selectedFiles.forEach((file) => {
            formData.append("photos", file);
          });
          console.log("Photos added to FormData:", selectedFiles.length);
        } else {
          console.warn("No photos selected");
        }

        await onSubmit(
          formData as unknown as
            | CreateApartmentFormData
            | UpdateApartmentFormData,
        );
        console.log(formData);
      } else {
        // Update mode: use regular form data (JSON)
        await onSubmit(data);
      }

      reset();
      setPreview([]);
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!apartment?.apartmentId) return;
    try {
      await apartmentManagementApi.deleteMedia(apartment.apartmentId, mediaId);
      toast.success("Media deleted successfully");
      onClose();
      refetchApartments?.();
      setPreview((prev) => prev.filter((m) => m.mediaId !== mediaId));
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("Failed to delete media. Please try again.");
    }
  };

  const handleClose = () => {
    reset();
    setPreview([]);
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreate
              ? t("apartment.addApartment.addTitle")
              : t("apartment.addApartment.updateTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* TITLE */}
            <div className="grid gap-2">
              <Label htmlFor="title">
                {t("apartment.addApartment.title")} *
              </Label>
              <Input
                id="title"
                placeholder={t("apartment.addApartment.titlePlaceholder")}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="grid gap-2">
              <Label htmlFor="description">
                {t("apartment.addApartment.description")} *
              </Label>
              <Textarea
                id="description"
                placeholder={t("apartment.addApartment.descriptionPlaceholder")}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* GRID: MAX OCCUPANTS & PRICE */}
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="maxOccupants">
                  {t("apartment.addApartment.maxOccupancy")}
                </Label>
                <Input
                  id="maxOccupants"
                  type="number"
                  placeholder="10"
                  min={1}
                  {...register("maxOccupants", { valueAsNumber: true })}
                />
                {errors.maxOccupants && (
                  <p className="text-sm text-destructive">
                    {errors.maxOccupants.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="maxInfants">
                  {t("apartment.addApartment.maxInfants")}
                </Label>
                <Input
                  id="maxInfants"
                  type="number"
                  placeholder="10"
                  min={0}
                  {...register("maxInfants", { valueAsNumber: true })}
                />
                {errors.maxInfants && (
                  <p className="text-sm text-destructive">
                    {errors.maxInfants.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="basePricePerNight">
                  {t("apartment.addApartment.price")} *
                </Label>
                <Input
                  id="basePricePerNight"
                  type="number"
                  placeholder="100000"
                  min={0}
                  {...register("basePricePerNight", { valueAsNumber: true })}
                />
                {errors.basePricePerNight && (
                  <p className="text-sm text-destructive">
                    {errors.basePricePerNight.message}
                  </p>
                )}
              </div>
            </div>

            {/* ADDRESS */}
            <div className="grid gap-2">
              <Label htmlFor="address">
                {t("apartment.addApartment.address")} *
              </Label>

              <AddressAutocomplete
                value={currentAddress}
                onSelect={(data) => {
                  setValue("address", data.address);
                  setValue("city", data.city);
                  setValue("district", data.district);
                  setValue("latitude", data.lat);
                  setValue("longitude", data.lng);

                  setCoords({
                    lat: data.lat,
                    lng: data.lng,
                  });
                }}
              />

              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* GRID: DISTRICT & CITY */}
            {/* <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>District *</Label>
                <Select
                  onValueChange={(value) => setValue("district", value)}
                  defaultValue={apartment?.district}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districtsHCM.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>City *</Label>
                <Select
                  onValueChange={(value) => setValue("city", value)}
                  defaultValue={apartment?.city}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div> */}
            {/* PET ALLOWED */}
            <div className="grid gap-3">
              <Label
                htmlFor="isPetAllowed"
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  id="isPetAllowed"
                  type="checkbox"
                  className="w-4 h-4"
                  {...register("isPetAllowed")}
                />
                <span>{t("apartment.addApartment.allowPets")}</span>
              </Label>
              {isPetAllowed && (
                <div className="grid gap-2 pl-7">
                  <Label htmlFor="maxPets">
                    {t("apartment.addApartment.maxPets")}
                  </Label>
                  <Input
                    id="maxPets"
                    type="number"
                    min={0}
                    {...register("maxPets", { valueAsNumber: true })}
                  />
                  {errors.maxPets && (
                    <p className="text-sm text-destructive">
                      {errors.maxPets.message}
                    </p>
                  )}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="noShowGraceHours">Grace Hours</Label>
                <Input
                  id="noShowGraceHours"
                  type="number"
                  min={0}
                  max={6}
                  {...register("noShowGraceHours", { valueAsNumber: true })}
                />
                {errors.noShowGraceHours && (
                  <p className="text-sm text-destructive">
                    {errors.noShowGraceHours.message}
                  </p>
                )}
              </div>
            </div>

            {/* PHOTOS - ONLY FOR CREATE */}
            {isCreate && (
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="photos">
                    {t("apartment.addApartment.uploadPhotos")} *
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">
                    {t("apartment.addApartment.photoGuidelines")}
                  </p>
                  <label
                    htmlFor="photos"
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition cursor-pointer block"
                  >
                    <Input
                      id="photos"
                      type="file"
                      multiple
                      accept={ACCEPT_ATTRIBUTE}
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="text-sm text-gray-600">
                      <p>Click to upload images or videos</p>
                      <p className="text-xs mt-1">
                        Images: PNG, JPG, GIF, WebP | Videos: MP4, MOV, AVI,
                        MKV, WebM
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* PHOTO PREVIEW */}
            {preview.length > 0 && (
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <Label>
                    {t("apartment.addApartment.selectedPhotos")} (
                    {preview.length}/10)
                  </Label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {preview.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative w-full h-28 rounded-lg overflow-hidden bg-muted group"
                    >
                      {selectedFiles[idx]?.type.startsWith("video/") ||
                      src.url.includes("video/upload") ? (
                        <video
                          src={src.url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={src.url}
                          alt={`preview-${idx}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {isCreate && (
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      )}
                      {!isCreate && (
                        <button
                          onClick={() => handleDeleteMedia(src.mediaId)}
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      )}
                      <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t("apartment.button.cancel")}
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isCreate
                ? t("apartment.button.create")
                : t("apartment.button.update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ApartmentForm;
