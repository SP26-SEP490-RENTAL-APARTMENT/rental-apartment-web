import z from "zod";

export const createApartmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  maxOccupants: z.number().min(1, "Max occupants must be at least 1"),
  isPetAllowed: z.boolean(),
  address: z.string().min(1, "Address is required"),
  district: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180"),
  basePricePerNight: z
    .number()
    .min(0, "Price must be greater than or equal to 0"),
  photos: z.instanceof(FileList).optional(),
});

export const updateApartmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  maxOccupants: z.number().min(1, "Max occupants must be at least 1"),
  isPetAllowed: z.boolean(),
  address: z.string().min(1, "Address is required"),
  district: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180"),
  basePricePerNight: z
    .number()
    .min(0, "Price must be greater than or equal to 0"),
});

export type CreateApartmentFormData = z.infer<typeof createApartmentSchema>;
export type UpdateApartmentFormData = z.infer<typeof updateApartmentSchema>;
