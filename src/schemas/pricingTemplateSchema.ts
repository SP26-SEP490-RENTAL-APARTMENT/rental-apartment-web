import z from "zod";

export const createTemplateSchema = z.object({
  name: z
    .string()
    .min(1, "Template name is required")
    .max(100, "Template name must be less than 100 characters"),
  nameVi: z
    .string()
    .min(1, "Template name is required")
    .max(100, "Template name must be less than 100 characters"),
  code: z
    .string()
    .min(1, "Code is required")
    .max(50, "Code must be less than 50 characters")
    .regex(
      /^[A-Z0-9_]+$/,
      "Code must contain only uppercase letters, numbers, and underscores",
    ),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  descriptionVi: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),

  isActive: z.boolean(),
  parameters: z
    .array(
      z
        .object({
          parameterKey: z.string().min(1, "Parameter key is required"),

          displayName: z.string().min(1, "Display name is required"),

          displayNameVi: z.string().min(1, "Display name is required"),

          defaultValue: z.number().min(1, "Default value must be at least 1"),

          minValue: z.number().min(1, "Min value must be at least 1"),

          maxValue: z.number().min(2, "Max value must be greater than 1"),

          isAdjustable: z.boolean(),
        })
        .refine((data) => data.maxValue > data.minValue, {
          message: "Max value must be greater than Min value",
          path: ["maxValue"],
        })
        .refine(
          (data) =>
            data.defaultValue >= data.minValue &&
            data.defaultValue <= data.maxValue,
          {
            message:
              "Default value must be within the range of Min and Max values",
            path: ["defaultValue"],
          },
        ),
    )
    .min(1, "At least 1 parameter is required"),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export type CreateTemplateFormData = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateFormData = z.infer<typeof updateTemplateSchema>;
