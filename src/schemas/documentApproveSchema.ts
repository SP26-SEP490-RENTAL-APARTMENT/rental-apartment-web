import z from "zod";

export const documentApproveSchema = z
  .object({
    approved: z.boolean(),
    rejectionReason: z.string(),
    documentId: z.string(),
  })
  .refine((data) => data.approved || data.rejectionReason.trim().length > 0, {
    message: "Rejection reason is required when rejecting a document",
    path: ["rejectionReason"],
  });

export type DocumentApproveFormData = z.infer<typeof documentApproveSchema>;
