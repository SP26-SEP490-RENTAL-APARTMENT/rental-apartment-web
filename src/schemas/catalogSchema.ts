import z from "zod";

export const catalogSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean(),
});

export type CatalogFormData = z.infer<typeof catalogSchema>;
