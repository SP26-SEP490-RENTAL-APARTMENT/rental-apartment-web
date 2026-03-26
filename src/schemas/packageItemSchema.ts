import z from "zod";

export const createPackageItemSchema = z.object({
  itemName: z.string(),
  itemDescription: z.string().optional(),
  quantity: z.number(),
  estimatedValue: z.number(),
  sortOrder: z.number().optional(),
});

export const updatePackageItemSchema = createPackageItemSchema.partial();

export type CreatePackageItemFormData = z.infer<typeof createPackageItemSchema>;
export type UpdatePackageItemFormData = z.infer<typeof updatePackageItemSchema>;