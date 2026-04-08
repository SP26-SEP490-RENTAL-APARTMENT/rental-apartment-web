import z from "zod";

export const createIdentitySchema = z.object({
  DocumentType: z.enum([
    "passport",
    "national_id_card",
    "drivers_license",
    "other_government_id",
    "selfie_with_id",
  ]),
  Side: z.enum(["front", "back", "bio_page", "other"]),
  Files: z.instanceof(FileList).refine((files) => files?.length > 0, {
    message: "File is required",
  }),
  Notes: z.string().optional(),
});

export type CreateIdentityFormData = z.infer<typeof createIdentitySchema>;
