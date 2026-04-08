import z from "zod";

export const checkAvailabilitySchema = z
  .object({
    apartmentId: z.string(),
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type CheckAvailabilityFormData = z.infer<typeof checkAvailabilitySchema>;
