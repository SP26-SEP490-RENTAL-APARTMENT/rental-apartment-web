import z from "zod";

export const createSubscriptionPlanSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  priceMonthly: z.number().min(10000, "Price must be a positive number"),
  priceAnnual: z.number().min(10000, "Duration must be at least 1 month"),
  maxApartments: z.number().min(1, "Max apartments must be at least 1"),
  features: z.string().optional(),
  isActive: z.boolean(),
});

export const updateSubscriptionPlanSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  priceMonthly: z.number().min(10000, "Price must be a positive number"),
  priceAnnual: z.number().min(10000, "Duration must be at least 1 month"),
  maxApartments: z.number().min(1, "Max apartments must be at least 1"),
  features: z.string().optional(),
  isActive: z.boolean(),
});

export type CreateSubscriptionPlanFormData = z.infer<
  typeof createSubscriptionPlanSchema
>;
export type UpdateSubscriptionPlanFormData = z.infer<
  typeof updateSubscriptionPlanSchema
>;
