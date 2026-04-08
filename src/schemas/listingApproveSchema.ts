import z from "zod";

export const listingApproveSchema = z.object({
    approved: z.boolean(),
    rejectionReason: z.string().optional(),
    apartmentId: z.string(),
})

export type ListingApproveFormData = z.infer<typeof listingApproveSchema>