import z from "zod";

export const createNearbyAttractionSchema = z.object({
  nameEn: z.string().min(1, "Name (EN) is required"),
  nameVi: z.string().min(1, "Name (VN) is required"),
  type: z.string().min(1, "Type is required"),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
});

export const updateNearbyAttractionSchema = z.object({
  nameEn: z.string().min(1, "Name (EN) is required").optional(),
  nameVi: z.string().min(1, "Name (VN) is required").optional(),
  type: z.string().min(1, "Type is required").optional(),
  latitude: z
    .number()
    .min(-90)
    .max(90, "Latitude must be between -90 and 90")
    .optional(),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180")
    .optional(),
  address: z.string().min(1, "Address is required").optional(),
  city: z.string().min(1, "City is required").optional(),
});

export type CreateNearbyAttractionFormData = z.infer<
  typeof createNearbyAttractionSchema
>;
export type UpdateNearbyAttractionFormData = z.infer<
  typeof updateNearbyAttractionSchema
>;
