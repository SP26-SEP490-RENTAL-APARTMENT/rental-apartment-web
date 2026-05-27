import z from "zod";

export const catalogDimensionSchema = z.object({
  field: z.string().min(1, "Dimension field is required"),
  alias: z.string().optional(),
});

export const catalogMetricSchema = z.object({
  field: z.string().min(1, "Metric field is required"),
  aggregation: z.string().min(1, "Aggregation is required"),
  alias: z.string().optional(),
});

export const catalogSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean(),
  dimensions: z.array(catalogDimensionSchema),
  metrics: z.array(catalogMetricSchema).min(1, "Add at least one metric"),
});

export type CatalogFormData = z.infer<typeof catalogSchema>;
