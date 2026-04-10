import z from "zod";

export const inspectionChema = z.object({
  OverallCondition: z.string(),
  IssuesFound: z.string(),
  Recommendations: z.string(),
  Photos: z.array(z.instanceof(File)).min(1, "Phải upload ít nhất 1 ảnh"),
});

export type InspectionFormData = z.infer<typeof inspectionChema>;