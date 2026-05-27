import z from "zod";

export const pricingPolicySchema = z.object({
  templateId: z.string().min(1, "Please select template"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  isEnabled: z.boolean(),
  overrides: z.record(z.string(), z.coerce.number()),
});

export type PricingPolicyFormData = z.infer<typeof pricingPolicySchema>;
