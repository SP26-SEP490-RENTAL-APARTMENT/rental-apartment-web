import z from "zod";

export const availableDateSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
    reason: z.string().min(1, "Reason is required"),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const addAvailableDateSchema = z.object({
  ranges: z
    .array(availableDateSchema)
    .min(1, "At least one date range is required"),
});

export type AvailableDateFormData = z.infer<typeof availableDateSchema>;
export type AddAvailableDateFormData = z.infer<typeof addAvailableDateSchema>;
