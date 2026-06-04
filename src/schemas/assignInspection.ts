import z from "zod";

export const assignInspectionSchema = z.object({
  inspectorId: z.string(),
  apartmentId: z.string(),
  scheduledDateTime: z.string(),
});

export type AssignInspectionFormData = z.infer<typeof assignInspectionSchema>;
