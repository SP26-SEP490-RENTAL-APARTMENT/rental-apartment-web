import z from "zod";

export const createPackageSchema = z.object({
  apartmentId: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().min(10000, "Price must be a positive number"),
  currency: z.string(),
  maxBookings: z.number().min(1, "Max bookings must be at least 1"),
  isActive: z.boolean(),
});

export const updatePackageSchema = createPackageSchema.partial();

export type CreatePackageFormData = z.infer<typeof createPackageSchema>;
export type UpdatePackageFormData = z.infer<typeof updatePackageSchema>;