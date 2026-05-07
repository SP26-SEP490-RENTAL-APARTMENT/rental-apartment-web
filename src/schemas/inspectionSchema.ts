import z from "zod";

export const inspectionChema = z.object({
  OverallCondition: z.string(),
  IssuesFound: z.string(),
  Recommendations: z.string(),
  Photos: z.array(z.instanceof(File)).min(1, "Upload at least one photo"),
});

export type InspectionFormData = z.infer<typeof inspectionChema>;