import z from "zod";

const isValidJson = (value: string) => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

const optionalJsonField = (label: string) =>
  z
    .string()
    .optional()
    .refine(
      (value) => !value || value.trim().length === 0 || isValidJson(value),
      `${label} must be valid JSON`,
    );

export const catalogSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean(),
  dimensionsJson: optionalJsonField("Dimensions JSON"),
  metricsJson: optionalJsonField("Metrics JSON"),
  timeRangeJson: optionalJsonField("Time range JSON"),
});

export type CatalogFormData = z.infer<typeof catalogSchema>;
