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

export interface ApartmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateApartmentFormData | UpdateApartmentFormData,
  ) => Promise<void>;
  apartment: Partial<Apartment> | null;
  mode: "create" | "update";
}

// const generateLatLng = () => {
//   return {
//     lat: 10.7 + Math.random() * 0.1,
//     lng: 106.6 + Math.random() * 0.1,
//   };
// };

function ApartmentForm({
  isOpen,
  onClose,
  onSubmit,
  apartment,
  mode,
}: ApartmentFormProps) {
  const isCreate = mode === "create";
  const schema = isCreate ? createApartmentSchema : updateApartmentSchema;

  const [preview, setPreview] = useState<string[]>([]);
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
          isPetAllowed: false,
          maxPets: 0,
          address: "",
          district: "",
          city: "",
          latitude: 0,
          longitude: 0,
          basePricePerNight: 0,
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
        isPetAllowed: false,
        maxPets: 0,
        address: "",
        district: "",
        city: "",
        latitude: 0,
        longitude: 0,
        basePricePerNight: 0,
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
        isPetAllowed: apartment.isPetAllowed || false,
        maxPets: apartment.maxPets || 0,
        address: apartment.address || "",
        district: apartment.district || "",
        city: apartment.city || "",
        latitude: apartment.latitude || 0,
        longitude: apartment.longitude || 0,
        basePricePerNight: apartment.basePricePerNight || 0,
      });
      queueMicrotask(() => {
        setPreview(apartment.photos || []);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFileArray = Array.from(files);
      // Combine new files with existing ones (max 10)
      const combinedFiles = [...selectedFiles, ...newFileArray].slice(0, 10);
      setSelectedFiles(combinedFiles);

      // Create preview URLs for new files
      const newPreviews = newFileArray.map((file) => URL.createObjectURL(file));
      const combinedPreviews = [...preview, ...newPreviews].slice(0, 10);
      setPreview(combinedPreviews);
    }
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
        alert("Phải upload ít nhất 1 ảnh");
        return;
      }
      if (selectedFiles.length > 10) {
        console.error("❌ Validation error: Tối đa 10 ảnh");
        alert("Tối đa 10 ảnh");
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
            {isCreate ? "Add New Apartment" : "Edit Apartment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* TITLE */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Apartment title"
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
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Apartment description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* GRID: MAX OCCUPANTS & PRICE */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="maxOccupants">Max Occupants *</Label>
                <Input
                  id="maxOccupants"
                  type="number"
                  placeholder="10"
                  {...register("maxOccupants", { valueAsNumber: true })}
                />
                {errors.maxOccupants && (
                  <p className="text-sm text-destructive">
                    {errors.maxOccupants.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="basePricePerNight">
                  Base Price per Night *
                </Label>
                <Input
                  id="basePricePerNight"
                  type="number"
                  placeholder="100000"
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
              <Label>Address *</Label>

              <AddressAutocomplete
                value={currentAddress}
                onSelect={(data) => {
                  setValue("address", data.address);
                  setValue("city", data.city);
                  setValue("district", data.district);

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
                <span>Allow pets</span>
              </Label>
              {isPetAllowed && (
                <div className="grid gap-2 pl-7">
                  <Label htmlFor="maxPets">Max pets</Label>
                  <Input
                    id="maxPets"
                    type="number"
                    placeholder="Enter maximum number of pets"
                    {...register("maxPets", { valueAsNumber: true })}
                  />
                  {errors.maxPets && (
                    <p className="text-sm text-destructive">
                      {errors.maxPets.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* PHOTOS - ONLY FOR CREATE */}
            {isCreate && (
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="photos">Upload Photos *</Label>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">
                    Max 10 photos
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition cursor-pointer">
                    <Input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="photos" className="cursor-pointer block">
                      <div className="text-sm text-gray-600">
                        
                        <p className="text-xs mt-1">
                          PNG, JPG, GIF
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* PHOTO PREVIEW */}
            {preview.length > 0 && (
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <Label>Ảnh đã chọn ({preview.length}/10)</Label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {preview.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative w-full h-28 rounded-lg overflow-hidden bg-muted group"
                    >
                      <img
                        src={src}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover"
                      />
                      {isCreate && (
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          title="Xóa ảnh này"
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
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isCreate
                  ? "Creating..."
                  : "Updating..."
                : isCreate
                  ? "Create Apartment"
                  : "Update Apartment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ApartmentForm;
