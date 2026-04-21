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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useForm } from "react-hook-form";

const cities = ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng"];

const districtsHCM = [
  "Quận 1",
  "Quận 2",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 7",
  "Bình Thạnh",
  "Thủ Đức",
];

export interface ApartmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateApartmentFormData | UpdateApartmentFormData,
  ) => Promise<void>;
  apartment: Partial<Apartment> | null;
  mode: "create" | "update";
}

const generateLatLng = () => {
  return {
    lat: 10.7 + Math.random() * 0.1,
    lng: 106.6 + Math.random() * 0.1,
  };
};

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
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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
          address: "",
          district: "",
          city: "",
          latitude: 0,
          longitude: 0,
          basePricePerNight: 0,
        }
      : undefined,
  });

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
        address: "",
        district: "",
        city: "",
        latitude: 0,
        longitude: 0,
        basePricePerNight: 0,
      });
      queueMicrotask(() => {
        setPreview([]);
        setSelectedFiles(null);
      });
    } else if (apartment) {
      reset({
        title: apartment.title || "",
        description: apartment.description || "",
        maxOccupants: apartment.maxOccupants || 1,
        isPetAllowed: apartment.isPetAllowed || false,
        address: apartment.address || "",
        district: apartment.district || "",
        city: apartment.city || "",
        latitude: apartment.latitude || 0,
        longitude: apartment.longitude || 0,
        basePricePerNight: apartment.basePricePerNight || 0,
      });
      queueMicrotask(() => {
        setPreview(apartment.photos || []);
        setSelectedFiles(null);
      });
    }
  }, [apartment, mode, reset, isCreate, isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
      // Create preview URLs
      const previews = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setPreview(previews);
    }
  };

  const handleFormSubmit = async (
    data: CreateApartmentFormData | UpdateApartmentFormData,
  ) => {
    const { lat, lng } = generateLatLng();
    try {
      if (isCreate) {
        // Create mode: use FormData for file upload
        const formData = new FormData();

        // Add form fields
        formData.append("title", String(data.title));
        formData.append("description", String(data.description));
        formData.append("maxOccupants", String(data.maxOccupants));
        formData.append("isPetAllowed", String(data.isPetAllowed));
        formData.append("address", String(data.address));
        formData.append("district", String(data.district));
        formData.append("city", String(data.city));
        formData.append("latitude", String(lat));
        formData.append("longitude", String(lng));
        formData.append("basePricePerNight", String(data.basePricePerNight));

        // Add photos
        if (selectedFiles) {
          Array.from(selectedFiles).forEach((file) => {
            formData.append("photos", file);
          });
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
      setSelectedFiles(null);
      onClose();
    } catch {
      // Error handling is done in the parent component
    }
  };

  const handleClose = () => {
    reset();
    setPreview([]);
    setSelectedFiles(null);
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
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="123 Nguyễn Văn Cừ"
                {...register("address")}
              />
              <p className="text-xs text-muted-foreground">
                Enter street and house number
              </p>
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* GRID: DISTRICT & CITY */}
            <div className="grid grid-cols-2 gap-4">
              {/* <div className="grid gap-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  placeholder="District"
                  {...register("district")}
                />
                {errors.district && (
                  <p className="text-sm text-destructive">
                    {errors.district.message}
                  </p>
                )}
              </div> */}

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

              {/* <div className="grid gap-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" placeholder="City" {...register("city")} />
                {errors.city && (
                  <p className="text-sm text-destructive">
                    {errors.city.message}
                  </p>
                )}
              </div> */}
            </div>

            {/* GRID: LATITUDE & LONGITUDE */}
            {/* <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  placeholder="21.0285"
                  {...register("latitude", { valueAsNumber: true })}
                />
                {errors.latitude && (
                  <p className="text-sm text-destructive">
                    {errors.latitude.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  placeholder="105.8542"
                  {...register("longitude", { valueAsNumber: true })}
                />
                {errors.longitude && (
                  <p className="text-sm text-destructive">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div> */}

            {/* PET ALLOWED */}
            <div className="grid gap-2">
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
            </div>

            {/* PHOTOS - ONLY FOR CREATE */}
            {isCreate && (
              <div className="grid gap-2">
                <Label htmlFor="photos">Upload Photos</Label>
                <Input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {/* <p className="text-xs text-muted-foreground">
                  You can upload multiple photos. Only available when creating.
                </p> */}
              </div>
            )}

            {/* PHOTO PREVIEW */}
            {preview.length > 0 && (
              <div className="grid gap-2">
                <Label>Photo Preview</Label>
                <div className="grid grid-cols-3 gap-2">
                  {preview.map((src, idx) => (
                    <div
                      key={idx}
                      className="w-full h-24 rounded-lg overflow-hidden bg-muted"
                    >
                      <img
                        src={src}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover"
                      />
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
